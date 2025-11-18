# Contract: Out-of-Scale Audio Feedback API

**Feature**: 001-piano-key-keyboard-navigation
**Date**: 2025-01-16
**Contract Version**: 1.0.0

---

## Overview

This contract defines the API for playing audio cues when a user activates a piano key that is NOT in the currently selected scale. The cue provides immediate educational feedback to help users learn scale patterns.

---

## Contract Scope

**Components**:
- `Key` component - Triggers out-of-scale cue
- `Keyboard` component - Proxies cue to audio engine
- `SoundMaker` - Audio engine that plays the cue
- Tone.js adapter - Implements cue playback via Web Audio API

**Performance Guarantee**:
- Latency: <20ms from trigger to audio output (same as normal notes - NFR-001)
- No degradation from master branch (NFR-002)

---

## API Contract

### Method: `playOutOfScaleCue(config)`

**Location**: Multiple levels (component → engine → adapter)

**Purpose**: Play a brief, distinct audio cue indicating the activated note is outside the current scale

**Signature**:
```typescript
interface OutOfScaleCueConfig {
  note: string;           // MIDI note name (e.g., "F#4")
  cueType?: 'muted_tone' | 'click' | 'dissonant_chord';  // Type of cue
  volume?: number;        // Volume (0.0 - 1.0), default 0.2
  duration?: number;      // Duration in ms, default 50
}

function playOutOfScaleCue(config: OutOfScaleCueConfig): void;
```

**Parameters**:

| Parameter | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| `note` | `string` | Yes | N/A | Must match `/^[A-G][#b]?[0-9]$/` | MIDI note name (e.g., "C4", "F#5", "Bb3") |
| `cueType` | `string` | No | `'muted_tone'` | One of: `'muted_tone'`, `'click'`, `'dissonant_chord'` | Type of audio cue to play |
| `volume` | `number` | No | `0.2` | `0.0 <= volume <= 1.0` | Volume level (fraction of normal note volume) |
| `duration` | `number` | No | `50` | `duration > 0 && duration <= 200` | Duration in milliseconds |

**Returns**: `void` (fire-and-forget, no return value)

**Throws**: No exceptions (graceful degradation on error)

---

## Implementation Hierarchy

### Level 1: Key Component (Trigger)

**File**: [src/components/keyboard/Key.js](src/components/keyboard/Key.js)

**Responsibility**: Detect out-of-scale condition and trigger cue

**Implementation**:
```javascript
class Key extends Component {
  handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (this.props.toneIsInScale) {
        // Normal note playback
        this.props.noteOnHandler(this.props.note);
        setTimeout(() => {
          this.props.noteOffHandler(this.props.note);
        }, 200);
      } else {
        // OUT-OF-SCALE CUE
        this.props.playOutOfScaleCue({
          note: this.props.note,
          cueType: 'muted_tone',  // MVP default
          volume: 0.2,            // 20% of normal volume
          duration: 50,           // 50ms (brief cue)
        });
      }
    }
  };
}
```

**Contract**:
- **Input**: `this.props.toneIsInScale` (boolean from parent)
- **Output**: Call `this.props.playOutOfScaleCue(config)` if `!toneIsInScale`
- **Guarantee**: Cue triggered ONLY when note is out of scale

---

### Level 2: Keyboard Component (Proxy)

**File**: [src/components/keyboard/Keyboard.js](src/components/keyboard/Keyboard.js)

**Responsibility**: Proxy cue request to audio engine

**Implementation**:
```javascript
class Keyboard extends Component {
  playOutOfScaleCue = (config) => {
    // Proxy to audio engine
    this.state.synth.playOutOfScaleCue(config);

    // Optional: Track cue playback for analytics
    console.log(`Out-of-scale cue played: ${config.note}`);
  };

  render() {
    return (
      <div className="Keyboard">
        {noteList.map((noteData, index) => (
          <Key
            key={index}
            // ... existing props
            playOutOfScaleCue={this.playOutOfScaleCue}  // Pass callback
          />
        ))}
      </div>
    );
  }
}
```

**Contract**:
- **Input**: `config` object from Key component
- **Output**: Call `this.state.synth.playOutOfScaleCue(config)`
- **Guarantee**: Cue passed to audio engine without modification

---

### Level 3: SoundMaker Component (Audio Engine)

**File**: [src/Model/SoundMaker.js](src/Model/SoundMaker.js)

**Responsibility**: Route cue to appropriate audio adapter

**Implementation**:
```javascript
class SoundMaker extends Component {
  playOutOfScaleCue(config) {
    // Route to active adapter
    this.soundMakerAdapter.playOutOfScaleCue(config);
  }
}
```

**Contract**:
- **Input**: `config` object from Keyboard component
- **Output**: Call `this.soundMakerAdapter.playOutOfScaleCue(config)`
- **Guarantee**: Cue passed to adapter (Tone.js or SoundFont)

---

### Level 4: Adapter Implementation (Web Audio API)

**File**: [src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js](src/Model/Adapters/Adapter_Tonejs_to_SoundMaker.js)

**Responsibility**: Play actual audio cue via Tone.js/Web Audio API

**Implementation**:
```javascript
class ts_Adapter_to_SoundMaker {
  playOutOfScaleCue(config) {
    const { note, cueType = 'muted_tone', volume = 0.2, duration = 50 } = config;

    // Performance measurement (optional)
    const t0 = performance.now();

    switch (cueType) {
      case 'muted_tone':
        // Play note at reduced volume for brief duration
        this.piano.keyDown(note, Tone.now(), { volume });
        setTimeout(() => {
          this.piano.keyUp(note, Tone.now());
        }, duration);
        break;

      case 'click':
        // Play short click sound (1000Hz sine wave, 20ms)
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C6", duration / 1000, Tone.now(), volume);
        break;

      case 'dissonant_chord':
        // Play note + tritone (dissonant interval)
        this.piano.keyDown(note, Tone.now(), { volume });
        const tritone = Tone.Frequency(note).transpose(6); // +6 semitones
        this.piano.keyDown(tritone.toNote(), Tone.now(), { volume });
        setTimeout(() => {
          this.piano.keyUp(note, Tone.now());
          this.piano.keyUp(tritone.toNote(), Tone.now());
        }, duration);
        break;

      default:
        console.warn(`Unknown cueType: ${cueType}, falling back to muted_tone`);
        this.piano.keyDown(note, Tone.now(), { volume });
        setTimeout(() => {
          this.piano.keyUp(note, Tone.now());
        }, duration);
    }

    // Performance measurement (optional)
    const t1 = performance.now();
    console.log(`Out-of-scale cue latency: ${t1 - t0}ms`);
  }
}
```

**Contract**:
- **Input**: `config` object with validated parameters
- **Output**: Audio playback via Web Audio API
- **Guarantee**: Audio starts within <20ms of method call
- **Error Handling**: Unknown `cueType` falls back to `'muted_tone'`

---

## Cue Type Specifications

### 1. Muted Tone (MVP Default)

**Description**: Play the actual note at reduced volume for a brief duration

**Parameters**:
- `note`: User-activated note (e.g., "F#4")
- `volume`: 0.2 (20% of normal)
- `duration`: 50ms

**Pros**:
- Musical context preserved (user hears the actual note)
- Non-intrusive
- Easy to implement (reuse existing note playback)

**Cons**:
- May be confused with volume issue
- Less distinct from normal notes

**Use Case**: MVP implementation, default mode

**Example**:
```javascript
playOutOfScaleCue({ note: 'F#4', cueType: 'muted_tone', volume: 0.2, duration: 50 });
// Plays F#4 at 20% volume for 50ms
```

---

### 2. Click/Beep (Alternative)

**Description**: Short sine wave tone (non-musical sound)

**Parameters**:
- `note`: Ignored (plays fixed frequency)
- `volume`: 0.2
- `duration`: 20ms
- `frequency`: 1000Hz (C6)

**Pros**:
- Clearly different from musical notes
- Very brief, non-intrusive
- Universally recognizable as "error" feedback

**Cons**:
- Breaks musical flow
- May be jarring for users
- Loses musical context

**Use Case**: Alternative mode for users who prefer non-musical feedback

**Example**:
```javascript
playOutOfScaleCue({ note: 'F#4', cueType: 'click', volume: 0.2, duration: 20 });
// Plays 1000Hz sine wave for 20ms (ignores F#4)
```

---

### 3. Dissonant Chord (Future Enhancement)

**Description**: Play note + tritone (dissonant interval) simultaneously

**Parameters**:
- `note`: User-activated note (e.g., "F#4")
- `volume`: 0.2
- `duration`: 100ms
- `interval`: Tritone (+6 semitones)

**Pros**:
- Musical but clearly "wrong" sounding
- Educational value (demonstrates dissonance)
- More distinct than muted tone

**Cons**:
- More complex to implement (two simultaneous notes)
- May be too intrusive
- Longer duration (100ms vs 50ms)

**Use Case**: Future enhancement, optional mode for advanced users

**Example**:
```javascript
playOutOfScaleCue({ note: 'F#4', cueType: 'dissonant_chord', volume: 0.2, duration: 100 });
// Plays F#4 + C5 (tritone) simultaneously for 100ms
```

---

## Performance Contract

### Latency Guarantee

**Target**: <20ms from `playOutOfScaleCue()` call to audio output start

**Measurement**:
```javascript
const t0 = performance.now();
this.playOutOfScaleCue(config);
const t1 = performance.now();
console.log(`Cue latency: ${t1 - t0}ms`);
```

**Acceptance Criteria**:
- Average latency <20ms
- 95th percentile (p95) <30ms
- 99th percentile (p99) <40ms

**Regression Test**: Latency must NOT increase from master branch baseline

---

### Resource Usage

**Memory**:
- Cue playback uses same audio buffers as normal notes (no additional memory)
- No audio buffer allocation during playback (pre-loaded by Tone.js)

**CPU**:
- Negligible additional CPU load (same audio synthesis as normal notes, shorter duration)
- No background processing (fire-and-forget)

**Audio Context**:
- Reuses existing AudioContext (no new context creation)
- No additional audio nodes (uses same piano instrument)

---

## Error Handling Contract

### Invalid Note Name

**Error**: `note` parameter is not a valid MIDI note name

**Handling**:
```javascript
// Validate note format
if (!/^[A-G][#b]?[0-9]$/.test(note)) {
  console.warn(`Invalid note name: ${note}, skipping cue`);
  return; // Graceful degradation, no crash
}
```

**Guarantee**: Invalid notes are logged and ignored (no crash)

---

### Invalid Volume

**Error**: `volume` parameter is out of range (< 0 or > 1)

**Handling**:
```javascript
// Clamp volume to valid range
const clampedVolume = Math.max(0, Math.min(volume, 1));
```

**Guarantee**: Volume automatically clamped to [0.0, 1.0]

---

### Invalid Duration

**Error**: `duration` parameter is negative or excessively long

**Handling**:
```javascript
// Clamp duration to valid range
const clampedDuration = Math.max(10, Math.min(duration, 200));
```

**Guarantee**: Duration automatically clamped to [10ms, 200ms]

---

### Audio Context Suspended

**Error**: Web Audio API AudioContext is in "suspended" state

**Handling**:
```javascript
if (Tone.context.state !== 'running') {
  // Resume audio context (requires user gesture)
  await Tone.context.resume();
}
this.piano.keyDown(note, Tone.now(), { volume });
```

**Guarantee**: Audio context automatically resumed before playback

---

### Unknown Cue Type

**Error**: `cueType` is not one of the defined types

**Handling**:
```javascript
default:
  console.warn(`Unknown cueType: ${cueType}, falling back to muted_tone`);
  // Play muted tone as fallback
```

**Guarantee**: Unknown types fall back to `'muted_tone'` (safe default)

---

## Integration Contract

### With Existing Note Playback

**Guarantee**: Out-of-scale cues do NOT interfere with normal note playback

**Implementation**:
- Cues use same audio system (Tone.js Piano)
- No conflicts with `activeNotes` state (cues are transient, not tracked)
- No polyphony issues (Tone.js handles multiple simultaneous sounds)

**Example**:
```javascript
// User can play normal note while cue is playing
this.noteOnHandler("C4");              // Normal note starts
this.playOutOfScaleCue({ note: "F#4" }); // Cue plays simultaneously
// Both sounds play without conflict
```

---

### With Scale Detection

**Dependency**: `toneIsInScale` prop must be accurate

**Contract**:
```javascript
// Scale detection (existing logic in Keyboard.js)
let toneindex = currentScale.MidiNoteNr.indexOf(keyboardLayoutScale.MidiNoteNr[index]);
if (toneindex !== -1) {
  toneIsInScale = true;  // In scale
} else {
  toneIsInScale = false; // Out of scale → trigger cue
}

// Key component uses this prop
if (this.props.toneIsInScale) {
  // Normal note
} else {
  // Out-of-scale cue
  this.props.playOutOfScaleCue({...});
}
```

**Guarantee**: Cue triggered if and only if note is NOT in current scale

---

## Testing Contract

### Integration Tests MUST Verify

1. **Out-of-scale cue plays** when activating key outside current scale:
   ```javascript
   // Setup: C Major scale
   // Activate F# (not in C Major)
   // Expect: playOutOfScaleCue() called with F# config
   ```

2. **Normal note plays** when activating key inside current scale:
   ```javascript
   // Setup: C Major scale
   // Activate C4 (in C Major)
   // Expect: noteOnHandler() called, NOT playOutOfScaleCue()
   ```

3. **Cue latency <20ms**:
   ```javascript
   const t0 = performance.now();
   playOutOfScaleCue({ note: 'F#4' });
   const t1 = performance.now();
   expect(t1 - t0).toBeLessThan(20);
   ```

4. **All cue types work**:
   ```javascript
   playOutOfScaleCue({ note: 'F#4', cueType: 'muted_tone' });
   playOutOfScaleCue({ note: 'F#4', cueType: 'click' });
   playOutOfScaleCue({ note: 'F#4', cueType: 'dissonant_chord' });
   // All should produce distinct sounds
   ```

5. **Error handling works**:
   ```javascript
   playOutOfScaleCue({ note: 'INVALID' }); // Should log warning, not crash
   playOutOfScaleCue({ note: 'C4', volume: 999 }); // Should clamp to 1.0
   ```

---

### E2E Tests MUST Verify

1. **Complete out-of-scale workflow**:
   ```
   1. Select C Major scale
   2. Tab to piano keyboard
   3. Navigate to F# key (out of scale)
   4. Press Enter
   5. Verify audio cue plays (distinct from normal note)
   6. Verify latency <20ms
   ```

2. **Cross-browser compatibility**:
   - Test in Chrome, Firefox, Safari
   - Verify cue plays correctly in all browsers
   - Verify latency <20ms in all browsers

3. **Screen reader announcement** (optional enhancement):
   ```
   // Select C Major, activate F#
   // Screen reader should announce: "Playing F sharp 4 - not in scale"
   ```

---

## Future Enhancements

### Configurable Cue Settings

**Allow users to customize cue behavior**:
```javascript
// In user settings
const userPreferences = {
  outOfScaleCueEnabled: true,
  outOfScaleCueType: 'muted_tone',
  outOfScaleCueVolume: 0.2,
  outOfScaleCueDuration: 50,
};

// Pass to playOutOfScaleCue
this.props.playOutOfScaleCue({
  note: this.props.note,
  ...userPreferences,
});
```

### Visual Feedback

**Highlight out-of-scale keys visually**:
```javascript
// In ColorKey component
<div className={`ColorKey ${toneIsInScale ? 'in-scale' : 'out-of-scale'}`}>
  {/* Visual indicator for out-of-scale keys (e.g., different opacity) */}
</div>
```

### ARIA Announcement Enhancement

**Announce when out-of-scale note played**:
```javascript
<div aria-live="polite">
  {this.state.lastPlayedNote}
  {!this.state.lastNoteToneIsInScale && " - not in scale"}
</div>
```

---

## Contract Version History

**1.0.0** (2025-01-16):
- Initial contract definition
- Three cue types: muted_tone (MVP), click, dissonant_chord
- Latency guarantee: <20ms
- Error handling: graceful degradation
- Integration with existing note playback system

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
