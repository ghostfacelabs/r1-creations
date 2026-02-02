// R1 Creation - Dancing Ghostface
// Hardware event listeners

let scale = 1;
let danceSpeed = 'normal'; // 'slow', 'normal', 'fast'
let partyMode = false;

const minScale = 0.5;
const maxScale = 3;
const speeds = ['slow', 'normal', 'fast'];
let speedIndex = 1; // Start at normal

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dancing Ghostface loaded');
    init();
});

function init() {
    // Initialize creation
    const container = document.querySelector('.avatar-container');
    const avatar = document.querySelector('.pixel-avatar');
    
    // Add some disco sparkles
    createDiscoEffect();
    
    // Random color changes
    setInterval(() => {
        if (!partyMode) {
            const hue = Math.random() * 60 + 200; // Blue to purple range
            avatar.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 20}, 70%, 50%))`;
        }
    }, 3000);
}

function createDiscoEffect() {
    const main = document.querySelector('main');
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '2px';
        sparkle.style.height = '2px';
        sparkle.style.background = '#fff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = Math.random() * 220 + 'px';
        sparkle.style.top = Math.random() * 200 + 'px';
        sparkle.style.opacity = '0';
        sparkle.style.animation = `sparkle ${Math.random() * 2 + 1}s ease-in-out infinite`;
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        main.appendChild(sparkle);
    }
    
    // Add sparkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 0.8; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

function updateScale() {
    const container = document.querySelector('.avatar-container');
    container.style.transform = `scale(${scale})`;
}

function updateSpeed() {
    const body = document.body;
    // Remove all speed classes
    body.classList.remove('speed-slow', 'speed-fast');
    
    // Add current speed class
    if (danceSpeed !== 'normal') {
        body.classList.add(`speed-${danceSpeed}`);
    }
    
    console.log(`Dance speed: ${danceSpeed}`);
}

function togglePartyMode() {
    partyMode = !partyMode;
    const avatar = document.querySelector('.pixel-avatar');
    const body = document.body;
    
    if (partyMode) {
        avatar.classList.add('party-mode');
        
        // Strobe effect
        let strobeCount = 0;
        const strobeInterval = setInterval(() => {
            body.style.background = strobeCount % 2 ? '#ff00ff' : '#00ffff';
            strobeCount++;
            if (strobeCount > 10 || !partyMode) {
                clearInterval(strobeInterval);
                body.style.background = '#0a0a0a';
            }
        }, 150);
        
        console.log('🎉 PARTY MODE ACTIVATED!');
    } else {
        avatar.classList.remove('party-mode');
        body.style.background = '#0a0a0a';
        console.log('Party mode off');
    }
}

// Scroll wheel events - Control zoom
window.addEventListener('scrollUp', () => {
    console.log('Scroll up - Zoom in');
    scale = Math.min(maxScale, scale + 0.2);
    updateScale();
});

window.addEventListener('scrollDown', () => {
    console.log('Scroll down - Zoom out');
    scale = Math.max(minScale, scale - 0.2);
    updateScale();
});

// Side button (PTT) events - Control dance speed
window.addEventListener('sideClick', () => {
    console.log('Side click - Change dance speed');
    
    // Cycle through speeds
    speedIndex = (speedIndex + 1) % speeds.length;
    danceSpeed = speeds[speedIndex];
    updateSpeed();
    
    // Easter egg: triple fast click activates party mode
    if (danceSpeed === 'fast') {
        setTimeout(() => {
            if (danceSpeed === 'fast') {
                togglePartyMode();
            }
        }, 100);
    }
});

// Override R1 template functions
function onScrollUp() {
    // Handled by scrollUp event
}

function onScrollDown() {
    // Handled by scrollDown event
}

function onSideClick() {
    // Handled by sideClick event
}