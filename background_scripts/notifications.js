// Функция для создания уведомления
function ShowAlert(message, type = 'notification', autoCloseTime) {
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

// Функция для закрытия уведомления
function closeAlert(alert, alertContainer) {
  alert.style.transform = 'translateX(-100%)';
  alert.style.opacity = '0';
  setTimeout(() => {
      alertContainer.removeChild(alert);
  }, 500);
}
window.ShowAlert = ShowAlert

// ShowAlert("Hellooo")