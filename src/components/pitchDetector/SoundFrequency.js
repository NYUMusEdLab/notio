// import { useState, useEffect } from "react";

// const SoundFrequency = ({ onFrequencyChange }) => {
//   const [frequency, setFrequency] = useState(0);

//   useEffect(() => {
//     const audioContext = new AudioContext();
//     const analyser = audioContext.createAnalyser();
//     const microphone = audioContext.createMediaStreamSource(
//       navigator.mediaDevices.getUserMedia({ audio: true })
//     );
//     microphone.connect(analyser);

//     const dataArray = new Uint8Array(analyser.frequencyBinCount);
//     setInterval(() => {
//       analyser.getByteFrequencyData(dataArray);
//       const maxFrequency = dataArray.indexOf(Math.max(...dataArray));
//       setFrequency(maxFrequency);
//       onFrequencyChange && onFrequencyChange(maxFrequency);
//     }, 50);

//     return () => {
//       microphone.disconnect();
//       analyser.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <p>Frequency: {frequency} Hz</p>
//     </div>
//   );
// };

// export default SoundFrequency;



import { useState, useEffect } from 'react';

const SoundFrequency = ({ onFrequencyChange }) => {
  const [frequency, setFrequency] = useState(0);

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
      analyser.disconnect();
    }
  }, []);

  return (
    <div>
      <p>Frequency: {frequency} Hz</p>
    </div>
  );
}

export default SoundFrequency;
