let audioContext;
let leftMetronome;
let rightMetronome;
let leftIntervalId;
let rightIntervalId;

// Set constant pitches for left and right metronomes
const fixedPitchLeft = 'C3';
const fixedPitchRight = 'F3';

document.getElementById('leftPitch').addEventListener('input', updateLeftPitch);
document.getElementById('rightPitch').addEventListener('input', updateRightPitch);
document.getElementById('playButton').addEventListener('click', startAudioContext);

function createMetronome(panValue) {
  if (!audioContext) {
    return null;  // Return null if audioContext is not initialized yet
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panNode = audioContext.createStereoPanner(); // Added panner node

  oscillator.type = 'sine';
  oscillator.connect(gainNode);
  gainNode.connect(panNode); // Connect gain node to panner node
  panNode.connect(audioContext.destination);
  oscillator.start();

  // Set initial pan value
  panNode.pan.value = panValue;

  return {
    oscillator,
    gainNode,
    panNode
  };
}

function updateLeftPitch() {
  if (leftMetronome) {
    updateMetronome(leftMetronome, -1); // Set pan value to -1 for left
  }
}

function updateRightPitch() {
  if (rightMetronome) {
    updateMetronome(rightMetronome, 1); // Set pan value to 1 for right
  }
}

function updateMetronome(metronome, panValue) {
  // Use predefined pitches for the left and right metronomes
  const pitchValue = metronome === leftMetronome ? fixedPitchLeft : fixedPitchRight;

  // Ensure pitch is a valid finite number
  const frequency = parseFloat(pitchValue);
  if (!isNaN(frequency) && isFinite(frequency)) {
    metronome.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  }

  metronome.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  metronome.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

  // Set the pan value
  metronome.panNode.pan.value = panValue;
}

function startAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    leftMetronome = createMetronome(-1); // Initialize left metronome with pan value -1
    rightMetronome = createMetronome(1); // Initialize right metronome with pan value 1
    startMetronomes();
  }
}

function startMetronomes() {
  if (leftMetronome && rightMetronome) {
    refreshMetronomes();

    const leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    const rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

    leftIntervalId = setInterval(() => updateLeftPitch(), calculateInterval(leftBPM));
    rightIntervalId = setInterval(() => updateRightPitch(), calculateInterval(rightBPM));
  }
}

function stopMetronomes() {
  clearInterval(leftIntervalId);
  clearInterval(rightIntervalId);
}

function refreshMetronomes() {
  document.getElementById('leftPitch').value = 0;
  document.getElementById('rightPitch').value = 0;

  updateLeftPitch();
  updateRightPitch();
}

function calculateInterval(bpm) {
  return (60 / bpm) * 1000;
}

// Initialize on page load
refreshMetronomes();
