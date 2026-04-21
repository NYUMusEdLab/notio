"""
Flow Verification Reminder Hook — PostToolUse nudge after file edits.

After a file edit succeeds, checks if the edited file appears in any
documented flow under .github/skills/flows/. If so, injects a minimal
system message naming the specific flow.
"""

import json
import re
import sys
from fnmatch import fnmatch
from pathlib import Path

EDIT_TOOL_NAMES = {
    "replace_string_in_file",
    "multi_replace_string_in_file",
    "create_file",
    "edit_notebook_file",
}


def locate_flows_directory():
    """Walk up from cwd to find .github/skills/flows/."""
    current_directory = Path.cwd()
    for ancestor in [current_directory, *current_directory.parents]:
        flows_directory = ancestor / ".github" / "skills" / "flows"
        if flows_directory.is_dir():
            return flows_directory
    return None


def extract_flow_file_references(flows_directory):
    """Scan flow docs for referenced file paths."""
    flow_references = []

    for flow_file in flows_directory.glob("*.md"):
        if flow_file.name == "SKILL.md":
            continue

        flow_name = flow_file.stem
        content = flow_file.read_text(encoding="utf-8")

        for match in re.finditer(r"`([^`]+\.[a-zA-Z]{1,5})`", content):
            referenced_path = match.group(1)
            flow_references.append({
                "flow_name": flow_name,
                "referenced_path": referenced_path,
            })

        for match in re.finditer(r'entry:\s*"?([^"\n]+)', content):
            entry_path = match.group(1).split(":")[0]
            flow_references.append({
                "flow_name": flow_name,
                "referenced_path": entry_path,
            })

    return flow_references


def find_affected_flow(edited_file_path, flow_references):
    """Return the flow name if the edited file matches any flow reference."""
    normalized_path = edited_file_path.replace("\\", "/")
    file_name = normalized_path.split("/")[-1]

    seen_flows = set()
    for reference in flow_references:
        ref_path = reference["referenced_path"]
        flow_name = reference["flow_name"]

        if flow_name in seen_flows:
            continue

        if file_name == ref_path.split("/")[-1]:
            return flow_name

        path_segments = normalized_path.split("/")
        for start_index in range(len(path_segments)):
            path_tail = "/".join(path_segments[start_index:])
            if fnmatch(path_tail, ref_path) or path_tail == ref_path:
                return flow_name

        seen_flows.add(flow_name)

    return None


def main():
    try:
        hook_input = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = hook_input.get("toolName", "")
    if tool_name not in EDIT_TOOL_NAMES:
        sys.exit(0)

    edited_file_path = hook_input.get("toolInput", {}).get("filePath", "")
    if not edited_file_path:
        sys.exit(0)

    flows_directory = locate_flows_directory()
    if not flows_directory:
        sys.exit(0)

    flow_references = extract_flow_file_references(flows_directory)
    if not flow_references:
        sys.exit(0)

    affected_flow_name = find_affected_flow(edited_file_path, flow_references)
    if affected_flow_name:
        output = {
            "systemMessage": (
                f"Note: the file you just edited is part of the documented flow '{affected_flow_name}'. "
                "If you changed its behavior, verify the flow doc is still accurate."
            )
        }
        json.dump(output, sys.stdout)

    sys.exit(0)


if __name__ == "__main__":
    main()