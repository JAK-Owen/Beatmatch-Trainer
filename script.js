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

// Initialize Tone.js Synths with MembraneSynth
const leftSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
    }
}).toDestination();

const rightSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
    }
}).toDestination();

// Set initial BPM
leftTransport.bpm.value = leftBPM;
rightTransport.bpm.value = rightBPM;

// Start clicks on user gesture (e.g., button click)
document.getElementById('startButton').addEventListener('click', () => {
    console.log('Button clicked');
    // Check if the audio context is in a suspended state
    if (Tone.context.state === 'suspended') {
        Tone.context.resume().then(() => {
            console.log('Audio context resumed');
            startClicks();
        });
    } else {
        console.log('Audio context already active');
        startClicks();
    }
});

function startClicks() {
    console.log('Starting clicks...');
    // If the clicks are already started, stop them
    if (leftTransport.state === 'started') {
        leftTransport.stop();
        leftTransport.position = 0; // Reset position
    }
    if (rightTransport.state === 'started') {
        rightTransport.stop();
        rightTransport.position = 0; // Reset position
    }

    // Use Tone.Sequence for scheduling events for left and right
    const leftSequence = new Tone.Sequence((time) => {
        console.log('Left trigger');
        leftSynth.triggerAttackRelease(fixedPitchLeft, '8n', time);
    }, [null], '8n');

    const rightSequence = new Tone.Sequence((time) => {
        console.log('Right trigger');
        rightSynth.triggerAttackRelease(fixedPitchRight, '8n', time);
    }, [null], '8n');

    // Start the sequences
    leftSequence.start();
    rightSequence.start();

    // Start the left and right transports
    leftTransport.start();
    rightTransport.start();
}

// Update BPM on slider movement
leftSlider.addEventListener('input', updateLeft);
rightSlider.addEventListener('input', updateRight);

function updateLeft() {
    let detuneValue = parseFloat(leftSlider.value);
    
    // Invert the direction for left slider
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
