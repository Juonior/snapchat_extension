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
// ShowAlert("Alloo")
document.addEventListener('DOMContentLoaded', function() {
    const defaultValues = {
        name: '',
        modelInfo: "goes to college, likes to play volleyball and travels around the world",
        setting: "going through a break-up with her boyfriend",
        sourceOfAdds: "Bumble/Tinder/Badoo/Tiktok/Instagram",
        age: '',
        city: '',
        link: '',
        platform: "Onlyfans/Fansly",
        cta: "Btw I wanna be honest ab smth and im really shyyyy\nBut recently I started an Onlyfans to try and support myself and I'm a big freak asw and it would mean a lot if u checked it out babe\n(Insert your link)\nlmk if you followed me so I could send u a surprise 🤭",
        ctaInfo: "4$",
        ctaMessageNum: '25',
        minCooldown: '60',
        maxCooldown: '300'
    };

    const textareas = document.querySelectorAll('textarea');
    const fileInput = document.getElementById('snaps-photos');
    const photosCount = document.querySelector('.photos-count');

    textareas.forEach(textarea => {
        textarea.addEventListener('input', event => {
            const counter = event.target.nextElementSibling.nextElementSibling;
            counter.textContent = `${event.target.value.length}/300 characters`;
        });
    });

    fileInput.addEventListener('change', event => {
        const files = event.target.files;
        if (files.length > 0) {
            photosCount.textContent = "Selected "+files.length+" photos"
        } else {
            photosCount.textContent = "Snaps/Photos" 
        }
    });

    const inputIds = [
        'name', 'modelInfo', 'setting', 'sourceOfAdds', 'age', 'city', 'link', 
        'platform', 'cta', 'ctaInfo', 'ctaMessageNum', 'minCooldown', 'maxCooldown'
    ];

    // Функция для загрузки значений из LocalStorage или стандартных значений
    function loadValues() {
        inputIds.forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = localStorage.getItem(key) || defaultValues[key] || '';
            }
        });
    }

    // Функция для сохранения значений в LocalStorage
    function saveValue(key, value) {
        localStorage.setItem(key, value);
    }

    // Установка обработчиков событий для сохранения значений
    document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
        input.addEventListener('input', (event) => {
            saveValue(event.target.id, event.target.value);
        });
    });

    // Загрузка значений при загрузке страницы
    loadValues();

    document.getElementById('returntodefault').addEventListener('click', function() {
        inputIds.forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = defaultValues[key] || '';
                saveValue(key, input.value);  // Сохраняем стандартное значение в LocalStorage
            }
        });
    });
});

async function imagesToBase64() {
    const fileInput = document.getElementById('snaps-photos');
    const files = fileInput.files;
    const base64Images = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // Создаем Promise для каждого файла
        const promise = new Promise((resolve, reject) => {
            reader.onload = function(event) {
                const base64String = event.target.result;
                base64Images.push(base64String);
                resolve(); // Резолвим Promise после чтения файла
            };

            reader.onerror = reject; // В случае ошибки реджектим Promise
        });

        reader.readAsDataURL(file);
        
        // Ждем, пока Promise завершится, прежде чем перейти к следующему файлу
        await promise.catch(error => console.error('Ошибка чтения файла:', error));
    }

    return base64Images;
}


document.getElementById("back").addEventListener("click", async function() {
    window.location.href = "account.html";
});  


document.getElementById("create").addEventListener("click", async function() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    const inputs = ['name', 'modelInfo', 'setting', 'sourceOfAdds', 'age', 'city', 'link', 'platform', 'cta', 'ctaInfo', 'ctaMessageNum', 'minCooldown', 'maxCooldown'];
    const data = {};

    for (const id of inputs) {
        const element = document.getElementById(id);
        if (element && element.value.length === 0) {
            chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ShowAlert, args: ["Заполните все поля для создания профиля", "error", 1500] });
            return;
        }
        data[id] = element.value;
    }
    const photos = await imagesToBase64();
    if (photos.length == 0) {
        chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ShowAlert, args: ["Профиль не создан: загрузите хотя бы 1 фотографию", "error", 1500] });
        return;
    }
    data.photos = photos;
    data.token = localStorage.getItem('token');

    fetch('https://deluvity.ru/createProfile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        inputs.forEach(id => localStorage.removeItem(id)); 
        chrome.scripting.executeScript({ target: { tabId: tab.id }, func: ShowAlert, args: ["Профиль "+name+" успешно создан", "notification", 2000] })
        window.location.href = "account.html";
    })
    .catch(error => {
        console.error('Произошла проблема с выполнением запроса:', error);
    });
})