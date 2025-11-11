# Git Agent

**Role:** Automated git commit creation for major decisions and milestones

**Purpose:** Create clear, concise commit messages that capture the "why" behind changes

---

## Agent Behavior

The Git Agent monitors for major decisions and creates commits with structured messages following conventional commit standards.

### When to Commit

The agent creates commits for:

✅ **Major Decisions:**
- Architecture changes
- Dependency updates
- Refactoring decisions
- Security fixes
- Breaking changes

✅ **Milestones:**
- Phase completions
- Major feature implementations
- Test coverage achievements
- Migration steps completed

✅ **Documentation:**
- New plans created
- Audit reports generated
- Agent definitions added

❌ **Not for:**
- Work in progress
- Experimental changes
- Minor tweaks
- Incomplete features

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security fixes
- `break`: Breaking changes

### Scope

- `deps`: Dependencies
- `config`: Configuration
- `ai`: AI-related (plans, agents, reports)
- `core`: Core functionality
- `ui`: User interface
- Component name (e.g., `keyboard`, `wholeapp`)

### Subject

- Imperative mood ("add" not "added")
- No period at end
- Max 50 characters
- Clear and concise

### Body (Optional)

- Explain the "why" not the "what"
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)

- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123`
- Co-authored by: `Co-authored-by: Name <email>`

---

## Examples

### Good Commit Messages

```
feat(keyboard): convert Keyboard component to functional

Convert Keyboard.js from class component to functional component
with hooks. This enables React 19 compatibility and improves
maintainability.

- Extract useKeyboardEvents hook
- Move global state to component state
- Add proper cleanup for event listeners

Refs: REACT_19_MIGRATION_PLAN.md Phase 2.3
```

```
security(firebase): move credentials to environment variables

Firebase API keys were exposed in source code. Moved all credentials
to .env file and updated Firebase.js to use environment variables.

BREAKING CHANGE: Requires .env file for Firebase configuration.
See .env.example for required variables.

Fixes: CODE_AUDIT_REPORT.md Issue #1
```

```
docs(ai): create agent workflow documentation

Add comprehensive documentation for using the agent flow, including
agent definitions, usage guides, and workflow examples.

- Analyzer agent for code audits
- Planner agent for task breakdown
- Developer agent for implementation
- Tester agent for test creation
- Reviewer agent for code review
```

```
test(musicscale): add comprehensive unit tests

Increase MusicScale test coverage from 0% to 92%. Tests cover all
notation systems, edge cases, and MIDI numbering.

- Test all 12 root notes
- Test double sharps/flats
- Test all notation formats
- Test transposition logic

Refs: REACT_19_MIGRATION_PLAN.md Phase 1.3
```

```
refactor(wholeapp): extract state to custom hooks

Split WholeApp state into focused custom hooks to reduce complexity
and improve maintainability.

- useWholeAppState: octave, scale, notation state
- useFirebaseSession: session load/save operations
- useTooltipRefs: tooltip reference management

Reduces WholeApp.js from 496 to 280 lines.

Refs: REACT_19_MIGRATION_PLAN.md Phase 2.2
```

---

## Agent Prompt

When acting as the Git Agent, use this prompt:

```
You are the Git Agent for the Notio project. Your role is to create
clear, concise git commit messages following conventional commit format.

Given a description of changes made, create a commit message that:

1. Uses appropriate type and scope
2. Has a clear, imperative subject (max 50 chars)
3. Includes a body explaining the "why" (if needed)
4. References relevant documentation
5. Follows the project's commit conventions

Ask the developer:
- What was changed?
- Why was it changed?
- Does it relate to a plan or report?
- Are there breaking changes?

Then generate a commit message following the format in
.ai/agents/git-agent.md
```

---

## Usage with Claude Code

### Manual Invocation

```bash
# Stage your changes
git add .

# Ask Claude Code to create commit message
"Use the git-agent from .ai/agents/git-agent.md to create a commit
message for the changes I just staged. I converted the Keyboard
component to functional and fixed the memory leak."

# Claude Code will generate the commit message
# Review and commit
git commit -m "Generated message here"
```

### Automated (Future Enhancement)

```bash
# Install git hook (coming soon)
ln -sf ../../.ai/hooks/pre-commit .git/hooks/pre-commit

# Commits will automatically get well-formatted messages
git commit
# Opens editor with AI-generated commit message template
```

---

## Integration with Workflow

### Phase Completions

When completing a phase of the migration plan:

```
chore(migration): complete Phase 1 test coverage

Achieved >80% test coverage across critical components:
- MusicScale.js: 92%
- WholeApp.js: 78%
- Keyboard.js: 75%

All Phase 1 success criteria met. Ready to proceed to Phase 2.

Refs: REACT_19_MIGRATION_PLAN.md Phase 1
```

### Decision Points

When making architectural decisions:

```
refactor(architecture): adopt Context API for state management

Decision: Use React Context instead of Redux for state management.
Rationale: Lower complexity, adequate for app size, built-in to React.

Creates three contexts:
- UIContext: theme, tooltips, video player
- AudioContext: instruments, sounds, volume
- ScaleContext: scales, notation, root notes

Refs: CODE_AUDIT_REPORT.md Issue #5
```

---

## Configuration

### .gitconfig Integration

Add to your `.gitconfig`:

```ini
[commit]
    template = .ai/hooks/commit-template.txt

[alias]
    # Smart commit with AI help
    aicommit = !sh -c 'git diff --cached | claude-code --prompt=\"Create commit message using .ai/agents/git-agent.md\"'
```

---

## Best Practices

### DO:
✅ Commit logical units of work
✅ Write in imperative mood
✅ Keep subject under 50 characters
✅ Explain the "why" in body
✅ Reference plans and reports
✅ Note breaking changes

### DON'T:
❌ Commit work in progress
❌ Use past tense ("added", "fixed")
❌ Be vague ("update stuff", "fix things")
❌ Forget to stage files first
❌ Skip the body for complex changes

---

## Maintenance

This agent definition should be updated when:
- Commit conventions change
- New types or scopes are added
- Integration methods improve
- Team workflow evolves

---

**Version:** 1.0
**Last Updated:** 2025-11-11
**Maintained By:** Development team
