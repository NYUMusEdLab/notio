const noteMapping = 
  {
    English: {
      Sharp_Names: 
        [
          'B#', 'C#', 'Cx', 'D#', 'E', 'E#', 'F#', 'Fx', 'G#', 'Gx', 'A#', 'B',
          'B#', 'C#', 'Cx', 'D#', 'E', 'E#', 'F#', 'Fx', 'G#', 'Gx', 'A#', 'B'
        ],
      Flat_Names: 
        [
          'C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb',
          'C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'
        ],
      Double_Flat_Names: 
        [
          'C', 'Db', 'Ebb', 'Eb', 'Fb', 'F', 'Gb', 'Abb', 'Ab', 'Bbb', 'Bb', 'Cb',
          'C', 'Db', 'Ebb', 'Eb', 'Fb', 'F', 'Gb', 'Abb', 'Ab', 'Bbb', 'Bb', 'Cb'
        ]
    },
    German: {
      Sharp_Names: 
        [
          'B#', 'C#', 'Cx', 'D#', 'E', 'E#', 'F#', 'Fx', 'G#', 'Gx', 'A#', 'H',
          'B#', 'C#', 'Cx', 'D#', 'E', 'E#', 'F#', 'Fx', 'G#', 'Gx', 'A#', 'H'
        ],
      Flat_Names: 
        [
          'C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'Cb',
          'C', 'Db', 'D', 'Eb', 'Fb', 'F', 'Gb', 'G', 'Ab', 'A', 'B', 'Cb'
        ],
      Double_Flat_Names: 
        [
          'C', 'Db', 'Ebb', 'Eb', 'Fb', 'F', 'Gb', 'Abb', 'Ab', 'Bbb', 'Bb', 'Cb',
          'C', 'Db', 'Ebb', 'Eb', 'Fb', 'F', 'Gb', 'Abb', 'Ab', 'Bbb', 'Bb', 'Cb'
        ]
    },
    Romance: { 
      Sharp_Names: 
        [
          'Si#', 'Do#', 'Dox', 'Re#', 'Mi', 'Mi#', 'Fa#', 'Fax', 'Sol#', 'Solx', 'La#', 'Si',
          'Si#', 'Do#', 'Dox', 'Re#', 'Mi', 'Mi#', 'Fa#', 'Fax', 'Sol#', 'Solx', 'La#', 'Si'
        ],
      Flat_Names: 
        [
          'Do', 'Reb', 'Re', 'Mib', 'Fab', 'Fa', 'Solb', 'Sol', 'Lab', 'La', 'Sib', 'Dob',
          'Do', 'Reb', 'Re', 'Mib', 'Fab', 'Fa', 'Solb', 'Sol', 'Lab', 'La', 'Sib', 'Dob'
        ],
      Double_Flat_Names:
        [
          'Do', 'Reb', 'Mibb', 'Mib', 'Fab', 'Fa', 'Solb', 'Labb', 'Lab', 'Sibb', 'Sib', 'Dob',
          'Do', 'Reb', 'Mibb', 'Mib', 'Fab', 'Fa', 'Solb', 'Labb', 'Lab', 'Sibb', 'Sib', 'Dob'
        ]
    },
    Relative: {
      Sharp_Names:
      [
        'Do', 
      ],
      Flat_Names:
      [
        'Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'
      ]
    }
  };

  export default noteMapping;