---
description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Identify inconsistencies, duplications, ambiguities, and underspecified items across the three core artifacts (`spec.md`, `plan.md`, `tasks.md`) before implementation. This command MUST run only after `/speckit.tasks` has successfully produced a complete `tasks.md`.

## Operating Constraints

**STRICTLY READ-ONLY**: Do **not** modify any files. Output a structured analysis report. Offer an optional remediation plan (user must explicitly approve before any follow-up editing commands would be invoked manually).

**Constitution Authority**: The project constitution (`.specify/memory/constitution.md`) is **non-negotiable** within this analysis scope. Constitution conflicts are automatically CRITICAL and require adjustment of the spec, plan, or tasks—not dilution, reinterpretation, or silent ignoring of the principle. If a principle itself needs to change, that must occur in a separate, explicit constitution update outside `/speckit.analyze`.

## Execution Steps

**Main Conversation (UI Layer):**

### 1. Setup

Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` once from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS. Derive absolute paths:

- SPEC = FEATURE_DIR/spec.md
- PLAN = FEATURE_DIR/plan.md
- TASKS = FEATURE_DIR/tasks.md

Abort with an error message if any required file is missing (instruct the user to run missing prerequisite command).
For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

### 2. Delegate to analysis agent

**IMPORTANT**: Use Task tool to delegate analysis for token efficiency and focused processing.

Use Task tool with:
- `subagent_type: "general-purpose"`
- `model: "sonnet"` (analysis requires sophistication)
- `description: "Analyze artifacts for consistency"`
- `prompt`:
  ```text
  You are analyzing feature artifacts for consistency, quality, and completeness.

  **STRICTLY READ-ONLY**: Do NOT modify any files. Output a structured analysis report only.

  User arguments to consider: $ARGUMENTS

  ## Context files to read:
  - [FEATURE_DIR]/spec.md (required)
  - [FEATURE_DIR]/plan.md (required)
  - [FEATURE_DIR]/tasks.md (required)
  - [FEATURE_DIR]/data-model.md (optional)
  - [FEATURE_DIR]/contracts/ (optional)
  - [FEATURE_DIR]/research.md (optional)
  - .specify/memory/constitution.md (required - principles are NON-NEGOTIABLE)

  **Analysis Process**:

  1. **Load minimal context** from each artifact:
     - spec.md: Overview, requirements, user stories, edge cases
     - plan.md: Architecture, stack, phases, constraints
     - tasks.md: Task IDs, descriptions, phases, parallel markers [P], file paths
     - constitution.md: MUST/SHOULD principles

  2. **Build semantic models** (internal only):
     - Requirements inventory with stable keys
     - User story/action inventory with acceptance criteria
     - Task coverage mapping (task → requirement/story)
     - Constitution rule set

  3. **Detection passes** (max 50 findings):

     A. **Duplication**: Near-duplicate requirements
     B. **Ambiguity**: Vague adjectives, unresolved placeholders (TODO, ???)
     C. **Underspecification**: Missing measurable outcomes, undefined components
     D. **Constitution Alignment**: MUST principle violations (ALWAYS CRITICAL)
     E. **Coverage Gaps**: Requirements without tasks, tasks without requirements
     F. **Inconsistency**: Terminology drift, conflicting requirements, ordering issues

  4. **Severity assignment**:
     - CRITICAL: Constitution MUST violation, missing core artifact, zero coverage blocking baseline
     - HIGH: Conflicting requirements, ambiguous security/performance, untestable criteria
     - MEDIUM: Terminology drift, missing non-functional coverage, underspecified edge case
     - LOW: Style improvements, minor redundancy

  5. **Generate compact report** (markdown format):

     ## Specification Analysis Report

     | ID | Category | Severity | Location(s) | Summary | Recommendation |
     |----|----------|----------|-------------|---------|----------------|
     | [stable IDs] | [category] | [severity] | [file:line] | [summary] | [recommendation] |

     **Coverage Summary Table**:
     | Requirement Key | Has Task? | Task IDs | Notes |

     **Constitution Alignment Issues**: [if any]
     **Unmapped Tasks**: [if any]

     **Metrics**:
     - Total Requirements: N
     - Total Tasks: N
     - Coverage %: N% (requirements with ≥1 task)
     - Ambiguity Count: N
     - Duplication Count: N
     - Critical Issues Count: N

     **Next Actions**:
     - If CRITICAL: Recommend resolving before /speckit.implement
     - If LOW/MEDIUM only: May proceed with improvement suggestions
     - Provide explicit command suggestions

  ## Operating Principles

  - **Minimal high-signal tokens**: Focus on actionable findings, not exhaustive documentation
  - **Progressive disclosure**: Load artifacts incrementally; don't dump all content
  - **Token-efficient output**: Limit findings table to 50 rows; summarize overflow
  - **Deterministic results**: Rerunning without changes should produce consistent IDs and counts
  - **NEVER modify files** (this is read-only analysis)
  - **NEVER hallucinate missing sections** (if absent, report them accurately)
  - **Prioritize constitution violations** (these are always CRITICAL)
  - **Use examples over exhaustive rules** (cite specific instances, not generic patterns)
  - **Report zero issues gracefully** (emit success report with coverage statistics)

  Return: The complete markdown report
  ```

### 3. Display results

After agent returns:
- Display the analysis report to user
- Highlight CRITICAL issues if any (show count and locations)
- Ask if user wants remediation suggestions for top issues (do NOT apply automatically)
