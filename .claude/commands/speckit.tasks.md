---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
handoffs: 
  - label: Analyze For Consistency
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: Implement Project
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

**Main Conversation (UI Layer):**

1. **Setup**: Run `.specify/scripts/bash/check-prerequisites.sh --json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Delegate to task generation agent**: Use Task tool with complete instructions (see below)

3. **Display summary**: Show task count, phases, parallel opportunities to user

4. **Report completion**: Report path to tasks.md and suggest next command

## Agent Delegation

Use Task tool with:
- `subagent_type: "general-purpose"`
- `model: "sonnet"` (task generation requires sophistication)
- `description: "Generate implementation tasks"`
- `prompt`:

```text
You are generating an actionable, dependency-ordered task list for a feature.

## Context Files (from paths provided by main conversation)

Read these files from [FEATURE_DIR]:
- spec.md (REQUIRED - user stories with priorities)
- plan.md (REQUIRED - tech stack, architecture, structure)
- data-model.md (optional - entities)
- contracts/ (optional - API endpoints)
- research.md (optional - technical decisions)
- quickstart.md (optional - test scenarios)

Read template:
- .specify/templates/tasks-template.md

User arguments to consider: $ARGUMENTS

## Task Generation Workflow

### 1. Load and Analyze Design Documents

- Load plan.md: Extract tech stack, libraries, project structure
- Load spec.md: Extract user stories with priorities (P1, P2, P3, etc.)
- If data-model.md exists: Extract entities and map to user stories
- If contracts/ exists: Map endpoints to user stories
- If research.md exists: Extract decisions for setup tasks
- If quickstart.md exists: Use test scenarios for validation

### 2. Generate Task Structure

Use .specify/templates/tasks-template.md as structure, fill with:

**Phase Organization** (CRITICAL):
- Phase 1: Setup (project initialization)
- Phase 2: Foundational (blocking prerequisites for ALL user stories)
- Phase 3+: One phase per user story (in priority order: P1, P2, P3... from spec.md)
- Final Phase: Polish & Cross-cutting Concerns

**Each Phase Includes**:
- Phase goal/description
- Independent test criteria (how to verify this phase works standalone)
- Tests (ONLY if explicitly requested in spec or TDD approach mentioned)
- Implementation tasks
- File paths for each task

### 3. Task Format Requirements

**CRITICAL**: Every task MUST strictly follow this format:

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable:
   - Different files
   - No dependencies on incomplete tasks
   - Can run simultaneously with other [P] tasks
4. **[Story] label**: REQUIRED for user story phase tasks only:
   - Format: [US1], [US2], [US3], etc.
   - Setup phase: NO story label
   - Foundational phase: NO story label
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path from plan.md structure

**Examples**:
- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`

### 4. Task Mapping Strategy

**From User Stories** (PRIMARY ORGANIZATION):
- Each user story (P1, P2, P3...) gets its own phase
- Map all components to their story:
  - Models needed for that story
  - Services needed for that story
  - Endpoints/UI needed for that story
  - Tests specific to that story (if requested)
- Mark story dependencies (most stories should be independent)

**From Contracts**:
- Map each contract/endpoint → to the user story it serves
- If tests requested: Contract test task [P] before implementation
- Place in appropriate story's phase

**From Data Model**:
- Map each entity to user story(ies) that need it
- If entity serves multiple stories: Put in earliest story or Setup phase
- Relationships → service layer tasks in appropriate story phase

**From Setup/Infrastructure**:
- Shared infrastructure → Setup phase (Phase 1)
- Foundational/blocking tasks → Foundational phase (Phase 2)
- Story-specific setup → within that story's phase

### 5. Generate Additional Sections

**Dependencies Section**:
- Show user story completion order
- Document blocking relationships
- Identify truly independent stories

**Parallel Execution Examples**:
- For each story: List which tasks can run in parallel
- Show optimization opportunities

**Implementation Strategy**:
- Recommend MVP scope (typically User Story 1 only)
- Incremental delivery approach
- How to validate each phase

### 6. Validate Output

Before finalizing, verify:
- ✅ ALL tasks have checkbox format `- [ ]`
- ✅ ALL tasks have sequential IDs (T001, T002...)
- ✅ [P] marker only on parallelizable tasks
- ✅ [Story] labels only on user story phases
- ✅ ALL tasks have file paths
- ✅ Each user story has all needed tasks
- ✅ Each phase is independently testable
- ✅ Setup phase has no story labels
- ✅ Foundational phase has no story labels
- ✅ Polish phase has no story labels

## Output Requirements

Write tasks.md to [FEATURE_DIR]/tasks.md following the template structure.

Return a summary in this format:

```
Task Generation Complete

Generated: [FEATURE_DIR]/tasks.md

Summary:
- Total tasks: N
- Setup phase: N tasks
- Foundational phase: N tasks
- User Story 1 (P1): N tasks
- User Story 2 (P2): N tasks
- [... for each story ...]
- Polish phase: N tasks

Parallel opportunities: N tasks marked [P]
Independent stories: [list stories that don't depend on others]
Suggested MVP: User Story 1 (N tasks)

Ready for: /speckit.analyze or /speckit.implement
```

## Important Notes

- Tests are OPTIONAL: Only generate test tasks if explicitly requested in spec
- Use absolute paths for all file operations
- Each story phase must be independently testable
- Format validation is CRITICAL - incorrect format will break /speckit.implement
```
