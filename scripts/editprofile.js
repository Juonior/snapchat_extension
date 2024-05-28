function ShowAlert(message, type = 'notification', autoCloseTime) {

    function closeAlert(alert, alertContainer) {
      alert.style.transform = 'translateX(-100%)';
      alert.style.opacity = '0';
      setTimeout(() => {
          alertContainer.removeChild(alert);
      }, 500);
    }
  
    // Создаем контейнер для уведомлений, если его еще нет
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        document.body.appendChild(alertContainer);
    }
  
    // Создаем элемент уведомления
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
  
    const alertMessage = document.createElement('span');
    alertMessage.innerText = message;
  
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        closeAlert(alert, alertContainer);
    };
  
    alert.appendChild(alertMessage);
    alert.appendChild(closeBtn);
    alertContainer.appendChild(alert);
  
    // Запускаем анимацию появления
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
  
    // Инициализируем автоматическое закрытие, если задано время
    if (autoCloseTime !== undefined) {
        setTimeout(() => {
            closeAlert(alert, alertContainer);
        }, autoCloseTime);
    }
  }

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedProfile = urlParams.get('profile');
    if (encodedProfile) {
        const profile = JSON.parse(decodeURIComponent(encodedProfile));
        populateForm(profile);
    }
});

function populateForm(profile) {
    document.getElementById('profileID').value = profile.id || '';
    document.getElementById('name').value = profile.name || '';
    document.getElementById('age').value = profile.age || '';
    document.getElementById('modelInfo').value = profile.modelInfo || '';
    document.getElementById('cta').value = profile.cta || '';
    document.getElementById('ctaInfo').value = profile.ctaInfo || '';
    document.getElementById('ctaMessageNum').value = profile.ctaMessageNum || '';
    document.getElementById('setting').value = profile.setting || '';
    document.getElementById('city').value = profile.city || '';
    document.getElementById('sourceOfAdds').value = profile.sourceOfAdds || '';
    document.getElementById('platform').value = profile.platform || '';
    document.getElementById('link').value = profile.link || '';
    document.getElementById('minCooldown').value = profile.minCooldown || '';
    document.getElementById('maxCooldown').value = profile.maxCooldown || '';
}


document.getElementById("back").addEventListener("click", async function() {
    window.location.href = "chooseprofile.html";
});  


document.getElementById("save").addEventListener("click", async function() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    const inputs = ['name', 'modelInfo', 'setting', 'sourceOfAdds', 'age', 'city', 'link', 'platform', 'cta', 'ctaInfo', 'ctaMessageNum', 'minCooldown', 'maxCooldown'];
    const data = {};
    
    for (const id of inputs) {
        const element = document.getElementById(id);
        if (element && element.value.length === 0) {
            chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ShowAlert, args: ["Заполните все поля для изменения профиля", "error", 1500] });
            return;
        }
        data[id] = element.value;
        console.log(data[id]+" "+element.value)
    }
    data.id = document.getElementById('profileID').value 
    data.token = localStorage.getItem('token');

    fetch('https://deluvity.ru/updateProfile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        inputs.forEach(id => localStorage.removeItem(id)); 
        chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ShowAlert, args: ["Профиль "+name+" успешно обновлен", "notification", 2000] })
        window.location.href = "chooseprofile.html";
    })
    .catch(error => {
        console.error('Произошла проблема с выполнением запроса:', error);
    });
})