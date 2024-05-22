function injectScript (src) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL("injected-script.js");
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}