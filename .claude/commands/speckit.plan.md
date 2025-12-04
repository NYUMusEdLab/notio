---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

**Main Conversation (UI Layer):**

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH, FEATURE_DIR. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Delegate entire planning workflow to agent**: Use Task tool with complete instructions (see below)

3. **Display results**: Show summary of generated artifacts to user

4. **Report completion**: Command ends after agent completes. Report branch, IMPL_PLAN path, and generated artifacts.

## Agent Delegation

Use Task tool with:
- `subagent_type: "general-purpose"`
- `model: "sonnet"` (planning requires full capability)
- `description: "Execute implementation planning workflow"`
- `prompt`:

```text
You are executing the complete implementation planning workflow for a feature.

## Context Files (from paths provided by main conversation)

Read these files:
- Feature specification: [FEATURE_SPEC]
- Plan template (already initialized): [IMPL_PLAN]
- Constitution: .specify/memory/constitution.md
- Plan structure template: .specify/templates/plan-template.md

User arguments to consider: $ARGUMENTS

## Workflow to Execute

### Pre-Phase: Fill Plan Template

1. **Fill Technical Context** in IMPL_PLAN:
   - Read FEATURE_SPEC to understand requirements
   - Fill: Language/Version, Dependencies, Storage, Testing, Platform, Project Type
   - Mark unknowns as "NEEDS CLARIFICATION"
   - Fill Performance Goals, Constraints, Scale/Scope from spec

2. **Fill Constitution Check** section:
   - Read constitution.md
   - List all applicable principles
   - Check for violations (complexity, patterns, etc.)
   - If violations: require justification or ERROR

3. **Evaluate gates**:
   - ERROR if constitution violations are unjustified
   - Proceed only if gates pass or violations justified

4. **Fill Project Structure** section:
   - Determine structure type (single project, web app, mobile+API)
   - Map to actual directories from codebase
   - Remove unused structure options
   - Document structure decision

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context**:
   - Collect all NEEDS CLARIFICATION items
   - Note technology dependencies requiring best practices
   - Identify integrations needing pattern research

2. **Research and resolve**:
   - For each NEEDS CLARIFICATION: research options, recommend best choice
   - For each dependency: find best practices and common patterns
   - For integrations: identify standard patterns and potential issues

3. **Generate research.md** at [FEATURE_DIR]/research.md:
   ```markdown
   # Research: [Feature Name]

   ## Decision 1: [Topic]
   - **Decision**: [what was chosen]
   - **Rationale**: [why chosen with evidence/citations]
   - **Alternatives considered**: [other options evaluated]
   - **Trade-offs**: [pros/cons of chosen approach]

   [Repeat for each decision]
   ```

### Phase 1: Design & Contracts

**Prerequisites**: research.md complete

1. **Generate data-model.md** (if entities exist in spec):
   - Extract entities from spec
   - Define fields, types, relationships
   - Add validation rules from requirements
   - Document state transitions if applicable

2. **Generate contracts/** directory (if APIs/endpoints exist):
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Create OpenAPI/GraphQL schema files
   - Include request/response examples

3. **Generate quickstart.md**:
   - Primary integration scenarios
   - Example usage flows
   - Testing scenarios from acceptance criteria

4. **Update agent context**:
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Preserve manual additions between markers

### Post-Phase: Re-evaluate Constitution

1. **Re-evaluate Constitution Check** after design complete:
   - Check if design artifacts introduce new complexity
   - Verify no new violations
   - Update Complexity Tracking table if needed

2. **Final validation**:
   - Verify all NEEDS CLARIFICATION resolved
   - Verify all required artifacts generated
   - Verify gates still pass

## Output Requirements

Return a summary in this format:

```
Implementation Plan Complete

Branch: [BRANCH]
Plan: [IMPL_PLAN path]

Generated artifacts:
- [IMPL_PLAN] (updated with Technical Context, Constitution Check, Project Structure)
- [FEATURE_DIR]/research.md (N decisions)
- [FEATURE_DIR]/data-model.md (if created)
- [FEATURE_DIR]/contracts/ (if created - list files)
- [FEATURE_DIR]/quickstart.md
- Updated: [agent context file path]

Constitution status: [PASS/FAIL with details]
Ready for: /speckit.tasks
```

## Important Notes

- Use absolute paths for all file operations
- ERROR on gate failures or unresolved clarifications
- If entities don't exist in spec, skip data-model.md
- If no APIs/endpoints, skip contracts/
- Always generate research.md and quickstart.md
```
