# .ai/ - AI-Assisted Development Resources

This folder contains all AI-related content for the Notio project, keeping it separate from the application code.

## Folder Structure

```
.ai/
├── agents/          # Agent definitions and prompts
├── plans/           # Migration plans and roadmaps
├── reports/         # Code audits and analysis reports
├── docs/            # AI workflow documentation
└── hooks/           # Git hooks for automation
```

## Contents

### 📁 agents/
Agent prompt definitions that can be invoked by Claude Code or other AI tools.

- `analyzer.md` - Code quality and architecture auditor
- `architect.md` - High-level design and architecture planner
- `planner.md` - Tactical task breakdown and sequencing
- `developer.md` - Implementation agent
- `tester.md` - Test creation and validation
- `reviewer.md` - Code review and quality gate
- `git-agent.md` - Automated git commit agent

### 📁 plans/
Strategic plans and roadmaps for major changes.

- `react-19-migration.md` - Complete React 19 upgrade plan
- `quick-wins.md` - Fast improvements (< 2 hours each)

### 📁 reports/
Analysis reports and audit findings.

- `code-audit-2025-11-11.md` - Comprehensive code quality audit

### 📁 docs/
Documentation for AI-assisted development workflows.

- `workflow.md` - How to use the agent flow
- `agent-usage.md` - Guide for each agent

### 📁 hooks/
Git hooks for automation (symbolic links to .git/hooks/).

## Usage

### Using an Agent

Agents can be invoked through Claude Code or manually referenced:

```bash
# Reference an agent in Claude Code
# "Use the Analyzer agent from .ai/agents/analyzer.md"

# Or copy prompt for other AI tools
cat .ai/agents/analyzer.md | pbcopy
```

### Automatic Git Commits

The git-agent automatically creates commits for major decisions:

```bash
# Set up git hooks
ln -sf ../../.ai/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Guidelines

### What Goes in .ai/

✅ **Include:**
- Agent prompts and definitions
- Migration plans and roadmaps
- Code analysis reports
- AI workflow documentation
- Automation scripts
- Decision logs

❌ **Exclude:**
- Application source code
- Test files (belong in src/__test__/)
- Build artifacts
- Dependencies
- User documentation (belongs in docs/ or README.md)

### Naming Conventions

- **Plans:** `{topic}-{version}.md` (e.g., `react-19-migration.md`)
- **Reports:** `{type}-audit-{date}.md` (e.g., `code-audit-2025-11-11.md`)
- **Agents:** `{role}.md` (e.g., `analyzer.md`)
- **Docs:** `{topic}.md` (e.g., `workflow.md`)

## Integration with Project

The `.ai/` folder is separate from application code but integrated with the development workflow:

1. **CLAUDE.md** stays at project root (Claude Code convention)
2. **Plans** inform development work
3. **Reports** track code quality
4. **Agents** automate repetitive tasks
5. **Hooks** ensure consistency

## Version Control

All files in `.ai/` are tracked in git to maintain history of:
- Decisions made
- Plans executed
- Issues identified
- Progress over time

## Contributing

When adding AI-related content:

1. Place in appropriate subfolder
2. Follow naming conventions
3. Update this README if adding new categories
4. Keep content focused and actionable
5. Cross-reference related documents

---

**Last Updated:** 2025-11-11
**Maintained By:** Project team + AI agents
