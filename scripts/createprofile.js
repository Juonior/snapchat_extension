document.addEventListener('DOMContentLoaded', function() {
    var modelInfo = document.getElementById("modelInfo");
    var cta = document.getElementById("cta");
    var ctaInfo = document.getElementById("ctaInfo");
    modelInfo.value = "goes to college, likes to play volleyball and travels around the world"
    cta.value = "Btw I wanna be honest ab smth and im really shyyyy\nBut recently I started an Onlyfans to try and support myself and I'm a big freak asw and it would mean a lot if u checked it out babe\nonlyfans.com\nlmk if you followed me so I could send u a surprise 🤭"
    ctaInfo.value = "4$"

    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input[type="text"]');
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


document.getElementById("back").addEventListener("click", function() {
    window.location.href = "account.html";
});  
document.getElementById("create").addEventListener("click", async function() {
    var name = document.getElementById("name").value;
    var modelInfo = document.getElementById("modelInfo").value;
    var setting = document.getElementById("setting").value;
    var sourceOfAdds = document.getElementById("sourceOfAdds").value;
    var age = document.getElementById("age").value;
    var city = document.getElementById("city").value;
    var link = document.getElementById("link").value;
    var platform = document.getElementById("platform").value;
    var cta = document.getElementById("cta").value;
    var ctaInfo = document.getElementById("ctaInfo").value;
    var ctaMessageNum = document.getElementById("ctaMessageNum").value;
    var minCooldown = document.getElementById("minCooldown").value;
    var maxCooldown = document.getElementById("maxCooldown").value;
    var photos = await imagesToBase64()
    var token = localStorage.getItem('token')
    
    if (name.length === 0 || modelInfo.length === 0 || setting.length === 0 || sourceOfAdds.length === 0 || age.length === 0 || city.length === 0 || link.length === 0 || cta.length === 0 || ctaInfo.length === 0 || ctaMessageNum.length === 0 || minCooldown.length === 0 || maxCooldown.length === 0) {
        alert("Заполните все поля")
        return; 
    }
    if (photos.length == 0){
        alert("Загрузите хотя бы 1 фотографию")
        return;
    }
    const data = {
        name: name,
        modelInfo: modelInfo,
        setting: setting,
        sourceOfAdds: sourceOfAdds,
        age: age,
        city: city,
        link: link,
        platform: platform,
        cta: cta,
        ctaInfo: ctaInfo,
        ctaMessageNum: ctaMessageNum,
        minCooldown: minCooldown,
        maxCooldown: maxCooldown,
        photos: photos,
        token: token
    };
    fetch('https://deluvity.ru/createProfile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
    })
    .catch(error => {
        console.error('Произошла проблема с выполнением запроса:', error);
    });
})