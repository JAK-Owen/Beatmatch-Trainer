let audioContext;
let leftMetronome;
let rightMetronome;
let leftIntervalId;
let rightIntervalId;

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
    const pitch = parseFloat(document.getElementById('leftPitch').value);
    updateMetronome(leftMetronome, pitch);
  }
}

function updateRightPitch() {
  if (rightMetronome) {
    const pitch = parseFloat(document.getElementById('rightPitch').value);
    updateMetronome(rightMetronome, pitch);
  }
}

function updateMetronome(metronome, pitch) {
  const frequency = 440 * Math.pow(2, pitch / 12);
  metronome.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
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
