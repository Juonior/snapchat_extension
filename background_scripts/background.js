// Usage

let botRunning = false;
var last_responses = {};
var token = "";
var ignore_list = [];
var lastHI_time = 0;
chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === 'startbot') {
    botRunning = true; 
    ignore_list = [];
    startbot(message);
  } else if (message.action === 'stopbot') {
    botRunning = false;
  }
});


// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
async function Do(tab, func, arg){await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: func, args: arg });}
async function wait(ms) {await new Promise(resolve => setTimeout(resolve, ms));}
async function getURL(){return window.location.href}
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

async function CloseCurrentConservation() { var closebtn = document.querySelector("div.O4POs.qFDXZ"); if (closebtn){ closebtn.click()}}
function ClickConservationButton(link) {
  var conservationButtons = document.querySelectorAll('div[role="listitem"]');
  conservationButtons.forEach(conservationButton => {
      var href_item = conservationButton.querySelector('span.mYSR9.nonIntl');
      if (href_item && href_item.id) {
          var btn_link = "https://web.snapchat.com/" + href_item.id.split("title-")[1];
          if (btn_link === link) {
              var btn_click = conservationButton.querySelector('div[role="button"]');
              btn_click.click();
          }
      }
  });
}
function WriteMessageToChat(text){var textBox = document.querySelector('div[role="textbox"]');textBox.textContent = text;textBox.dispatchEvent(new Event('input', { bubbles: true }));}
function SendMessageToChat(){var btn_send = document.querySelector('button[class="IHV_t v4zfr"]');if (btn_send){btn_send.click();}}
async function sendSnap(){
  SnapInChat = document.querySelector('button[class="cDumY EQJi_ eKaL7 Bnaur"]')
  if (SnapInChat){
    SnapInChat.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    SnapDiv = document.querySelector('div[class="gIloE AEZEl"]')

    TakeSnap = document.querySelector('button[class="FBYjn gK0xL A7Cr_ m3ODJ"]')
    if (TakeSnap) {
      TakeSnap.click();
      await new Promise(resolve => setTimeout(resolve, 200));

      SendToButton = document.querySelector('button[class="YatIx fGS78 eKaL7 Bnaur"]')
      if (SendToButton){
        SendToButton.click()
        await new Promise(resolve => setTimeout(resolve, 200));
      } 
      FinalSendButton = document.querySelector('button[class="TYX6O eKaL7 Bnaur"]')
      if (FinalSendButton){
        FinalSendButton.click()
      }
    } else {
      BackGroundElement = document.querySelector('div[class="UriZL"]')
      BackGroundElement.style.display = "None";
      ShowAlert("У Вас отсуствует камера", "error")
    }
  } else {
    ShowAlert("Снап не отправлен: не обнаружена кнопка отправки снапа", "error")
  }
}


function clearCacheStorage() {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName).then(success => {
          if (success) {
            console.log(`Cache ${cacheName} deleted.`);
          } else {
            console.log(`Failed to delete cache ${cacheName}.`);
          }
        });
      });
    });
  }
}

async function ChangeCamTo(IMAGE_BASE64){
  localStorage.setItem('IMAGE_BASE64', IMAGE_BASE64)
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL("background_scripts/camera.js");
  s.onload = () => s.remove();
  (document.head || document.documentElement).append(s);
}

async function ScrollPage(){
  var dialog_div = document.querySelector('div[aria-label="Friends Feed"]')
  var scroll_position = dialog_div.scrollTop
  var scroll_height = dialog_div.scrollHeight
  var client_height = dialog_div.clientHeight
  if (scroll_position + client_height == scroll_height){
      dialog_div.scrollTop = 0;
  } else {
      dialog_div.scrollTop += 740;
  }
}


function should_respond(user_name, profile_string) {
  var profile = JSON.parse(profile_string);
  var last_response_time = last_responses[user_name] || 0;
  var current_time = Date.now() / 1000;
  return current_time - last_response_time > profile.minCooldown
}


function update_last_response(user_name) {
  last_responses[user_name] = Date.now() / 1000;
}





function getConservationToAnswer(profile_string, ignore_list, lastHI_time) {

  function getRandomMessage() {
    const messages = ["Heyy", "Hiii", "Hi", "Heyyyy", "Hey"];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  var listItems = document.querySelectorAll('div[role="listitem"]');
  var listItemsArray = Array.from(listItems);
  var resultArray = [];
  var profile = JSON.parse(profile_string);
  listItemsArray.forEach(item => {
    try {
      if (item){
        var buttonInListItem = item.querySelector('div[role="button"]');
        
        if (buttonInListItem) {
          var nickname_item = item.querySelector('span.mYSR9.nonIntl');
          var nickname = nickname_item.innerText
          var link = "https://web.snapchat.com/"+nickname_item.id.split("title-")[1]
          if (!nickname.includes("Team Snapchat") && !nickname.includes("My AI")) {
            if (!ignore_list.includes(nickname)) {
              var datetime_item = item.querySelector('time')
              if (datetime_item){
                var datetime = datetime_item.getAttribute('datetime');
                var chat_status = item.querySelector('span.GQKvA').innerText;
                var time_elapsed = (Date.now() / 1000) - Date.parse(datetime) / 1000;
                var HiTime_elapse =  (Date.now() / 1000) - lastHI_time
                console.log(nickname+" "+HiTime_elapse)
                if (time_elapsed > 7200 && chat_status.includes("Opened")){
                  resultArray.push({ "nickname": nickname, "action": "send", "message": "why did u leave me on seen?","link": link});
                }
                else if (HiTime_elapse > 120 && chat_status.includes("Say")) {
                  resultArray.push({ "nickname": nickname, "action": "send", "message": getRandomMessage(),"link": link});
                } else if ((chat_status.includes("Received") ||  chat_status.includes("New Chat")) && time_elapsed > Math.floor(Math.random() * (profile.maxCooldown  - profile.minCooldown  + 1)) + profile.minCooldown ){
                  resultArray.push({ "nickname": nickname, "action": "answer", "link": link});
                } 
              } else {
                var HiTime_elapse =  (Date.now() / 1000) - lastHI_time
                var chat_status = item.querySelector('span.GQKvA').innerText;
                if (HiTime_elapse > 120 && chat_status.includes("Say")) {
                  resultArray.push({ "nickname": nickname, "action": "send", "message": getRandomMessage(),"link": link});
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при обработке элемента:", error);
    }
  });
  return resultArray;
}


function getMessages(){
  var message_containers = document.querySelectorAll('li[class="T1yt2"]');
  var message_containers_array = Array.from(message_containers);
  var messages = [];

  message_containers_array.forEach(message_container => {
      var messagesElements = message_container.querySelectorAll('div.p8r1z span');
      var messagesString = Array.from(messagesElements).map(span => span.textContent).join(" ");
      var senderNameTag = message_container.querySelector('div.GUB_w span');

      if (senderNameTag) {
          var sender;
          if (senderNameTag.textContent === "Me") {sender = "assistant"} else {sender = "user"}
          var snapTag = message_container.querySelector('div.mZgqh');
          if (snapTag != null && sender === "assistant") {messagesString += "*BotPhoto*";}
          else if (snapTag != null && sender === "user") {messagesString += " User sent a photo NEVER GIVE A PHOTO ON THAT MESSAGE!!!!!!"}
          messages.push({ "role": sender, "content": messagesString });
      }
  });

  return messages;
}

async function getAnswer(message, messages, profile_string) {
  var profile = JSON.parse(profile_string);
  var atempt = 0;
  const data = {
    messages: messages,
    name: profile.name,
    modelInfo: profile.modelInfo,
    setting: profile.setting,
    sourceOfAdds: profile.sourceOfAdds,
    age: profile.age,
    city: profile.city,
    link: profile.link,
    platform: profile.platform,
    ctaInfo: profile.ctaInfo,
    token: profile.token,
  };
  while (botRunning && atempt <= 3) {
    atempt +=1
    try {
      const response = await fetch('https://deluvity.ru/getAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      if (responseData.success) {
        return responseData.message;
      } else {
        await Do(message.tab,ShowAlert, ['Запрос на получении сообщений не выполнен успешно: '+responseData.message+', повторяю попытку...', "error"])
        console.warn('Запрос не выполнен успешно: '+responseData.message+', повторяю попытку...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      await Do(message.tab,ShowAlert, ['Запрос на получении сообщений не отправлен: '+error, "error"])
      console.error('Запрос не выполнен: ', error);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}


async function getPhoto(message, profile_string, username) {
  var profile = JSON.parse(profile_string);
  const data = {
    token: profile.token,
    profile_id: profile.id,
    username: username,
  };
  
  try {
    const response = await fetch('https://deluvity.ru/getPhoto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const responseData = await response.json();
    
    if (responseData.success) {
      return responseData.message;
    } else {
      await Do(message.tab,ShowAlert, ['Запрос на получении фотографии не выполнен: '+responseData.message, "error"])
    }
  } catch (error) {
    await Do(message.tab,ShowAlert, ['Запрос на получении фотографии не отправлен: '+error, "error"])
    console.error('Произошла ошибка:', error);
    throw error;
  }
}
async function startbot(message) {
  while (botRunning){
    try {
      if (!botRunning) return;
      const ConservationToAnswer = (await chrome.scripting.executeScript({ target: { tabId: message.tab.id }, func: getConservationToAnswer, args: [message.profile, ignore_list, lastHI_time] }))[0].result;
      for (const conversation of ConservationToAnswer) {
        try{
          if (should_respond(conversation.nickname,message.profile)){
            if (!botRunning) return;
            const currentURL = (await chrome.scripting.executeScript({ target: { tabId: message.tab.id }, func: getURL, args: [] }))[0].result;
            if (currentURL != conversation.link){

              await Do(message.tab,ShowAlert, ["Открываю диалог c "+conversation.nickname, "notification", 1200])
              await Do(message.tab,ClickConservationButton, [conversation.link])
            }
            await wait(500);
            if (conversation.action == "send") {
                await Do(message.tab,WriteMessageToChat, [conversation.message])
                await wait(500);
                await Do(message.tab,SendMessageToChat, [])
                lastHI_time = Date.now() / 1000;
                update_last_response(conversation.nickname)
            } else if  (conversation.action == "answer") {
              var profile = JSON.parse(message.profile);

              var messages = (await chrome.scripting.executeScript({target: {tabId: message.tab.id},func: getMessages}))[0].result;
              var attempt = 0;
              while ((messages.length === 0) && (attempt < 3)) {
                attempt += 1;
                messages = (await chrome.scripting.executeScript({
                  target: {tabId: message.tab.id},
                  func: getMessages
                }))[0].result;
              }
              if (messages.length > 0) {
                var messagesFromStartToLastNine = messages.slice(0, -15);
                var checkIgnor = messagesFromStartToLastNine.some(message => message.content.includes(profile.link));
                if (messages.at(-1)["role"] === "user") {
                  if (!checkIgnor) {
                    var answers = await getAnswer(message, messages, message.profile)
                    const answerArray = answers.split("\n");
                    for (const answer of answerArray) {
                      if (answer.length > 0) {
                        if (answer == "!photo") {
                          var IMAGE_BASE64 = await getPhoto(message, message.profile, conversation.nickname)
                          await Do(message.tab, clearCacheStorage, []);
                          await Do(message.tab, ChangeCamTo, [IMAGE_BASE64]);

                          await wait(2000);
                          await Do(message.tab, sendSnap, []);
                          await wait(500);
                        } else {
                          await wait(500);

                          await Do(message.tab, WriteMessageToChat, [answer]);
                          await Do(message.tab, ShowAlert, ["Сообщение будет отправлено: " + (answer.length * 150) / 1000 + " секунд", "notification", 1200])
                          await wait(answer.length * 150);

                          await Do(message.tab, SendMessageToChat, []);
                        }
                      }
                    }
                    var AssitantCountMessages = messages.filter(message => message.role === "assistant").length;
                    if (AssitantCountMessages + 1 == profile.ctaMessageNum) {
                      const answerArray = profile.cta.split("\n");
                      for (const answer of answerArray) {
                        await wait(500);
                        await Do(message.tab, WriteMessageToChat, [answer]);
                        await wait(answer.length * 150);

                        await Do(message.tab, SendMessageToChat, []);
                      }
                    }
                  } else {
                    ignore_list.push(conversation.nickname);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Ошибка при обработке пользователя", error);
          break
        }
      }
      const currentURL = (await chrome.scripting.executeScript({ target: { tabId: message.tab.id }, func: getURL, args: [] }))[0].result;
      if (currentURL != "https://web.snapchat.com/"){
        await wait(500)
        await Do(message.tab,ShowAlert, ["Закрываю диалог", "notification", 1200])
        await Do(message.tab,CloseCurrentConservation, [])
      }
      await Do(message.tab,ScrollPage, []);

    } catch (error) {
      console.error("Ошибка при выполнении скрипта:", error);
    }
    await wait(500);
  }
}
