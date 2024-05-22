
navigator.mediaDevices.enumerateDevices = async function() {
    const fakeCamera = {
        deviceId: 'deluvity_cam',
        kind: 'videoinput',
        label: 'Deluvity Camera',
        groupId: 'deluvity_group_id'
    };
    return [fakeCamera];
};

navigator.mediaDevices.getUserMedia = async function(constraints) {
    if (constraints.video) {
        const stream = await createImageStream();
        return stream;
    } else {
        return originalGetUserMedia(constraints);
    }
};

async function createImageStream() {
    const imgElement = document.createElement('img');
    imgElement.crossOrigin = "anonymous";
    imgElement.src = localStorage.getItem('IMAGE_BASE64');
    await new Promise(resolve => {
        imgElement.onload = resolve;
    });
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const context = canvas.getContext('2d');
    context.drawImage(imgElement, 0, 0);
    const stream = canvas.captureStream();
    return stream;
}
