var token = localStorage.getItem('token')

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}

const data = {
  token: token
};
fetch('https://deluvity.ru/getBalance', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => {
    if (data.success){
        var balance = document.getElementById("balance")
        balance.innerHTML = "Your balance: "+data.message+"$"
    }
  })
  .catch(error => {
    console.error('Произошла проблема с выполнением запроса:', error);
  });
var modellist_btn = document.getElementById("modelList")
modellist_btn.addEventListener("click", function() {
    window.location.href = "chooseprofile.html";
})
var createprofile_btn = document.getElementById("createProfile")
createprofile_btn.addEventListener("click", function() {
    window.location.href = "createprofile.html";
})

document.getElementById("back").addEventListener("click", function() {
  window.location.href = "authorization.html";
  localStorage.removeItem('token');
  localStorage.removeItem('isRunning')
  sendMessageToBackground({ action: 'stopbot' });
});


