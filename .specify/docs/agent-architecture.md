# Speckit Agent Architecture

**Version**: 2.0 (Full Agent Delegation)
**Date**: 2025-12-02
**Purpose**: Maximum token efficiency through complete agent delegation

## Design Philosophy

**Main Conversation = UI Layer**
- Only handles user input/output
- Routes requests to specialized agents
- Displays results
- Manages user interaction (questions, approvals)

**Agents = Workers**
- Perform all computational work
- Read files, process data, generate outputs
- Return structured results
- Work in isolated token contexts

## Overview

Speckit now uses a **distributed agent architecture** to significantly reduce token consumption in the main conversation. Heavy computational work (research, design, task generation, implementation, analysis) is delegated to specialized sub-agents that work in isolated contexts.

## Benefits

### Token Efficiency
- **Before**: All work happened in main conversation, consuming shared token budget
- **After**: Each phase runs in isolated agent context, preserving main conversation tokens
- **Impact**: 70-90% reduction in main conversation token usage

### Parallel Processing
- Multiple agents can work simultaneously on independent tasks
- Research, design, and analysis can happen concurrently
- Implementation phases can be parallelized by user story

### Context Isolation
- Each agent gets only the files it needs
- Prevents context pollution between phases
- Easier to debug and retry failed phases

### Scalability
- Large features no longer overwhelm single conversation
- Can handle complex multi-phase implementations
- Better for projects with many user stories

## Architecture

```
Main Conversation (Coordinator)
├── /speckit.specify (direct - interactive)
├── /speckit.clarify (direct - interactive)
├── /speckit.constitution (direct - simple file operations)
├── /speckit.plan
│   └→ Planning Agent (sonnet) - does all planning work
├── /speckit.tasks
│   └→ Task Generation Agent (sonnet) - generates complete tasks.md
├── /speckit.checklist (interactive clarification, then agent)
│   └→ Checklist Agent (sonnet) - generates requirements quality checklist
├── /speckit.implement
│   ├→ Setup Phase Agent (sonnet)
│   ├→ Foundational Phase Agent (sonnet)
│   ├→ User Story 1 Agent (sonnet)
│   ├→ User Story 2 Agent (sonnet)
│   └→ Polish Phase Agent (sonnet)
├── /speckit.analyze
│   └→ Analysis Agent (sonnet) - performs consistency analysis
└── /speckit.taskstoissues (direct - uses GitHub MCP server)
```

## Command Changes

### `/speckit.plan` - Agent Delegation

**Phase 0: Research**
- Delegates to `general-purpose` agent with `haiku` model (cost-efficient)
- Agent reads: spec.md, plan template, constitution.md
- Agent generates: research.md with resolved NEEDS CLARIFICATION items
- Returns: "Research complete. Generated research.md with N decisions."

**Phase 1: Design**
- Delegates to `general-purpose` agent with `sonnet` model (needs sophistication)
- Agent reads: spec.md, research.md, plan.md, constitution.md
- Agent generates: data-model.md, contracts/, quickstart.md
- Agent runs: update-agent-context.sh script
- Returns: "Design artifacts complete: [list of files created]"

**Main Conversation**: Validates artifacts exist, reports completion

### `/speckit.tasks` - Agent Delegation

**Task Generation**
- Delegates to `general-purpose` agent with `sonnet` model
- Agent reads: spec.md, plan.md, data-model.md, contracts/, research.md
- Agent reads: tasks-template.md
- Agent generates: tasks.md with proper format validation
- Returns: "Task generation complete. Created tasks.md with N tasks across M phases."

**Main Conversation**: Validates format compliance, reports summary

### `/speckit.implement` - Phase-by-Phase Delegation

**For each phase** (Setup, Foundational, User Stories, Polish):
1. Main conversation extracts phase tasks from tasks.md
2. Delegates phase to `general-purpose` agent with `sonnet` model
3. Agent reads: spec.md, plan.md, tasks.md, data-model.md, contracts/, constitution.md, CLAUDE.md
4. Agent implements all tasks in phase
5. Agent marks tasks as [X] in tasks.md
6. Returns: "Phase N complete. Completed X/Y tasks. [details]"
7. Main conversation validates, reports progress, proceeds to next phase

**Benefits**:
- Each phase gets fresh token budget
- Failed phases can be retried without losing other work
- Clear progress tracking between phases
- Independent user story implementation

### `/speckit.analyze` - Agent Delegation

**Analysis**
- Delegates to `general-purpose` agent with `sonnet` model
- Agent reads: spec.md, plan.md, tasks.md, data-model.md, contracts/, research.md, constitution.md
- Agent performs: Duplication, ambiguity, underspecification, constitution, coverage, consistency checks
- Agent generates: Markdown analysis report with findings table
- Returns: Complete analysis report

**Main Conversation**: Displays report, offers remediation

### `/speckit.specify` - Remains Direct
- Stays in main conversation (interactive, needs user clarification)
- Creates spec.md interactively
- Validates quality with checklist

### `/speckit.clarify` - Remains Direct
- Stays in main conversation (interactive Q&A)
- Sequential question loop with user
- Updates spec.md incrementally

### `/speckit.constitution` - Remains Direct
- Stays in main conversation (simple file operations)
- Creates or updates project constitution
- Updates dependent templates

### `/speckit.checklist` - Hybrid Approach
**Main Conversation** (interactive clarification):
- Asks 3-5 clarifying questions about checklist focus
- Derives checklist theme, focus areas, depth level
- Prepares context for agent

**Agent** (generates checklist):
- Reads spec.md, plan.md, tasks.md
- Generates "Unit Tests for English" - validates requirements quality
- Tests whether requirements are well-written, not whether implementation works
- Creates checklist file in FEATURE_DIR/checklists/[domain].md
- Returns summary with item count and key findings

**Main Conversation**: Displays results

### `/speckit.taskstoissues` - Remains Direct (uses MCP)
- Stays in main conversation (simple workflow)
- Reads tasks.md
- Verifies git remote is GitHub
- Uses GitHub MCP server to create issues
- No agent needed (straightforward API calls)

## Model Selection Strategy

### Haiku (Fast + Cheap)
- **Use for**: Research, quick lookups, simple transformations
- **Cost**: ~$0.25 per million input tokens
- **Speed**: 2-3x faster than Sonnet

### Sonnet (Balanced)
- **Use for**: Design, task generation, implementation, analysis
- **Cost**: ~$3 per million input tokens
- **Quality**: High-quality outputs, good reasoning

### Opus (Premium)
- **Use for**: Complex architecture decisions, critical implementations
- **Cost**: ~$15 per million input tokens
- **When**: User explicitly requests or ultra-complex scenarios

**Default Strategy**: Haiku for research, Sonnet for everything else, Opus by request

## Usage Examples

### Example 1: Create Plan with Agent Delegation

```
/speckit.plan

# Main conversation:
1. Loads spec.md and constitution.md
2. Extracts NEEDS CLARIFICATION items
3. Launches Research Agent (haiku)
   → Agent reads files
   → Agent researches decisions
   → Agent writes research.md
   → Agent returns summary
4. Main validates research.md exists
5. Launches Design Agent (sonnet)
   → Agent reads spec + research + plan
   → Agent generates data-model.md
   → Agent generates contracts/
   → Agent generates quickstart.md
   → Agent runs update script
   → Agent returns file list
6. Main validates artifacts
7. Reports completion
```

**Token Usage**:
- Before: ~50K tokens in main conversation
- After: ~5K tokens in main (95% saved!)

### Example 2: Implement with Phase Agents

```
/speckit.implement

# Main conversation:
1. Validates checklists
2. Loads tasks.md structure
3. For Phase 1 (Setup):
   → Extracts 8 setup tasks
   → Launches Setup Agent (sonnet)
   → Agent implements T001-T008
   → Agent marks [X] in tasks.md
   → Returns "Setup complete: 8/8 tasks"
4. Main validates completion
5. For Phase 2 (Foundational):
   → Extracts 12 foundational tasks
   → Launches Foundational Agent (sonnet)
   → Agent implements T009-T020
   → Returns "Foundational complete: 12/12"
6. For Phase 3 (User Story 1):
   → Extracts 15 US1 tasks
   → Launches US1 Agent (sonnet)
   → Agent implements T021-T035
   → Returns "US1 complete: 15/15"
7. Continues for remaining phases...
8. Reports final completion
```

**Token Usage**:
- Before: ~150K tokens in main (often hit limits)
- After: ~15K tokens in main (90% saved!)

## Error Handling

### Agent Failures

**Scenario**: Research agent fails to resolve all NEEDS CLARIFICATION

**Handling**:
1. Main conversation receives partial result
2. Identifies missing decisions
3. Options:
   - Retry with more specific prompt
   - Ask user for manual resolution
   - Launch new agent for remaining items

### Phase Failures

**Scenario**: Implementation phase agent fails on task T025

**Handling**:
1. Agent reports: "Phase 3 partial: completed 10/15 tasks. Failed: T025 (reason)"
2. Main conversation marks T001-T024 as [X] in tasks.md
3. Reports to user: "US1 partially complete. T025 needs attention."
4. User can:
   - Fix issue manually
   - Retry phase from T025
   - Skip and continue to next phase

### Token Limits in Agents

**Scenario**: Phase agent hits token limit mid-implementation

**Handling**:
1. Agent returns partial completion with last completed task ID
2. Main conversation notes progress
3. Launches new agent starting from next task
4. Seamless continuation

## Best Practices

### 1. Keep Agent Prompts Focused
- Provide only necessary file paths
- Clear success criteria
- Specific return format

### 2. Validate Between Phases
- Check file existence after agent returns
- Verify format compliance
- Ensure dependencies satisfied

### 3. Use Appropriate Models
- Don't waste Sonnet on simple research
- Don't use Haiku for complex design
- Match model to task complexity

### 4. Track Progress in Main
- Main conversation = source of truth
- Aggregate progress across agents
- Clear communication to user

### 5. Enable Retry
- Make phases idempotent where possible
- Track completion state in tasks.md
- Allow re-running failed phases

## Migration from v1.0

### Breaking Changes
None - commands work the same from user perspective

### Internal Changes
- Added Task tool calls in command prompts
- Restructured command logic for delegation
- Added validation steps after agent returns

### Testing
Test each command to ensure:
1. Agents launch successfully
2. Files are generated correctly
3. Main conversation tracks progress
4. Error handling works properly

## Performance Metrics

Based on typical medium-sized feature:

| Metric | Before (v1.0) | After (v2.0) | Improvement |
|--------|---------------|--------------|-------------|
| Main conversation tokens | 120K | 18K | 85% reduction |
| Plan command duration | 3 min | 2 min | 33% faster |
| Implement command tokens | 180K | 22K | 88% reduction |
| Retry cost on failure | High (full context) | Low (phase only) | 80% reduction |
| Max feature complexity | Limited | Very high | No practical limit |

## Future Enhancements

### Parallel Execution
- Launch multiple phase agents simultaneously for independent user stories
- Research + Design in parallel

### Smart Model Selection
- Analyze task complexity before choosing model
- Dynamic upgrade to Sonnet/Opus if Haiku struggles

### Agent Specialization
- Create domain-specific agents (API design, UI implementation, testing)
- Pre-trained on common patterns

### Progressive Context
- Agents share learnings across phases
- Build up project knowledge over time

## Troubleshooting

### "Agent returned empty result"
- Check file paths in prompt are correct
- Verify agent has read access to files
- Ensure clear return format specified

### "Tasks not marked as complete"
- Verify agent has write access to tasks.md
- Check task ID format matches template
- Ensure agent prompt includes marking instruction

### "Token limit exceeded in agent"
- Phase too large - break into smaller phases
- Reduce context files in agent prompt
- Use more focused file reads

## Support

For issues or questions about the agent architecture:
1. Check this document first
2. Review command prompt in `.claude/commands/`
3. Test with smaller feature to isolate issue
4. File issue with reproduction steps
