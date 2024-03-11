document.addEventListener('DOMContentLoaded', function () {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = null;
    let isPlaying = false;
    let pressTimes = [];
    let differencesWithIntervals = [];
    let scenarioIndex = 0; // 0: 60 BPM, 1: 120 BPM, 2: 180 BPM
    // made 3 scenarios as required by client
    let scenarios = [60, 120, 180];
    let interval;

    function playClick() {
        oscillator = audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1); // Play for 0.1 seconds
    }

    function startStopMetronome() {
        if (isPlaying) {
            clearInterval(interval);
            isPlaying = false;
            document.getElementById('startStopButton').textContent = 'Start';
        } else {
            let tempo = scenarios[scenarioIndex];
            document.getElementById('tempo').textContent = `Current Tempo: ${tempo}bpm`;
            const intervalTime = 60000 / tempo; // Convert BPM to milliseconds
            interval = setInterval(playClick, intervalTime);
            isPlaying = true;
            document.getElementById('startStopButton').textContent = 'Stop';
        }
    }

    function capturePressTime() {
        // Check if the metronome is currently playing
        const pressTime = audioContext.currentTime;
        console.log('Button pressed at:', pressTime);
        if (!isPlaying) {
            console.log('Metronome is not running. Press the "Start" button first.');
            return;
        }

        const inputsCount = pressTimes.length;
        if (inputsCount > 1) {
            differencesWithIntervals.push((pressTimes[inputsCount - 1] - pressTimes[inputsCount - 2]) * 1000);
            console.log(`${differencesWithIntervals[differencesWithIntervals.length - 1]}`);
        }
        pressTimes.push(pressTime);
        if (pressTimes.length == 4) {
            console.log(`Press Times: ${pressTimes}`);
            calculatePrecisionDifference();
            pressTimes = [];
            scenarioIndex++;
            if (scenarioIndex < scenarios.length) {
                startStopMetronome();
            } else {
                document.getElementById('completion').textContent = "All scenarios completed. Exiting the program.";
                // console.log("All scenarios completed. Exiting the program.");
                clearInterval(interval);
                // Remove event listeners to prevent further button presses after completion of metronome
                document.getElementById('captureButton').removeEventListener('click', capturePressTime);
                document.getElementById('startStopButton').removeEventListener('click', startStopMetronome);
                // Close screen/window after a fixed amount of time if needed in ELectron
            }
        }
    }

    function calculatePrecisionDifference() {
        const metronomeBpm = scenarios[scenarioIndex];
        const expectedInterval = 60000 / metronomeBpm;
        const averageDifference = differencesWithIntervals.reduce((sum, diff) => sum + diff, 0) / differencesWithIntervals.length;
        console.log("Expected Interval:", expectedInterval.toFixed(3), "milliseconds");
        console.log("Differences", differencesWithIntervals.join(", "));
        console.log("Average Difference:", averageDifference.toFixed(3), "milliseconds");
        //for showing expected and actual diffecrence 
        document.getElementById('expected-diff').innerHTML = `Expected Diff: ${expectedInterval.toFixed(3)} ms`;
        document.getElementById('average-diff').innerHTML = `Actual Diff: ${averageDifference.toFixed(3)} ms`;
    }

    document.getElementById('captureButton').addEventListener('click', capturePressTime);
    document.getElementById('startStopButton').addEventListener('click', startStopMetronome);
}
);