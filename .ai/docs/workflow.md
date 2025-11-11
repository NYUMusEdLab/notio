# AI-Assisted Development Workflow

This document describes the recommended workflow for using AI agents in the Notio project.

---

## Overview

The agent flow follows a systematic process:

```
Analyze → Architect → Plan → Develop → Test → Review → Commit
   ↓         ↓         ↓        ↓       ↓       ↓        ↓
Audit     Design    Tasks    Code    Tests  Quality   Git
Report    Vision    Plan             Pass   Check    Message
```

---

## The Agent Flow

### 1. 🔍 Analyzer Agent

**When:** Starting new work, periodic audits

**Purpose:** Identify issues and opportunities

**Process:**
```bash
# Invoke the analyzer
"Use the Analyzer agent from .ai/agents/analyzer.md"

# Output: .ai/reports/code-audit-{date}.md
```

**Review:**
- [ ] Read through all critical issues
- [ ] Prioritize which to address
- [ ] Decide on next steps

---

### 2. 🏗️ Architect Agent

**When:** Planning major changes

**Purpose:** Design high-level solution

**Process:**
```bash
# Invoke the architect
"Use the Architect agent to design a solution for [problem]"

# Output: Architecture decisions and approach
```

**Review:**
- [ ] Evaluate proposed architecture
- [ ] Consider alternatives
- [ ] Approve design direction

---

### 3. 📋 Planner Agent

**When:** Ready to execute

**Purpose:** Create detailed implementation plan

**Process:**
```bash
# Invoke the planner
"Use the Planner agent from .ai/agents/planner.md to create
a plan for [specific goal]"

# Output: .ai/plans/{topic}-plan.md
```

**Review:**
- [ ] Verify all steps make sense
- [ ] Check time estimates
- [ ] Approve plan before proceeding

---

### 4. 👨‍💻 Developer Agent

**When:** Executing planned work

**Purpose:** Implement changes

**Process:**
```bash
# Invoke the developer
"Use the Developer agent to implement Phase X, Step Y
from .ai/plans/{topic}-plan.md"

# Developer makes changes
```

**Review:**
- [ ] Code compiles and runs
- [ ] Changes match plan
- [ ] No obvious issues

---

### 5. 🧪 Tester Agent

**When:** After implementation

**Purpose:** Create and run tests

**Process:**
```bash
# Invoke the tester
"Use the Tester agent to create tests for [changes made]"

# Run tests
npm test
```

**Review:**
- [ ] Tests pass
- [ ] Coverage increased
- [ ] Edge cases covered

---

### 6. 👀 Reviewer Agent

**When:** Code complete and tested

**Purpose:** Quality gate and final review

**Process:**
```bash
# Invoke the reviewer
"Use the Reviewer agent to review the changes I just made"

# Review output
```

**Review:**
- [ ] No regressions
- [ ] Code quality acceptable
- [ ] Architecture followed
- [ ] Ready to commit

---

### 7. 📝 Git Agent

**When:** Ready to commit

**Purpose:** Create clear commit message

**Process:**
```bash
# Stage changes
git add .

# Invoke git agent
"Use the git-agent from .ai/agents/git-agent.md to create
a commit message for these changes"

# Commit with generated message
git commit -m "Generated message"
```

**Review:**
- [ ] Message is clear
- [ ] References relevant docs
- [ ] Follows conventions

---

## Example Workflow

### Scenario: Convert WholeApp to Functional Component

#### Step 1: Analyze (if not done)

Already have `.ai/reports/code-audit-2025-11-11.md` identifying this issue.

#### Step 2: Check Plan

Already have `.ai/plans/REACT_19_MIGRATION_PLAN.md` Phase 2.2 covering this.

#### Step 3: Execute Plan Steps

**Phase 2.2a: Extract Custom Hooks (Day 3)**

```bash
# Invoke developer agent
"Use the Developer agent to implement Phase 2.2a from the React 19
migration plan: Extract custom hooks from WholeApp"

# Developer creates:
# - src/hooks/useWholeAppState.js
# - src/hooks/useFirebaseSession.js
# - src/hooks/useTooltipRefs.js
```

#### Step 4: Test Hooks

```bash
# Invoke tester agent
"Use the Tester agent to create tests for the hooks just created"

# Run tests
npm test
```

#### Step 5: Review Hooks

```bash
# Invoke reviewer agent
"Use the Reviewer agent to review the custom hooks I just created"

# Address any feedback
```

#### Step 6: Commit Hooks

```bash
git add src/hooks/

# Invoke git agent
"Use the git-agent to create a commit message. I extracted custom
hooks from WholeApp as part of Phase 2.2a"

# Git agent generates:
# refactor(wholeapp): extract state to custom hooks
#
# Split WholeApp state into focused custom hooks to reduce complexity.
#
# - useWholeAppState: octave, scale, notation state
# - useFirebaseSession: session load/save operations
# - useTooltipRefs: tooltip reference management
#
# Refs: .ai/plans/REACT_19_MIGRATION_PLAN.md Phase 2.2a

git commit -m "Generated message above"
```

#### Step 7: Continue with Phase 2.2b

Repeat steps 3-6 for each step in the phase.

---

## Parallel vs Sequential

### Use Sequential Flow When:
- Changes depend on previous steps
- Tests must pass before continuing
- Architecture must be approved first
- One component at a time

### Use Parallel Flow When:
- Independent components
- Multiple small fixes
- Different team members
- Non-conflicting changes

---

## Human-in-the-Loop

### Critical Review Points

Always pause for human review after:

1. ✅ **Analysis complete** - Before starting work
2. ✅ **Architecture designed** - Before detailed planning
3. ✅ **Plan created** - Before implementation
4. ✅ **Phase complete** - Before next phase
5. ✅ **Major changes** - Before committing
6. ✅ **Tests failing** - Before proceeding
7. ✅ **Breaking changes** - Before deployment

### Review Checklist

For each review point:

- [ ] Understand what was done
- [ ] Verify it matches expectations
- [ ] Check for unintended consequences
- [ ] Test manually if needed
- [ ] Approve or request changes

---

## Best Practices

### DO:
✅ Follow the agent flow in order
✅ Review output at each step
✅ Test thoroughly before committing
✅ Keep commits focused and atomic
✅ Reference plans and reports
✅ Document decisions

### DON'T:
❌ Skip the analysis phase
❌ Start coding without a plan
❌ Commit untested changes
❌ Mix unrelated changes
❌ Ignore agent recommendations
❌ Bypass human review checkpoints

---

## Troubleshooting

### Agent Output Unclear

- Rerun with more specific prompt
- Provide more context
- Reference relevant documents
- Ask for clarification

### Plan Too Complex

- Break into smaller phases
- Focus on one component at a time
- Simplify scope
- Extend timeline

### Tests Failing

- Don't proceed to next step
- Investigate root cause
- Fix issues found
- Re-run tests

### Review Finds Issues

- Address feedback immediately
- Don't accumulate technical debt
- Improve before moving forward
- Update plan if needed

---

## Maintenance

Update this workflow when:
- New agents are added
- Process improvements are identified
- Team practices change
- Tools are updated

---

**Version:** 1.0
**Last Updated:** 2025-11-11
**Maintained By:** Development team
