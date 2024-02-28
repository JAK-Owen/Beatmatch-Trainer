// Initialize Tone.js
const leftTransport = Tone.Transport;
const rightTransport = Tone.Transport;

// Initialize BPM sliders
const leftSlider = document.getElementById('leftSlider');
const rightSlider = document.getElementById('rightSlider');

// Set initial random BPMs
const leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
const rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

// Set initial fixed pitches (C4 and F4)
const fixedPitchLeft = 'C4';
const fixedPitchRight = 'F4';

// Initialize Tone.js Synths with basic Synth
const leftSynth = new Tone.Synth().toDestination();
const rightSynth = new Tone.Synth().toDestination();

// Set initial BPM
leftTransport.bpm.value = leftBPM;
rightTransport.bpm.value = rightBPM;

// Play a single note when the button is clicked
document.getElementById('startButton').addEventListener('click', () => {
    console.log('Button clicked');

    // Check if the audio context is in a suspended state
    if (Tone.context.state === 'suspended') {
        Tone.context.resume().then(() => {
            console.log('Audio context resumed');
            playSingleNote();
        });
    } else {
        console.log('Audio context already active');
        playSingleNote();
    }
});

function playSingleNote() {
    // Play a simple note with the left and right synths
    leftSynth.triggerAttackRelease('C4', '8n');
    rightSynth.triggerAttackRelease('F4', '8n');
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

    const bpmValue = mapDetuneToBPM(detuneValue);
    leftTransport.bpm.value = bpmValue;
    console.log('Left BPM:', bpmValue);
}

function updateRight() {
    let detuneValue = parseFloat(rightSlider.value);

    // Ensure detuneValue stays within a reasonable range
    detuneValue = Math.max(-50, Math.min(50, detuneValue));

    const bpmValue = mapDetuneToBPM(detuneValue);
    rightTransport.bpm.value = bpmValue;
    console.log('Right BPM:', bpmValue);
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

    leftTransport.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    rightTransport.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
}

// Call refresh on page load
refresh();
