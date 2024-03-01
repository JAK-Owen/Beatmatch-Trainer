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

function createMetronome() {
  if (!audioContext) {
    return null;  // Return null if audioContext is not initialized yet
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  return {
    oscillator,
    gainNode
  };
}

function updateLeftPitch() {
  if (leftMetronome) {
    updateMetronome(leftMetronome, 0); // Using a pitch value of 0 for C3
  }
}

function updateRightPitch() {
  if (rightMetronome) {
    updateMetronome(rightMetronome, 0); // Using a pitch value of 0 for F3
  }
}

function updateMetronome(metronome, pitch) {
  // Use predefined pitches for the left and right metronomes
  const pitchValue = metronome === leftMetronome ? 'C3' : 'F3';

  // Ensure pitch is a valid finite number
  const frequency = parseFloat(pitchValue);
  if (!isNaN(frequency) && isFinite(frequency)) {
    metronome.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  }

  metronome.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
  metronome.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
}


function startAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    leftMetronome = createMetronome();
    rightMetronome = createMetronome();
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
