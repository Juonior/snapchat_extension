function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message);
}


// Проверяем, существуют ли данные в localStorage и устанавливаем цвет кнопки соответственно
function checkLocalStorage() {
  const isRunning = localStorage.getItem('isRunning');
  if (isRunning && isRunning === "true") {
      const profile = localStorage.getItem('profile');
      if (profile) {
          const parsedProfile = JSON.parse(profile);
          const buttons = document.querySelectorAll('.profiles button');
          buttons.forEach(button => {
              if (String(button.id) === String(parsedProfile.id)) {
                  button.style.backgroundColor = 'green';
              }
          });
      }
  }
}

// Устанавливаем обработчики событий для кнопок
async function setupButtonEvents() {
  const buttons = document.querySelectorAll('.profiles button');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const isRunning = localStorage.getItem('isRunning');
      const parsedProfile = button.profile;

      // Остановить текущий профиль, если он запущен
      if (isRunning && isRunning === "true") {
        localStorage.setItem('isRunning', 'false');
        sendMessageToBackground({ action: 'stopbot' });
        buttons.forEach(btn => {
          btn.style.backgroundColor = '';
          btn.id = parsedProfile.id
        });
      }

      // Запустить новый профиль
      if (isRunning && isRunning === "false" || !isRunning) {
        localStorage.setItem('isRunning', 'true');
        localStorage.setItem('profile', JSON.stringify(parsedProfile));
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        sendMessageToBackground({ action: 'startbot', tab: tab, profile: localStorage.getItem('profile') });
        button.style.backgroundColor = 'green';
      }
    });
  });
}

async function listProfiles() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error('Отсутствует токен в localStorage');
      return;
  }

  const data = {
      token: token
  };

  try {
      const response = await fetch('https://deluvity.ru/getAllProfiles', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      const responseData = await response.json();
      if (responseData.success) {
          const profilesDiv = document.querySelector('.profiles');
          responseData.message.forEach(profile => {
              const button = document.createElement('button');
              button.textContent = profile.name;
              button.profile = profile
              button.id = profile.id
              profilesDiv.appendChild(button);
          });
          checkLocalStorage();
          await setupButtonEvents();
      } else {
          console.error('Ошибка при получении профилей:', responseData.error);
      }
  } catch (error) {
      console.error('Произошла проблема с выполнением запроса:', error);
  }
}

listProfiles();



document.getElementById("back").addEventListener("click", function() {
  window.location.href = "account.html";
});

