var ExtensionVersion = "1.0.3";
var token = localStorage.getItem('token');
var lastCheckTimestampKey = 'lastVersionCheckTimestamp';
var lastVersionKey = 'lastVersion';

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    if (tab.url.includes("snapchat.com")) {
      handleSnapchatPage();
    } else {
      displayExtensionUnavailableMessage("EXTENSION NOT AVAILABLE");
    }
  });
});

function handleSnapchatPage() {
  var lastCheckTimestamp = localStorage.getItem(lastCheckTimestampKey);
  var currentTime = new Date().getTime();

  if (!lastCheckTimestamp || (currentTime - lastCheckTimestamp) > 300000) { // 5 minutes = 300000 milliseconds
    getLastVersion().then(data => {
      if (data) {
        validateExtension(data.message);
        localStorage.setItem(lastCheckTimestampKey, currentTime); 
        localStorage.setItem(lastVersionKey, data.message);
      }
    });
  } else {
    var lastVersion = localStorage.getItem(lastVersionKey);
    validateExtension(lastVersion);
  }
}

function validateExtension(latestVersion) {
  var lastCheckTimestamp = localStorage.getItem(lastCheckTimestampKey);
  var currentTime = new Date().getTime();

  if (ExtensionVersion !== latestVersion) {
    displayExtensionUnavailableMessage("DOWNLOAD NEW VERSION");
    return;
  }

  var isRecentCheck = (currentTime - lastCheckTimestamp) <= 300000; // 5 минут

  if (isRecentCheck) {
    handleToken();
  } else {
    validateToken();
  }
}

function handleToken() {
  if (token && token.length > 0) {
    window.location.href = "account.html";
  } else {
    createAuth();
  }
}
function validateToken() {
  if (token && token.length > 0) {
    const data = { token: token };
    fetch('https://deluvity.ru/checkValidToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = "account.html";
      } else {
        localStorage.removeItem('token');
        createAuth();
      }
    })
    .catch(error => {
      console.error('Произошла проблема с выполнением запроса:', error);
    });
  } else {
    createAuth();
  }
}

function getLastVersion() {
  return fetch('https://deluvity.ru/lastVersion', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Произошла проблема с получением последней версии:', error);
  });
}

function createAuth(){
  var loginButton = document.getElementById("loginButton");

  loginButton.addEventListener("click", function() {
    var token = document.getElementById("inputToken").value
    const data = {
      token: document.getElementById("inputToken").value
    };
    
    fetch('https://deluvity.ru/checkValidToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success){
          localStorage.setItem('token', token)
          window.location.href = "account.html";
        }
      })
      .catch(error => {
        console.error('Произошла проблема с выполнением запроса:', error);
      });
  });
}
function displayExtensionUnavailableMessage(message) {
  var messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.classList.add('message');
  document.body.appendChild(messageDiv);

  var container = document.querySelector("div.auth");
  container.style.display = "none";
}
