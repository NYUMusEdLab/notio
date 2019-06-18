import React from 'react';
import Select from './Select';

import rootNote from '../data/rootNote';
import scales from '../data/scalesObj';
import themes from '../data/themes';

export const Octaves = (props) => {
	return (
		<div className="octave">
			<div>Octave:</div>
			<div>
				<button onClick={() => props.handleClick('minus')}>-</button>
				<p>{props.octave}</p>
				<button onClick={() => props.handleClick('plus')}>+</button>
			</div>
		</div>
	);
};

export const Scale = (props) => {
  return <Select selectName = "Scale" valueToExtract="name" selectEls={scales} handleSelect={props.handleSelect} />
}

export const BaseNote = (props) => {
  return <Select selectName = "Root" selectEls={rootNote} valueToExtract="note" handleSelect={props.handleSelect} />
}

export const Notation = (props) => {
  const notation = [ 'Colors', 'English', 'German', 'Romance', 'Relative', 'Scale Steps', 'Chord extensions'];
  return <Select multiple="true" selectName = "Notation" selectEls={notation} handleSelect={props.handleSelect} />
}

export const Theme = (props) => {
  return <Select selectName = "Theme" selectEls={themes} valueToExtract="name" handleSelect={props.handleSelect} />
}