# .ai/ Folder Setup Guide

Quick setup guide for the AI-assisted development infrastructure.

---

## ✅ What's Already Set Up

The `.ai/` folder structure is ready with:

```
.ai/
├── README.md                      # Main documentation
├── agents/                        # Agent definitions
│   ├── analyzer.md                # Code auditor
│   ├── architect.md               # Solution designer
│   ├── planner.md                 # Task breakdown
│   ├── developer.md               # Implementation
│   ├── tester.md                  # Test creation
│   ├── reviewer.md                # Code review
│   └── git-agent.md               # Git commit helper
├── plans/                         # Improvement plans
│   └── REACT_19_MIGRATION_PLAN.md
├── reports/                       # Analysis reports
│   └── CODE_AUDIT_REPORT.md
├── docs/                          # Workflow docs
│   └── workflow.md
└── hooks/                         # Git hooks
    └── commit-template.txt
```

---

## 🚀 Quick Start

### 1. Read the Documentation

```bash
# Start here
cat .ai/README.md

# Learn the workflow
cat .ai/docs/workflow.md

# Check available agents
ls .ai/agents/
```

### 2. Use an Agent

With Claude Code:

```
"Use the Analyzer agent from .ai/agents/analyzer.md to audit
the codebase"
```

### 3. Review Existing Plans and Reports

```bash
# See what's already been analyzed
cat .ai/reports/CODE_AUDIT_REPORT.md

# Check the migration plan
cat .ai/plans/REACT_19_MIGRATION_PLAN.md
```

---

## 🔧 Optional Git Setup

### Set Up Commit Template (Recommended)

```bash
# From project root (notio/)
git config commit.template .ai/hooks/commit-template.txt
```

Now when you run `git commit` (without `-m`), you'll see a helpful template.

### Test the Template

```bash
# Stage some changes
git add .

# Commit without -m to see template
git commit
# Your editor opens with the template

# Or continue using -m flag as usual
git commit -m "feat(ui): add new feature"
```

---

## 📚 Recommended Reading Order

1. **`.ai/README.md`** - Overview of the .ai/ folder
2. **`.ai/docs/workflow.md`** - How to use agents
3. **`.ai/reports/CODE_AUDIT_REPORT.md`** - Current code issues
4. **`.ai/plans/REACT_19_MIGRATION_PLAN.md`** - How to fix issues
5. **`.ai/agents/git-agent.md`** - Git commit standards

---

## 🎯 Common Use Cases

### Starting New Work

```bash
# 1. Check if there's already a plan
ls .ai/plans/

# 2. If not, create one with Planner agent
"Use the Planner agent from .ai/agents/planner.md to create
a plan for [your goal]"

# 3. Execute the plan step by step
```

### Code Review

```bash
# After making changes
"Use the Reviewer agent from .ai/agents/reviewer.md to review
my changes to [files]"
```

### Creating Tests

```bash
# For new code
"Use the Tester agent from .ai/agents/tester.md to create
tests for [component]"
```

### Git Commits

```bash
# Stage changes
git add .

# Get help with commit message
"Use the git-agent from .ai/agents/git-agent.md to create
a commit message for these changes"
```

---

## 📝 Adding Your Own Content

### Create a New Plan

```bash
# Save to .ai/plans/
.ai/plans/my-feature-plan.md
```

### Save Analysis Reports

```bash
# Save to .ai/reports/
.ai/reports/performance-audit-2025-11-12.md
```

### Document Decisions

```bash
# Save to .ai/docs/
.ai/docs/architecture-decisions.md
```

---

## 🔒 What's Ignored

See `.ai/.gitignore` for files not tracked:

- `*.tmp`, `*.temp` - Temporary files
- `notes/`, `personal/` - Personal notes
- `*.draft.md`, `*.wip.md` - Work in progress

---

## 🆘 Troubleshooting

### Can't Find Agent Definitions

```bash
# List all agents
ls -la .ai/agents/

# Should see:
# analyzer.md, architect.md, planner.md, developer.md,
# tester.md, reviewer.md, git-agent.md
```

### Plans or Reports Missing

```bash
# Check if files exist
ls -la .ai/plans/
ls -la .ai/reports/

# Files should be there:
# REACT_19_MIGRATION_PLAN.md
# CODE_AUDIT_REPORT.md
```

### Git Template Not Working

```bash
# Verify git config
git config commit.template

# Should output:
# .ai/hooks/commit-template.txt

# If empty, set it:
git config commit.template .ai/hooks/commit-template.txt
```

---

## 📞 Getting Help

1. **Read `.ai/README.md`** - Main documentation
2. **Check `.ai/docs/workflow.md`** - Detailed workflow
3. **Reference agent files** - Each agent has usage examples
4. **Review existing reports** - See how agents were used before

---

## 🎉 You're Ready!

The `.ai/` infrastructure is set up and ready to use. Start by:

1. Reading `.ai/docs/workflow.md`
2. Reviewing `.ai/reports/CODE_AUDIT_REPORT.md`
3. Following `.ai/plans/REACT_19_MIGRATION_PLAN.md`

Happy coding with AI assistance! 🤖

---

**Last Updated:** 2025-11-11
