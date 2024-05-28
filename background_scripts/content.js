var s = document.createElement('script');
s.src = chrome.runtime.getURL("background_scripts/notifications.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

var s = document.createElement('script');
s.src = chrome.runtime.getURL("background_scripts/unbreaker.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);