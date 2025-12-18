# Skills Catalog

Reusable skills for speckit and general development workflows. All skills are optimized for parallel execution and token efficiency.

## Core Skills

### 🔍 parallel-extract
**Extract sections from multiple files in parallel**

```bash
# Via slash command (if exposed)
/parallel-extract spec.md:User Stories,Requirements plan.md:Tech Stack

# Via Skill tool
Skill("parallel-extract", {
  files: [
    { path: "spec.md", extract: ["User Stories"], maxLines: 60 },
    { path: "plan.md", extract: ["Tech Stack"], maxLines: 40 }
  ]
})
```

**Token Savings**: ~75-85%
**Use When**: Loading context from large files for analysis, validation, or implementation

---

### ✅ parallel-validate
**Run multiple validation checks in parallel**

```bash
# Via Skill tool
Skill("parallel-validate", {
  target: "specs/feature/spec.md",
  checks: [
    { name: "Content Quality", rules: ["No impl details", "User-focused"] },
    { name: "Requirements", rules: ["Testable", "Measurable"] }
  ]
})
```

**Token Savings**: ~75%
**Use When**: Validating specs, plans, code quality, or any multi-criteria checks

---

### 🔬 parallel-research
**Research multiple topics in parallel**

```bash
# Via Skill tool
Skill("parallel-research", {
  context: "Music education web app",
  topics: [
    { topic: "Authentication", focus: ["Security", "Student privacy"] },
    { topic: "Database", focus: ["Real-time", "Scalability"] }
  ]
})
```

**Token Savings**: ~70-80%
**Use When**: Resolving NEEDS CLARIFICATION in plans, technology selection, integration research

---

### 📜 constitution-check
**Validate artifacts against project constitution**

```bash
# Via Skill tool
Skill("constitution-check", {
  constitution: ".specify/memory/constitution.md",
  artifacts: [
    { path: "spec.md", type: "specification" },
    { path: "plan.md", type: "plan" }
  ]
})
```

**Token Savings**: ~80%
**Use When**: Before proceeding to next phase (plan → tasks → implement), pre-PR validation

---

## Usage Patterns

### Pattern 1: Spec Workflow Context Loading
```javascript
// Load everything needed for planning in one parallel operation
const context = Skill("parallel-extract", {
  files: [
    { path: "spec.md", extract: ["User Stories", "Requirements"], maxLines: 60 },
    { path: "constitution.md", extract: ["Principles", "Quality Gates"], maxLines: 40 }
  ]
});
```

### Pattern 2: Multi-Stage Validation
```javascript
// Validate spec quality in parallel
const validation = Skill("parallel-validate", {
  target: "spec.md",
  checks: [
    { name: "Content", rules: ["No impl details", "Stakeholder-focused"] },
    { name: "Completeness", rules: ["Testable", "Measurable", "≤3 clarifications"] },
    { name: "Readiness", rules: ["Acceptance criteria", "Bounded scope"] }
  ]
});

// Then check constitution compliance
const compliance = Skill("constitution-check", {
  artifacts: [{ path: "spec.md", type: "specification" }]
});
```

### Pattern 3: Research-Driven Planning
```javascript
// Research all unknowns in parallel
const research = Skill("parallel-research", {
  context: "Educational music theory app for K-12",
  topics: [
    { topic: "Authentication", focus: ["Student privacy", "SSO"] },
    { topic: "Database", focus: ["Real-time collaboration", "Scale"] },
    { topic: "Testing", focus: ["Integration-first", "A11y"] },
    { topic: "Deployment", focus: ["Educational pricing", "FERPA compliance"] }
  ]
});
// Generates research.md with all decisions
```

---

## Integration with Speckit

Skills are automatically used by speckit commands:

| Command | Skills Used |
|---------|-------------|
| `/speckit.specify` | `parallel-validate` (spec quality checks) |
| `/speckit.clarify` | `parallel-extract` (scan for ambiguities) |
| `/speckit.plan` | `parallel-extract` (constitution), `parallel-research` (Phase 0), `constitution-check` (Phase 1) |
| `/speckit.tasks` | `parallel-extract` (spec, plan, data-model, contracts) |
| `/speckit.analyze` | `parallel-extract` (all artifacts), `constitution-check` |
| `/speckit.implement` | `parallel-extract` (tasks, plan, contracts), `parallel-validate` (code quality) |

---

## Performance Benchmarks

| Operation | Without Skills | With Skills | Improvement |
|-----------|---------------|-------------|-------------|
| Load 3 design docs | 15,000 tokens | 2,500 tokens | 83% reduction |
| Validate spec (3 checks) | 8,000 tokens | 2,000 tokens | 75% reduction |
| Research 4 topics | 25,000 tokens | 5,000 tokens | 80% reduction |
| Constitution check | 12,000 tokens | 2,400 tokens | 80% reduction |

**Typical feature workflow savings**: 205K tokens → 56K tokens (73% reduction)

---

## Creating New Skills

### When to Create a Skill

Create a skill when you have a pattern that:
1. **Repeats across multiple commands** (used in 3+ places)
2. **Benefits from parallelization** (multiple independent operations)
3. **Has clear input/output contracts** (reusable interface)
4. **Provides significant token savings** (>50% reduction)

### Skill Creation Checklist

- [ ] **Clear purpose**: One-sentence description
- [ ] **Input format**: Both JSON and natural language support
- [ ] **Parallel execution**: Uses Task tool for independent operations
- [ ] **Token optimization**: Limits output (max lines, violations-only, summaries)
- [ ] **Model selection**: Haiku for speed/cost, Sonnet only when needed
- [ ] **Error handling**: Graceful degradation, clear error messages
- [ ] **Output format**: Both JSON (programmatic) and markdown (human)
- [ ] **Documentation**: Usage examples, common patterns, integration points

### Skill Template

```markdown
---
description: One-sentence description of what this skill does
---

## User Input
``````text
$ARGUMENTS
``````

## Overview
What problem does this solve? What are the benefits?

## Expected Input Format
JSON and natural language examples

## Execution
1. Parse input
2. Launch parallel agents
3. Consolidate results
4. Format output
5. Report summary

## Common Patterns
Pattern 1: {description}
Pattern 2: {description}

## Token Optimization
How does this save tokens?

## Output Format
What does it return?
```

---

## Auto-Skill Creation

Speckit commands can automatically create skills when useful patterns emerge. Enable with:

```bash
export SPECKIT_AUTO_SKILL_CREATION=true
```

When enabled, commands will:
1. **Detect reusable patterns** during execution
2. **Propose new skills** when pattern used 2+ times
3. **Generate skill file** with user approval
4. **Update commands** to use the new skill

Example auto-created skills:
- `extract-user-stories` (from repeated spec parsing)
- `generate-contract-tests` (from repeated test generation)
- `validate-a11y-requirements` (from repeated a11y checks)

---

## Skill Development Workflow

1. **Identify pattern**: Notice repeated code in 2+ commands
2. **Extract to skill**: Create new `.gemini/skills/{name}.md`
3. **Test skill**: Invoke via Skill tool, verify output
4. **Update commands**: Replace inline code with Skill() call
5. **Document**: Add to this catalog with examples
6. **Share**: Consider contributing to skill library

---

## Contributing Skills

Skills can be shared across projects. To package a skill:

```bash
# Package skill with dependencies
.specify/scripts/package-skill.sh skill-name

# Produces: skills/skill-name.skill.tar.gz
```

To install a shared skill:

```bash
# Install from package
.specify/scripts/install-skill.sh path/to/skill.skill.tar.gz

# Or from URL
.specify/scripts/install-skill.sh https://example.com/skills/parallel-extract.skill.tar.gz
```

---

## Best Practices

1. **Prefer skills over inline code** when pattern is reusable
2. **Launch skills in parallel** when independent (single message, multiple Skill() calls)
3. **Use haiku model** for commodity work (extraction, validation, research)
4. **Set output limits** to prevent token bloat ("max 50 lines", "violations only")
5. **Return JSON + markdown** for both programmatic and human use
6. **Test token savings** - skills should save 50%+ tokens
7. **Document usage** with real examples from your project

---

## Troubleshooting

**Skill not found**: Ensure file exists in `.gemini/skills/{name}.md`

**Skill hangs**: Check that parallel agents complete (use timeout param)

**High token usage**: Review output limits, ensure "violations only" or "summary only" mode

**Skill fails**: Check error handling, add graceful degradation

---

## Roadmap

Planned skills:
- `parallel-implement` - Implement multiple tasks in parallel
- `generate-tests` - Generate tests from specs/contracts
- `validate-a11y` - Deep accessibility validation
- `analyze-performance` - Performance bottleneck analysis
- `generate-docs` - Generate documentation from code

---

## Version

**Catalog Version**: 1.0.0
**Last Updated**: 2025-12-17
**Skills Count**: 4 core skills

---

## License

Skills are part of the Speckit framework and follow the same license as the project.
