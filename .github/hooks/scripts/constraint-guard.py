"""
Constraint Guard Hook — PreToolUse enforcement for DAL-Agile.

Reads constraints.md and checks whether a file edit targets a protected,
security-sensitive, or fragile path. Returns ask/allow decisions via JSON.

Expects JSON on stdin with hookEventName, toolName, and toolInput.
Returns JSON on stdout with permissionDecision and reason.
"""

import json
import re
import sys
from fnmatch import fnmatch
from pathlib import Path


def locate_constraints_in_ancestor_directories():
    """Walk up from cwd to find .github/copilot/constraints.md."""
    current_directory = Path.cwd()
    for ancestor in [current_directory, *current_directory.parents]:
        constraints_path = ancestor / ".github" / "copilot" / "constraints.md"
        if constraints_path.exists():
            return constraints_path
    return None


def extract_enforceable_constraints(markdown_content):
    """
    Parse markdown tables that have Pattern and Enforcement columns.
    Returns list of dicts: {section, constraint_name, glob_pattern, enforcement_action, reason}
    """
    enforceable_constraints = []
    current_section = ""
    valid_enforcement_actions = ("ask", "deny", "warn")

    for line in markdown_content.splitlines():
        section_heading = re.match(r"^##\s+(.+)", line)
        if section_heading:
            current_section = section_heading.group(1).strip()
            continue

        if not line.startswith("|"):
            continue

        columns = [column.strip() for column in line.split("|")[1:-1]]
        if len(columns) < 4:
            continue

        is_separator_row = all(re.match(r"^-+$", column) for column in columns)
        is_header_row = columns[1] in ("Pattern", "File")
        is_template_placeholder = columns[0].startswith("{")
        if is_separator_row or is_header_row or is_template_placeholder:
            continue

        constraint_name = columns[0]
        glob_pattern = columns[1].strip("`")
        enforcement_action = columns[2].strip("`")
        reason = columns[3] if len(columns) > 3 else ""

        if enforcement_action in valid_enforcement_actions:
            enforceable_constraints.append(
                {
                    "section": current_section,
                    "constraint_name": constraint_name,
                    "glob_pattern": glob_pattern,
                    "enforcement_action": enforcement_action,
                    "reason": reason,
                }
            )

    return enforceable_constraints


def find_matching_constraint(target_file_path, enforceable_constraints):
    """Return the first constraint whose glob pattern matches the target file path, or None."""
    normalized_path = target_file_path.replace("\\", "/")
    path_segments = normalized_path.split("/")
    file_name = path_segments[-1]

    for constraint in enforceable_constraints:
        glob_pattern = constraint["glob_pattern"]

        if fnmatch(normalized_path, glob_pattern) or fnmatch(file_name, glob_pattern):
            return constraint

        for start_index in range(len(path_segments)):
            path_tail = "/".join(path_segments[start_index:])
            if fnmatch(path_tail, glob_pattern):
                return constraint

    return None


EDIT_TOOL_NAMES = {
    "replace_string_in_file",
    "multi_replace_string_in_file",
    "create_file",
    "edit_notebook_file",
}


def read_hook_input():
    """Read and parse JSON hook input from stdin. Returns None if unparseable."""
    try:
        return json.loads(sys.stdin.read())
    except (json.JSONDecodeError, EOFError):
        return None


def is_file_edit_tool(tool_name):
    return tool_name in EDIT_TOOL_NAMES


def build_permission_response(matched_constraint):
    """Build the JSON response that tells VS Code how to handle this tool call."""
    enforcement_action = matched_constraint["enforcement_action"]
    section = matched_constraint["section"]
    constraint_name = matched_constraint["constraint_name"]
    reason = matched_constraint["reason"]

    decision = enforcement_action if enforcement_action != "warn" else "ask"
    decision_reason = f"[{section}] {constraint_name}: {reason}"

    return {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": decision_reason,
        }
    }


def main():
    hook_input = read_hook_input()
    if not hook_input:
        sys.exit(0)

    tool_name = hook_input.get("toolName", "")
    if not is_file_edit_tool(tool_name):
        sys.exit(0)

    target_file_path = hook_input.get("toolInput", {}).get("filePath", "")
    if not target_file_path:
        sys.exit(0)

    constraints_path = locate_constraints_in_ancestor_directories()
    if not constraints_path:
        sys.exit(0)

    markdown_content = constraints_path.read_text(encoding="utf-8")
    enforceable_constraints = extract_enforceable_constraints(markdown_content)
    if not enforceable_constraints:
        sys.exit(0)

    matched_constraint = find_matching_constraint(target_file_path, enforceable_constraints)
    if matched_constraint:
        json.dump(build_permission_response(matched_constraint), sys.stdout)

    sys.exit(0)


if __name__ == "__main__":
    main()