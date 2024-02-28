// Initialize Tone.js
const leftTransport = Tone.Transport;
const rightTransport = Tone.Transport;

// Initialize pitch faders
const leftFader = document.getElementById('leftFader');
const rightFader = document.getElementById('rightFader');

// Set initial random BPMs
const leftBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
const rightBPM = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

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

// Set initial BPM and pitch
leftTransport.bpm.value = leftBPM;
rightTransport.bpm.value = rightBPM;

leftSynth.set({ "detune": 0 });
rightSynth.set({ "detune": 0 });

// Start clicks on user gesture (e.g., button click)
document.getElementById('startButton').addEventListener('click', () => {
    // Check if the audio context is in a suspended state
    if (Tone.context.state === 'suspended') {
        Tone.context.resume().then(() => {
            console.log('Audio context resumed');
            startClicks();
        });
    } else {
        startClicks();
    }
});

function startClicks() {
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
    const leftSequence = new Tone.Sequence((time, note) => {
        leftSynth.triggerAttackRelease(note, '8n', time);
    }, ['C4'], '8n');

    const rightSequence = new Tone.Sequence((time, note) => {
        rightSynth.triggerAttackRelease(note, '8n', time);
    }, ['F4'], '8n');

    // Start the sequences
    leftSequence.start();
    rightSequence.start();

    // Start the left and right transports
    leftTransport.start();
    rightTransport.start();
}


// Update pitch and BPM on fader movement
leftFader.addEventListener('input', updateLeft);
rightFader.addEventListener('input', updateRight);

function updateLeft() {
    const pitchValue = parseFloat(leftFader.value);
    const bpmValue = mapPitchToBPM(pitchValue);
    leftTransport.bpm.value = bpmValue;
    leftSynth.set({ "detune": pitchValue * 100 });
}

function updateRight() {
    const pitchValue = parseFloat(rightFader.value);
    const bpmValue = mapPitchToBPM(pitchValue);
    rightTransport.bpm.value = bpmValue;
    rightSynth.set({ "detune": pitchValue * 100 });
}

function mapPitchToBPM(pitch) {
    // Map pitch values to a reasonable range of BPM
    const minBPM = 60;
    const maxBPM = 180;
    const mappedBPM = minBPM + (pitch + 1) * (maxBPM - minBPM) / 2;

    return Math.round(mappedBPM);
}

// Refresh function to set random BPMs and reset faders on page reload
function refresh() {
    leftFader.value = 0;
    rightFader.value = 0;

    leftTransport.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    rightTransport.bpm.value = Math.floor(Math.random() * (150 - 90 + 1)) + 90;

    leftSynth.set({ "detune": 0 });
    rightSynth.set({ "detune": 0 });
}

// Call refresh on page load
refresh();
