"""
Dangerous Command Guard Hook — PreToolUse enforcement for terminal commands.

Checks whether a terminal command contains potentially destructive patterns.
Returns an 'ask' decision so the user is informed and can approve or reject.

Never blocks outright — the goal is awareness, not restriction.
"""

import json
import re
import sys
from pathlib import Path

DANGEROUS_PATTERNS = [
    (r"git\s+(push\s+.*--force|reset\s+--hard|clean\s+-fd)", "Destructive git operation — may lose commits or untracked files"),
    (r"DROP\s+(TABLE|DATABASE|SCHEMA|INDEX)", "Database DROP statement — permanent data loss risk"),
    (r"TRUNCATE\s+TABLE", "Database TRUNCATE — removes all rows without logging"),
    (r"DELETE\s+FROM\s+\S+\s*($|;|WHERE\s+1)", "Broad DELETE — may remove more data than intended"),
    (r"rm\s+-rf\s+/", "Recursive delete from root — extremely dangerous"),
    (r"rm\s+-rf\s+\.(?:/|\s|$)", "Recursive delete of current directory"),
    (r"Remove-Item\s+.*-Recurse.*-Force", "PowerShell recursive force delete"),
    (r"docker\s+(system\s+prune|rm\s+-f|rmi\s+-f)", "Docker cleanup — may remove containers or images in use"),
    (r"npm\s+publish", "Publishing package to registry — public and hard to undo"),
    (r"terraform\s+destroy", "Terraform destroy — removes infrastructure resources"),
    (r"kubectl\s+delete\s+(namespace|deployment|service)", "Kubernetes resource deletion"),
]


def is_section_heading(line):
    return re.match(r"^##\s+", line)


def parse_dangerous_commands_row(line):
    if not line.startswith("|"):
        return None

    columns = [column.strip() for column in line.split("|")[1:-1]]
    if len(columns) < 2:
        return None
    if re.match(r"^-+$", columns[0]) or columns[0] in ("Pattern", "Command"):
        return None
    if columns[0].startswith("{"):
        return None

    return columns[0].strip("`"), columns[1]


def find_project_dangerous_patterns():
    """Look for project-specific dangerous patterns in constraints.md."""
    current_directory = Path.cwd()
    for ancestor in [current_directory, *current_directory.parents]:
        constraints_path = ancestor / ".github" / "copilot" / "constraints.md"
        if constraints_path.exists():
            return extract_dangerous_commands_section(constraints_path)
    return []


def extract_dangerous_commands_section(constraints_path):
    """Parse a 'Dangerous Commands' section from constraints.md if present."""
    content = constraints_path.read_text(encoding="utf-8")
    project_patterns = []
    in_dangerous_section = False

    for line in content.splitlines():
        if re.match(r"^##\s+Dangerous Commands", line):
            in_dangerous_section = True
            continue
        if in_dangerous_section and is_section_heading(line):
            break
        if not in_dangerous_section:
            continue

        parsed_row = parse_dangerous_commands_row(line)
        if parsed_row:
            project_patterns.append(parsed_row)

    return project_patterns


def find_matching_dangerous_pattern(command_text):
    """Return the first matching pattern and reason, or None."""
    all_patterns = DANGEROUS_PATTERNS + find_project_dangerous_patterns()

    for pattern, reason in all_patterns:
        if re.search(pattern, command_text, re.IGNORECASE):
            return reason

    return None


def build_ask_response(reason):
    return {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": f"[Dangerous Command] {reason}",
        }
    }


def main():
    try:
        hook_input = json.loads(sys.stdin.read())
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    tool_name = hook_input.get("toolName", "")
    if tool_name != "run_in_terminal":
        sys.exit(0)

    command_text = hook_input.get("toolInput", {}).get("command", "")
    if not command_text:
        sys.exit(0)

    matched_reason = find_matching_dangerous_pattern(command_text)
    if matched_reason:
        json.dump(build_ask_response(matched_reason), sys.stdout)

    sys.exit(0)


if __name__ == "__main__":
    main()