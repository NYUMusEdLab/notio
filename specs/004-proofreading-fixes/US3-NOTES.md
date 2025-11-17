# US3 - Staff Line Alignment at Gb - Investigation Notes

## Status: Needs Manual Visual Testing

## Issue Description
In extended mode with "Romance" notation enabled, staff lines shift noticeably at Gb, creating a visual discontinuity.

## Investigation Findings

### Code Locations Examined
1. **src/components/musicScore/MusicalStaff.js** - VexFlow rendering component
2. **src/Model/MusicScale.js** - Note name conversion and octave offset logic
3. **convertToRomance()** function (lines 667-686) - English to Romance conversion

### Existing Special Cases
The codebase has special octaveOffset handling for:
- **Cb** (line 206-208): `octaveOffset++` because Cb is enharmonically B from previous octave
- **B#** (line 209-211): `octaveOffset--` because B# is enharmonically C from next octave

### Analysis
- Gb converts correctly to "Solb" in Romance notation
- Gb/F# shouldn't need special octave handling (unlike Cb/B#)
- The "shift" is likely a VexFlow rendering issue or CSS/layout issue
- Issue is visual and requires seeing the actual rendered staff to diagnose

### Potential Causes
1. **VexFlow rendering quirk**: Certain note combinations may render at slightly different positions
2. **CSS styling**: Staff positioning CSS might be affected by note name length ("Solb" vs "Do")
3. **Extended keyboard mode interaction**: The combination of extended mode + Romance notation + Gb specifically

### Recommended Next Steps
1. Run the application with extended keyboard mode enabled
2. Enable Romance notation
3. Navigate to a scale containing Gb (e.g., Gb major, Db major)
4. Visually inspect staff line alignment at the Gb note
5. Use browser dev tools to inspect the SVG elements and CSS
6. Compare staff positioning for Gb vs adjacent notes

### Testing Approach
Manual visual regression testing required:
- Test scales: Gb major, Db major, Ebscale with Gb
- Modes: Extended keyboard ON, Romance notation ON
- Browsers: Chrome, Firefox, Safari
- Look for: Visual discontinuity in staff line rendering

### Possible Fixes (to try after visual confirmation)
1. Add CSS fix for staff positioning consistency
2. Add special case handling for Gb similar to Cb/B# if octave issue
3. Adjust VexFlow viewBox or stave dimensions for consistency
4. Check if Romance note name length affects rendering and adjust spacing

---

**Note**: This is a P2 (Medium Priority) issue affecting visual quality, not functionality or accuracy. All critical P1 issues have been resolved.
