# Testing Agent Delegation - Token Efficiency Verification

**Purpose**: Verify that agent delegation is working and achieving token savings
**Date**: 2025-12-02
**Status**: Ready to test

## Test Overview

This guide helps you verify that:
1. Agents are actually being spawned
2. Token usage is reduced in main conversation
3. All functionality works correctly
4. Results are identical to non-agent version

## Prerequisites

- Speckit refactored with agent delegation (✅ Complete)
- A test feature to implement
- Ability to check token usage

## How to Check Token Usage

### During Conversation

Look for token usage warnings from Claude Code:
```
Token usage: 5000/200000; 195000 remaining
```

### After Each Command

Note the token count **in main conversation** after each command completes.

## Test Plan

### Scenario: Simple Feature Implementation

We'll create a minimal feature to test the full workflow.

### Step 1: Create Feature Spec

**Command:**
```
/speckit.specify Add a simple "Hello World" button that displays an alert when clicked
```

**What to observe:**
- Command runs in main conversation (no agent - expected)
- Token usage after completion: ~3-5K tokens
- Creates: `specs/XXX-hello-world-button/spec.md`

**Expected behavior:**
- Interactive spec creation
- Clarification questions if needed
- Spec validation

### Step 2: Run Planning (AGENT TEST)

**Command:**
```
/speckit.plan
```

**What to observe - CRITICAL:**

✅ **Signs agents are working:**
1. Main conversation shows: "Delegating to planning agent..."
2. You see: 🔄 "Execute implementation planning workflow" task is running
3. Agent works (may take 30-60 seconds)
4. You see: ✅ Task complete
5. Main shows only the summary result

✅ **Token check:**
- Main conversation tokens AFTER this command: Should be ~8-10K total (only ~5K added)
- WITHOUT agents: Would be ~50-60K total (~50K added)

✅ **Files created:**
- `plan.md` - filled with Technical Context, Constitution Check
- `research.md` - with resolved decisions
- `data-model.md` (if entities in spec)
- `quickstart.md`
- Updated CLAUDE.md

**If something's wrong:**
- No agent message appears → Agents not spawning
- Token usage is high (~50K) → Agent delegation not working, work done in main
- Files not created → Agent failed to complete work

### Step 3: Generate Tasks (AGENT TEST)

**Command:**
```
/speckit.tasks
```

**What to observe:**

✅ **Signs agents are working:**
1. Main shows: "Delegating to task generation agent..."
2. 🔄 "Generate implementation tasks" task running
3. ✅ Task complete
4. Main shows summary only

✅ **Token check:**
- Main conversation tokens: Should be ~11-13K total (~3K added)
- WITHOUT agents: Would be ~80-90K total (~30K added)

✅ **Files created:**
- `tasks.md` with proper format (checkboxes, IDs, file paths)

### Step 4: Run Analysis (AGENT TEST)

**Command:**
```
/speckit.analyze
```

**What to observe:**

✅ **Signs agents are working:**
1. Main shows: "Delegating to analysis agent..."
2. 🔄 "Analyze artifacts for consistency" task running
3. ✅ Task complete
4. Main displays analysis report

✅ **Token check:**
- Main conversation tokens: Should be ~15-17K total (~4K added)
- WITHOUT agents: Would be ~120-130K total (~40K added)

### Step 5: Implement First Phase (AGENT TEST)

**Command:**
```
/speckit.implement
```

**What to observe:**

✅ **Signs agents are working:**
1. Main checks checklists (in main - interactive)
2. Main parses phases
3. For each phase:
   - Main shows: "Delegating Phase 1: Setup..."
   - 🔄 "Implement Phase 1: Setup" task running
   - ✅ Task complete
   - Main shows: "Phase 1 complete: X/Y tasks"
   - Repeats for each phase

✅ **Token check:**
- Main conversation tokens: Should be ~30-40K total (~15-25K added for all phases)
- WITHOUT agents: Would be ~300-320K total (~180K added)

✅ **Implementation result:**
- Tasks marked [X] in tasks.md
- Code files created per tasks
- Phase summaries shown

## Token Usage Scorecard

Track your actual results:

| Command | Expected Main Tokens | Your Actual | ✅/❌ |
|---------|---------------------|-------------|-------|
| /speckit.specify | ~3-5K | _______ | ___ |
| /speckit.plan | +~5K (total: 8-10K) | _______ | ___ |
| /speckit.tasks | +~3K (total: 11-13K) | _______ | ___ |
| /speckit.analyze | +~4K (total: 15-17K) | _______ | ___ |
| /speckit.implement | +~15-25K (total: 30-40K) | _______ | ___ |
| **TOTAL WORKFLOW** | **~30-40K** | _______ | ___ |

**Without agents**: ~300-320K tokens (for comparison)

**Savings**: ~88-90%

## Troubleshooting

### Problem: No Agent Messages Appear

**Symptom:** Commands run but you never see "🔄 task is running"

**Cause:** Task tool not being invoked

**Fix:**
1. Check command file has Task tool usage in the Outline section
2. Verify you're using the refactored command files (not old ones)
3. Example check:
   ```bash
   grep -n "Task tool" .claude/commands/speckit.plan.md
   ```
   Should show Task tool invocation in the file

### Problem: High Token Usage (>50K after /speckit.plan)

**Symptom:** Token usage similar to old version

**Cause:** Agent delegation not working, work happening in main

**Possible reasons:**
1. Old command file still in place
2. Task tool invocation syntax incorrect
3. Agent subprocess failing

**Fix:**
1. Verify command file was updated:
   ```bash
   head -100 .claude/commands/speckit.plan.md
   ```
   Should see "Agent Delegation" section
2. Check for errors in agent execution
3. Re-read the refactored command files from this conversation

### Problem: Files Not Created

**Symptom:** Agent completes but artifacts missing

**Cause:** Agent didn't have write permissions or wrong paths

**Fix:**
1. Check agent prompt includes correct file paths
2. Verify FEATURE_DIR is absolute path
3. Check file system permissions

### Problem: Agent Hangs/Times Out

**Symptom:** 🔄 task running... but never completes

**Cause:** Agent stuck or too complex

**Fix:**
1. Wait (agents can take 1-2 minutes for complex work)
2. Check if agent hit token limit
3. Simplify the feature for testing
4. Use smaller model (haiku) for research if available

## Success Criteria

✅ Your setup is working correctly if:

1. **Agent indicators appear**: 🔄 and ✅ messages for each delegated command
2. **Token savings achieved**: Main conversation uses ~30-40K for full workflow (vs ~300K without agents)
3. **All files created**: spec.md, plan.md, research.md, tasks.md, etc.
4. **Functionality preserved**: Same results as old version
5. **No errors**: Agents complete successfully

## Quick Verification Commands

Run these to verify your setup:

```bash
# 1. Check refactored command files exist
ls -lh .claude/commands/speckit.*.md

# 2. Verify they mention "Task tool" or "Agent Delegation"
grep -l "Task tool" .claude/commands/speckit.*.md
grep -l "Agent Delegation" .claude/commands/speckit.*.md

# 3. Check documentation is in place
ls -lh .specify/docs/agent-*.md
```

## Alternative: Test with Existing Feature

If you already have a feature in progress:

```bash
# Navigate to existing feature directory
cd specs/004-url-settings-storage

# Test just one command
/speckit.analyze

# Watch for agent delegation indicators
```

## Benchmark Test (Advanced)

For detailed token measurement:

1. **Start fresh conversation** (to reset token count)
2. **Copy this test sequence** and paste:

```
/speckit.specify Create a simple feature: Add a "Copy to Clipboard" button that copies current page URL

[Answer any clarification questions]

/speckit.plan

/speckit.tasks

/speckit.analyze
```

3. **After each command**, note the token count shown
4. **Compare** to the scorecard above

## Expected Timeline

- `/speckit.plan`: 30-90 seconds (agent processes research + design)
- `/speckit.tasks`: 20-60 seconds (agent generates tasks)
- `/speckit.analyze`: 15-45 seconds (agent analyzes artifacts)
- `/speckit.implement`: 2-10 minutes (multiple phase agents, depends on task count)

## Reporting Results

After testing, you should know:

✅ **Agents are working** - You saw 🔄 messages
✅ **Token efficiency achieved** - ~30-40K vs ~300K (88-90% savings)
✅ **Functionality preserved** - All files created correctly
✅ **Ready for production** - Can use on real features

---

## Next Steps After Successful Test

1. **Use on real feature**: Apply to 004-url-settings-storage
2. **Monitor performance**: Track actual token usage over time
3. **Optimize if needed**: Adjust model selection (haiku vs sonnet)
4. **Share results**: Document your actual token savings

## Questions to Answer

After testing:

- [ ] Do agent messages appear for delegated commands?
- [ ] Is token usage <40K for full workflow?
- [ ] Are all expected files created?
- [ ] Do results match quality expectations?
- [ ] Any errors or failures encountered?

If you answer "Yes" to first 4 questions → **Setup is working perfectly!**
