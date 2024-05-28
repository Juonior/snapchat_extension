function unblockControlKeyEvents() {
    const events = ["keydown", "keyup", "keypress"];
    const modifyKeys = ["Control", "Meta", "Alt", "Shift"];
    for (const event_type of events) {
        document.addEventListener(
            event_type,
            function (e) {
                if (modifyKeys.includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`'${event_type}' event for '${e.key}' received and prevented:`, e);
                    e.stopImmediatePropagation();
                }
            },
            true
        );
    }
}

function unblockEvent() {
    for (const event_type of arguments) {
        document.addEventListener(
            event_type,
            function (e) {
                e.stopPropagation();
                console.log(`'${event_type}' event received and prevented:`, e);
            },
            true
        );
    }
}

function fixConsole() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const nativeConsole = iframe.contentWindow.console;
    window.console = nativeConsole;
}

function setupUnblocker() {
    fixConsole();
    unblockControlKeyEvents();

    // Allow right-click without losing focus
    unblockEvent("contextmenu");
}
setupUnblocker();
// Run a few extra times to ensure event listeners take priority.
setTimeout(setupUnblocker, 1000);
setTimeout(setupUnblocker, 5000);
setTimeout(setupUnblocker, 10000);

// Ensure focus is always true.
document.hasFocus = function() { return true; }