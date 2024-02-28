// Initialize Tone.js
const leftMetronome = Tone.Transport;
const rightMetronome = Tone.Transport;

// Initialize pitch faders
const leftFader = document.getElementById('leftFader');
const rightFader = document.getElementById('rightFader');

// Set initial random BPMs
const leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
const rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

// Set initial random pitches a 5th apart
const leftPitch = 0;
const rightPitch = 7;

// Initialize Tone.js Synths
const leftSynth = new Tone.Synth().toDestination();
const rightSynth = new Tone.Synth().toDestination();

// Set initial BPM and pitch
leftMetronome.bpm.value = leftBPM;
rightMetronome.bpm.value = rightBPM;

leftSynth.set({ "detune": leftPitch * 100 });
rightSynth.set({ "detune": rightPitch * 100 });

// Start metronomes on user gesture (e.g., button click)
document.getElementById('startButton').addEventListener('click', () => {
    // Check if the audio context is in a suspended state
    if (Tone.context.state === 'suspended') {
        Tone.context.resume().then(() => {
            console.log('Audio context resumed');
            startMetronomes();
        });
    } else {
        startMetronomes();
    }
});

function startMetronomes() {
    // Start the metronomes
    leftMetronome.start();
    rightMetronome.start();
}

// Update pitch and BPM on fader movement
leftFader.addEventListener('input', updateLeft);
rightFader.addEventListener('input', updateRight);

function updateLeft() {
    const value = parseFloat(leftFader.value);
    leftSynth.set({ "detune": value * 100 });
}

function updateRight() {
    const value = parseFloat(rightFader.value);
    rightSynth.set({ "detune": value * 100 });
}

// Refresh function to set random BPMs and reset faders on page reload
function refresh() {
    leftFader.value = 0;
    rightFader.value = 0;

    leftMetronome.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    rightMetronome.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

    leftSynth.set({ "detune": leftPitch * 100 });
    rightSynth.set({ "detune": rightPitch * 100 });
}

// Call refresh on page load
refresh();
