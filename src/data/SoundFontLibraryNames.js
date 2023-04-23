const SoundFontLibraryNames = [
  { data_index_name: "acoustic_grand_piano", label: "Grand Piano" },
  // { data_index_name: "bright_acoustic_piano" },
  { data_index_name: "electric_grand_piano", label: "Electric Piano" },
  { data_index_name: "honkytonk_piano", label: "Honkeytonk Piano" },
  // { data_index_name: "electric_piano_1" },
  // { data_index_name: "electric_piano_2" },
  // { data_index_name: "harpsichord" },
  { data_index_name: "clavinet", label: "Clavinet" },
  // { data_index_name: "celesta" },
  // { data_index_name: "glockenspiel" },
  // { data_index_name: "music_box" },
  { data_index_name: "vibraphone", label: "Vibrafone" },
  // { data_index_name: "marimba" },
  { data_index_name: "xylophone", label: "Xylophone" },
  // { data_index_name: "tubular_bells" },
  // { data_index_name: "dulcimer" },
  { data_index_name: "drawbar_organ", label: "Drawbar Organ" },
  // { data_index_name: "percussive_organ" },
  // { data_index_name: "rock_organ" },
  // { data_index_name: "church_organ" },
  { data_index_name: "reed_organ", label: "Reed Organ" },
  { data_index_name: "accordion", label: "Accordion" },
  // { data_index_name: "harmonica" },
  // { data_index_name: "tango_accordion" },
  { data_index_name: "acoustic_guitar_nylon", label: "Accoustic Guitar" },
  // { data_index_name: "acoustic_guitar_steel" },
  // { data_index_name: "electric_guitar_jazz" },
  { data_index_name: "electric_guitar_clean", label: "Electric Guitar" },
  // { data_index_name: "electric_guitar_muted" },
  // { data_index_name: "overdriven_guitar" },
  // { data_index_name: "distortion_guitar" },
  // { data_index_name: "guitar_harmonics" },
  { data_index_name: "acoustic_bass", label: "Accoustic Bass" },
  // { data_index_name: "electric_bass_finger" },
  // { data_index_name: "electric_bass_pick" },
  { data_index_name: "fretless_bass", label: "Fretless Bass" },
  // { data_index_name: "slap_bass_1" },
  // { data_index_name: "slap_bass_2" },
  // { data_index_name: "synth_bass_1" },
  // { data_index_name: "synth_bass_2" },
  { data_index_name: "violin", label: "violin" },
  // { data_index_name: "viola" },
  // { data_index_name: "cello" },
  // { data_index_name: "contrabass" },
  // { data_index_name: "tremolo_strings" },
  // { data_index_name: "pizzicato_strings" },
  // { data_index_name: "orchestral_harp" },
  // { data_index_name: "timpani" },
  { data_index_name: "string_ensemble_1", label: "String Ensemble" },
  // { data_index_name: "string_ensemble_2" },
  // { data_index_name: "synth_strings_1" },
  // { data_index_name: "synth_strings_2" },
  // { data_index_name: "choir_aahs" },
  // { data_index_name: "voice_oohs" },
  // { data_index_name: "synth_choir" },
  // { data_index_name: "orchestra_hit" },
  { data_index_name: "trumpet", label: "Trumpet" },
  // { data_index_name: "trombone" },
  // { data_index_name: "tuba" },
  { data_index_name: "muted_trumpet", label: "Muted Trumpet" },
  // { data_index_name: "french_horn" },
  // { data_index_name: "brass_section" },
  // { data_index_name: "synth_brass_1" },
  // { data_index_name: "synth_brass_2" },
  // { data_index_name: "soprano_sax" },
  // { data_index_name: "alto_sax" },
  { data_index_name: "tenor_sax", label: "Tenor Sax" },
  // { data_index_name: "baritone_sax" },
  // { data_index_name: "oboe" },
  // { data_index_name: "english_horn" },
  // { data_index_name: "bassoon" },
  // { data_index_name: "clarinet" },
  // { data_index_name: "piccolo" },
  { data_index_name: "flute", label: "Flute" },
  // { data_index_name: "recorder" },
  // { data_index_name: "pan_flute" },
  // { data_index_name: "blown_bottle" },
  // { data_index_name: "shakuhachi" },
  // { data_index_name: "whistle" },
  // { data_index_name: "ocarina" },
  { data_index_name: "lead_1_square", label: "Lead Square" },
  { data_index_name: "lead_2_sawtooth", label: "Lead Sawtooth" },
  // { data_index_name: "lead_3_calliope" },
  // { data_index_name: "lead_4_chiff" },
  // { data_index_name: "lead_5_charang" },
  // { data_index_name: "lead_6_voice" },
  // { data_index_name: "lead_7_fifths" },
  { data_index_name: "lead_8_bass__lead", label: "Bass Lead" },
  // { data_index_name: "pad_1_new_age" },
  { data_index_name: "pad_2_warm", label: "Pad Warm" },
  // { data_index_name: "pad_3_polysynth" },
  // { data_index_name: "pad_4_choir" },
  { data_index_name: "pad_5_bowed", label: "Pad Bowed" },
  // { data_index_name: "pad_6_metallic" },
  // { data_index_name: "pad_7_halo" },
  // { data_index_name: "pad_8_sweep" },
  // { data_index_name: "fx_1_rain" },
  // { data_index_name: "fx_2_soundtrack" },
  // { data_index_name: "fx_3_crystal" },
  // { data_index_name: "fx_4_atmosphere" },
  // { data_index_name: "fx_5_brightness" },
  // { data_index_name: "fx_6_goblins" },
  // { data_index_name: "fx_7_echoes" },
  // { data_index_name: "fx_8_scifi" },
  // { data_index_name: "sitar" },
  // { data_index_name: "banjo" },
  // { data_index_name: "shamisen" },
  // { data_index_name: "koto" },
  // { data_index_name: "kalimba" },
  // { data_index_name: "bagpipe" },
  // { data_index_name: "fiddle" },
  // { data_index_name: "shanai" },
  // { data_index_name: "tinkle_bell" },
  // { data_index_name: "agogo" },
  { data_index_name: "steel_drums", label: "Steel Drums" },
  // { data_index_name: "woodblock" },
  // { data_index_name: "taiko_drum" },
  // { data_index_name: "melodic_tom" },
  // { data_index_name: "synth_drum" },
  // { data_index_name: "reverse_cymbal" },
  // { data_index_name: "guitar_fret_noise" },
  // { data_index_name: "breath_noise" },
  // { data_index_name: "seashore" },
  // { data_index_name: "bird_tweet" },
  // { data_index_name: "telephone_ring" },
  // { data_index_name: "helicopter" },
  // { data_index_name: "applause" },
  // { data_index_name: "gunshot" },
];

export default SoundFontLibraryNames;
