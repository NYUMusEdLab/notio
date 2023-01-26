import React, { useState, useEffect } from 'react';

function SoundManager({ onFrequencyChange }) {
  const [frequency, setFrequency] = useState(0);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const maxFrequency = dataArray.indexOf(Math.max(...dataArray));
        setFrequency(maxFrequency);
        onFrequencyChange && onFrequencyChange(maxFrequency);
      }, 50);
    })
    .catch(error => console.log(error));
    return () => {
      microphone.disconnect();
      analyser.
