window.onload = function () {
    const sections = window.location.href.split("/");
    const url = "/" + sections[sections.length - 1];
    const xhr = new XMLHttpRequest();
    console.log("Loading content from: " + url);
    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const files = JSON.parse(xhr.responseText);
            const fileList = document.getElementById("files");
            console.log(files);
        } else {
            alert("Error loading content: " + xhr.statusText);
            setTimeout(returnHome, 3000);
        }
    };
    xhr.send()
}

function returnHome() {
    window.location.href = "/home";
}