let id;
let files;
let currentFilePath;

window.onload = loadFiles;

function returnHome() {
    window.location.href = "/home";
}

function loadFileContent(filePath) {
    currentFilePath = filePath;
    document.getElementById("code").innerText = "Loading...";
    files.forEach(file => {
        if (file.path === filePath) {
            document.getElementById("fileName").readOnly = false;
            document.getElementById("code").innerText = file.content;     
        }
    });
}

function run() {

}

function updateText() {

}

function save() {

}

function loadFiles () {
    const sections = window.location.href.split("/");
    const url = "/" + sections[sections.length - 1];
    id = url.split("?")[1];
    const xhr = new XMLHttpRequest();
    console.log("Loading content from: " + url);
    xhr.open("POST", url, true);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            files = JSON.parse(xhr.responseText);
            const fileList = document.getElementById("files");
            files.forEach(file => {
                const button = document.createElement(file.type === "directory" ? "button" : "div");
                button.innerText = file.name;
                button.onclick = function() {
                    loadFileContent(file.path);
                };
                fileList.appendChild(button);
            });
        } else {
            alert("Error loading content: " + xhr.statusText);
            setTimeout(returnHome, 3000);
        }
    };
    xhr.send();
}