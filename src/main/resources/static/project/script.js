let id;
let files;
let currentFilePath;

window.onload = loadFiles;

window.onbeforeunload = function() {
    save(false);
}

function returnHome() {
    window.location.href = "/home";
}

function loadFileContent(filePath) {
    save(true);
    currentFilePath = filePath;
    document.getElementById("code").innerText = "Loading...";
    files.forEach(file => {
        if (file.path === filePath) {
            document.getElementById("code").readOnly = false;
            document.getElementById("code").value = file.content;     
        }
    });
}

function run() {

}

function updateText() {
    const code = document.getElementById("code").value;
    for (let i = 0; i < files.length; i++) {
        if (files[i].path === currentFilePath) {
            files[i].content = code;
            break;
        }
    }
    console.log(files)
}

function save(type) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save?" + id, type);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(files));
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
                if (file.type === "directory") {
                    const folder = document.getElementById("div");
                    folder.innerText = file.name;
                    fileList.appendChild(folder);
                }
                const button = document.createElement("button");
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