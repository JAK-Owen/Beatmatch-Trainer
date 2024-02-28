// Initialize Tone.js
const leftTransport = Tone.Transport;
const rightTransport = Tone.Transport;

// Initialize BPM sliders
const leftSlider = document.getElementById('leftSlider');
const rightSlider = document.getElementById('rightSlider');

// Set initial random BPMs
let leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
let rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

// Set initial fixed pitches (C4 and F4)
const fixedPitchLeft = 'C4';
const fixedPitchRight = 'F4';

// Initialize Tone.js Synths with basic Synth
const leftSynth = new Tone.Synth().toDestination();
const rightSynth = new Tone.Synth().toDestination();

// Function to play a note with a specific synth at a given time
function playNoteAtTime(synth, pitch, time) {
    synth.triggerAttackRelease(pitch, '8n', time);
}

// Start the metronomes on button click
document.getElementById('startButton').addEventListener('click', () => {
    console.log('Button clicked');

    // Check if the audio context is in a suspended state
    if (Tone.context.state === 'suspended') {
        Tone.context.resume().then(() => {
            console.log('Audio context resumed');
            startMetronomes();
        });
    } else {
        console.log('Audio context already active');
        startMetronomes();
    }
});

// Function to start the metronomes
function startMetronomes() {
    // Clear any existing events
    leftTransport.cancel();
    rightTransport.cancel();

    // Set initial BPMs
    leftTransport.bpm.value = leftBPM;
    rightTransport.bpm.value = rightBPM;

    // Schedule events for left and right metronomes
    leftTransport.scheduleRepeat((time) => {
        playNoteAtTime(leftSynth, fixedPitchLeft, time);
    }, '8n');

    rightTransport.scheduleRepeat((time) => {
        playNoteAtTime(rightSynth, fixedPitchRight, time);
    }, '8n');

    // Start the transports
    leftTransport.start();
    rightTransport.start();
}

// Update BPM on slider movement
leftSlider.addEventListener('input', updateLeft);
rightSlider.addEventListener('input', updateRight);

function updateLeft() {
    let detuneValue = parseFloat(leftSlider.value);

    // Invert the direction for the left slider
    detuneValue = -detuneValue;

    // Ensure detuneValue stays within a reasonable range
    detuneValue = Math.max(-50, Math.min(50, detuneValue));

    leftBPM = mapDetuneToBPM(detuneValue);
    leftTransport.bpm.linearRampToValueAtTime(leftBPM, Tone.now() + 0.1); // Linear adjustment
    console.log('Left BPM:', leftBPM);
}

function updateRight() {
    let detuneValue = parseFloat(rightSlider.value);

    // Ensure detuneValue stays within a reasonable range
    detuneValue = Math.max(-50, Math.min(50, detuneValue));

    rightBPM = mapDetuneToBPM(detuneValue);
    rightTransport.bpm.linearRampToValueAtTime(rightBPM, Tone.now() + 0.1); // Linear adjustment
    console.log('Right BPM:', rightBPM);
}

function mapDetuneToBPM(detune) {
    // Map detune values to a reasonable range of BPM
    const minBPM = 60;
    const maxBPM = 180;
    const mappedBPM = minBPM + (detune + 50) * (maxBPM - minBPM) / 100;

    return Math.max(minBPM, Math.min(maxBPM, Math.round(mappedBPM)));
}

// Refresh function to set random BPMs and reset sliders on page reload
function refresh() {
    leftSlider.value = 0;
    rightSlider.value = 0;

    leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

    startMetronomes(); // Start metronomes with new BPMs
}

// Call refresh on page load
refresh();
