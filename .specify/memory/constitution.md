<!--
Sync Impact Report:
Version: 2.0.0 → 2.0.1
Rationale: PATCH - Template synchronization fix (templates were claimed updated but weren't)

Modified sections:
  - None - constitution content unchanged from v2.0.0

Templates NOW actually updated (2025-11-30):
  ✅ .specify/templates/plan-template.md - Constitution Check NOW expanded with all 7 principles
    * Added explicit checklist for all principles (I-VII)
    * Each principle includes specific validation criteria
    * Links violations to Complexity Tracking table

  ✅ .specify/templates/spec-template.md - Testing Strategy section NOW added
    * Added comprehensive Testing Strategy section after Success Criteria
    * Includes integration (60-70%), E2E (20-30%), unit (10-20%) test templates
    * Examples specific to musical features
    * Coverage requirements checklist with performance targets

  ✅ .specify/templates/tasks-template.md - Tests NOW truly MANDATORY
    * Changed "Tests are OPTIONAL" to "Tests are MANDATORY per Constitution v2.0.0"
    * Restructured test tasks by type (Integration/E2E/Unit) for each user story
    * Added coverage verification tasks per user story
    * Added final coverage verification phase
    * Updated all 3 user story examples with proper test structure

Previous sync impact report (v1.0.0 → 2.0.0, 2025-11-12):
  - Major update adopting Rainer Hahnekamp's pragmatic testing principles
  - Shifted to integration-first testing (60-70-20-30 distribution)
  - 100% code coverage remains NON-NEGOTIABLE
  - Templates claimed updated but actually weren't (fixed in this patch)

Follow-up TODOs: None - templates now genuinely aligned with Constitution v2.0.0
-->

# Notio Constitution
# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### [PRINCIPLE_1_NAME]
<!-- Example: I. Library-First -->
[PRINCIPLE_1_DESCRIPTION]
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### [PRINCIPLE_2_NAME]
<!-- Example: II. CLI Interface -->
[PRINCIPLE_2_DESCRIPTION]
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### [PRINCIPLE_3_NAME]
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
[PRINCIPLE_3_DESCRIPTION]
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### [PRINCIPLE_4_NAME]
<!-- Example: IV. Integration Testing -->
[PRINCIPLE_4_DESCRIPTION]
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### [PRINCIPLE_5_NAME]
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
[PRINCIPLE_5_DESCRIPTION]
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 2.0.1 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-30
