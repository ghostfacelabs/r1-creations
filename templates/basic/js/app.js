// R1 Creation - {{TITLE}}
// Hardware event listeners

document.addEventListener('DOMContentLoaded', function() {
    console.log('Creation loaded');
    init();
});

function init() {
    // Initialize creation
}

// Scroll wheel events
window.addEventListener('scrollUp', () => {
    console.log('Scroll up');
    onScrollUp();
});

window.addEventListener('scrollDown', () => {
    console.log('Scroll down');
    onScrollDown();
});

// Side button (PTT) events
window.addEventListener('sideClick', () => {
    console.log('Side click');
    onSideClick();
});

// Override these in your creation
function onScrollUp() {}
function onScrollDown() {}
function onSideClick() {}
