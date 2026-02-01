// Timer Creation
let seconds = 60;
let isRunning = false;
let intervalId = null;

document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});

function updateDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('display').textContent =
        mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

function updateStatus(text, running) {
    const status = document.getElementById('status');
    status.textContent = text;
    status.className = running ? 'running' : '';
}

function startTimer() {
    if (seconds <= 0) return;
    isRunning = true;
    updateStatus('Running', true);
    intervalId = setInterval(function() {
        seconds--;
        updateDisplay();
        if (seconds <= 0) {
            stopTimer();
            updateStatus('Done!', false);
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    updateStatus('Paused', false);
}

// Hardware controls
window.addEventListener('scrollUp', function() {
    if (!isRunning) {
        seconds = Math.min(seconds + 10, 5999); // Max 99:59
        updateDisplay();
    }
});

window.addEventListener('scrollDown', function() {
    if (!isRunning) {
        seconds = Math.max(seconds - 10, 0);
        updateDisplay();
    }
});

window.addEventListener('sideClick', function() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});
