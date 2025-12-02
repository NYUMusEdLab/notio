---
description: Execute the implementation plan by processing and executing all tasks defined in tasks.md
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

**Main Conversation (UI Layer / Coordinator):**

1. **Setup**: Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Check checklists status** (if FEATURE_DIR/checklists/ exists) **[In Main Conversation - needs user interaction]**:
   - Scan all checklist files in the checklists/ directory
   - For each checklist, count:
     - Total items: All lines matching `- [ ]` or `- [X]` or `- [x]`
     - Completed items: Lines matching `- [X]` or `- [x]`
     - Incomplete items: Lines matching `- [ ]`
   - Create a status table:

     ```text
     | Checklist | Total | Completed | Incomplete | Status |
     |-----------|-------|-----------|------------|--------|
     | ux.md     | 12    | 12        | 0          | ✓ PASS |
     | test.md   | 8     | 5         | 3          | ✗ FAIL |
     | security.md | 6   | 6         | 0          | ✓ PASS |
     ```

   - Calculate overall status:
     - **PASS**: All checklists have 0 incomplete items
     - **FAIL**: One or more checklists have incomplete items

   - **If any checklist is incomplete**:
     - Display the table with incomplete item counts
     - **STOP** and ask: "Some checklists are incomplete. Do you want to proceed with implementation anyway? (yes/no)"
     - Wait for user response before continuing
     - If user says "no" or "wait" or "stop", halt execution
     - If user says "yes" or "proceed" or "continue", proceed to step 3

   - **If all checklists are complete**:
     - Display the table showing all checklists passed
     - Automatically proceed to step 3

3. **Parse tasks.md structure** **[In Main Conversation - lightweight parsing]**:
   - Read tasks.md and extract phase names
   - For each phase, collect task IDs (T001, T002, etc.)
   - Note which tasks are marked [P] (parallel)
   - Store phase structure for delegation loop

4. **Execute implementation by delegating phases to agents** **[Main Conversation coordinates, agents execute]**:

   **IMPORTANT**: Delegate each phase to a specialized agent for token efficiency.

   **Phase Execution Loop** (in main conversation):

   For each phase in order (Setup → Foundational → User Story 1 → User Story 2 → ... → Polish):

   a. **Extract phase info** (in main - lightweight):
      - Phase name
      - List of task IDs for this phase (from step 3 parsing)

   b. **Delegate entire phase to agent**:

      Use Task tool with:
      - `subagent_type: "general-purpose"`
      - `model: "sonnet"` (implementation needs full capability)
      - `description: "Implement Phase N: [phase name]"`
      - `prompt`:

```text
You are implementing Phase [N]: [Phase Name] for a feature.

## Context Files (read these)

- Feature spec: [FEATURE_DIR]/spec.md
- Implementation plan: [FEATURE_DIR]/plan.md
- Tasks list: [FEATURE_DIR]/tasks.md
- Data model (if exists): [FEATURE_DIR]/data-model.md
- Contracts (if exists): [FEATURE_DIR]/contracts/
- Research (if exists): [FEATURE_DIR]/research.md
- Quickstart (if exists): [FEATURE_DIR]/quickstart.md
- Project constitution: .specify/memory/constitution.md
- Project guidelines: CLAUDE.md

## Your Tasks

Tasks to complete in this phase (from tasks.md):
[List of task IDs for this phase]

## Execution Workflow

### Step 1: Project Setup (ONLY if this is Setup/Phase 1)

If this is the Setup phase, perform project setup verification:

**Create/verify ignore files** based on actual project setup:

**Detection Logic**:
- Git repo? Run: `git rev-parse --git-dir 2>/dev/null` → create/verify .gitignore
- Dockerfile* exists or Docker in plan.md? → create/verify .dockerignore
- .eslintrc* exists? → create/verify .eslintignore
- eslint.config.* exists? → ensure config's ignores entries cover required patterns
- .prettierrc* exists? → create/verify .prettierignore
- .npmrc or package.json exists? → create/verify .npmignore (if publishing)
- terraform files (*.tf) exist? → create/verify .terraformignore
- helm charts present? → create/verify .helmignore

**If ignore file exists**: Verify essential patterns, append missing critical ones only
**If ignore file missing**: Create with full pattern set for detected technology

**Common Patterns by Technology** (from plan.md tech stack):
- Node.js/JavaScript/TypeScript: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
- Python: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
- Java: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
- C#/.NET: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
- Go: `*.exe`, `*.test`, `vendor/`, `*.out`
- Ruby: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
- PHP: `vendor/`, `*.log`, `*.cache`, `*.env`
- Rust: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
- Kotlin: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
- C++: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
- C: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
- Swift: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
- R: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
- Universal: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

**Tool-Specific Patterns**:
- Docker: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
- ESLint: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
- Prettier: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- Terraform: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
- Kubernetes/k8s: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`

### Step 2: Execute Phase Tasks

For each task in this phase:

1. **Read task details** from tasks.md:
   - Task ID, description, file path
   - Check if marked [P] (parallelizable)
   - Understand dependencies

2. **Execute task**:
   - **Respect dependencies**: Sequential tasks in order, parallel [P] can run together
   - **File coordination**: Tasks on same files must run sequentially
   - **TDD approach**: Tests before implementation if requested
   - **Follow guidelines**: Adhere to CLAUDE.md and constitution.md

3. **Mark completed**: Update tasks.md by changing `- [ ]` to `- [X]` for completed task

4. **Report progress**: After each task, note completion (internal tracking)

### Step 3: Error Handling

- **Non-parallel task fails**: Halt phase execution, report failure with context
- **Parallel task fails**: Continue with other tasks, report failure at end
- **Provide clear errors**: Include file paths, error messages, debugging hints

## Output Requirements

Return a summary in this format:

```
Phase [N]: [Phase Name] Complete

Status: [SUCCESS | PARTIAL | FAILED]

Completed tasks: X/Y
- T001: [task description] ✓
- T002: [task description] ✓
- T003: [task description] ✗ (reason)

Failed tasks (if any):
- T003: [detailed error with context and suggested fix]

Files modified:
- [list of files created/modified]

Ready for: [Next phase name or "Final validation"]
```

## Important Notes

- Use absolute paths for all file operations
- Mark tasks as [X] in tasks.md immediately after completion
- Report after EACH task for progress visibility
- If blocked, provide clear next steps for user intervention
```

   c. **Display phase result** (in main - just show agent's summary):
      - Display agent's returned summary
      - Show: Phase N of M complete
      - Show: X/Y tasks completed
      - Show: Any failures or blockers
      - If failures: Ask user whether to continue or fix first

   d. **Proceed to next phase or halt**:
      - If phase success: continue to next phase
      - If phase partial/failed: ask user to decide (continue anyway, fix manually, or stop)

5. **Final completion report** (in main - aggregate results):
   - Count total tasks completed across all phases
   - List any remaining incomplete tasks
   - Suggest next steps: tests, deployment, or PR creation
   - Report final implementation status

Note: This command assumes a complete task breakdown exists in tasks.md. If tasks are incomplete or missing, suggest running `/speckit.tasks` first to regenerate the task list.
