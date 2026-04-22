"""
Constraint Forwarding Hook — SubagentStart context injection.

When a subagent starts, it has a fresh context with no knowledge of
project constraints. This hook reads constraints.md and injects a
compact summary as a system message.
"""

import json
import re
import sys
from pathlib import Path


def locate_constraints_in_ancestor_directories():
    """Walk up from cwd to find .github/copilot/constraints.md."""
    current_directory = Path.cwd()
    for ancestor in [current_directory, *current_directory.parents]:
        constraints_path = ancestor / ".github" / "copilot" / "constraints.md"
        if constraints_path.exists():
            return constraints_path
    return None


def is_meaningful_line(line):
    stripped_line = line.strip()
    return bool(stripped_line) and not stripped_line.startswith("<!--")


def extract_hard_rule(current_section, line):
    if current_section == "Hard Rules" and line.strip().startswith("- "):
        rule_text = line.strip().lstrip("- ")
        if not rule_text.startswith("{"):
            return f"  RULE: {rule_text}"
    return None


def extract_enforceable_row(current_section, line):
    if not line.startswith("|"):
        return None
    if current_section not in ("Protected Contracts", "Security Boundaries", "Fragile Areas"):
        return None

    columns = [column.strip() for column in line.split("|")[1:-1]]
    if len(columns) < 4:
        return None
    if re.match(r"^-+$", columns[0]) or columns[0] in ("Contract", "Boundary", "Area"):
        return None
    if columns[0].startswith("{"):
        return None

    constraint_name = columns[0]
    glob_pattern = columns[1].strip("`")
    enforcement_action = columns[2].strip("`")
    reason = columns[3]
    return (
        f"  {current_section.upper()}: {constraint_name} "
        f"[{glob_pattern}] -> {enforcement_action}: {reason}"
    )


def build_constraint_summary(constraints_path):
    """Build a compact summary of hard rules and enforceable paths."""
    content = constraints_path.read_text(encoding="utf-8")
    summary_lines = ["Project constraints (from constraints.md):"]
    current_section = ""

    for line in content.splitlines():
        section_heading = re.match(r"^##\s+(.+)", line)
        if section_heading:
            current_section = section_heading.group(1).strip()
            continue

        if not is_meaningful_line(line):
            continue

        hard_rule = extract_hard_rule(current_section, line)
        if hard_rule:
            summary_lines.append(hard_rule)
            continue

        enforceable_row = extract_enforceable_row(current_section, line)
        if enforceable_row:
            summary_lines.append(enforceable_row)

    if len(summary_lines) == 1:
        return None

    return "\n".join(summary_lines)


def main():
    try:
        json.loads(sys.stdin.read())
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    constraints_path = locate_constraints_in_ancestor_directories()
    if not constraints_path:
        sys.exit(0)

    constraint_summary = build_constraint_summary(constraints_path)
    if constraint_summary:
        json.dump({"systemMessage": constraint_summary}, sys.stdout)

    sys.exit(0)


if __name__ == "__main__":
    main()