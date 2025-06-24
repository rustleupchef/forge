let id;
let files;
let currentFilePath;
let isRunning = false;
let currentFile;

window.onload = function() {
    const fileMenu = document.getElementById("fileMenu");
    const divMenu = document.getElementById("divMenu");
    const folderMenu = document.getElementById("folderMenu");


    document.getElementById("files").addEventListener("contextmenu", function(event) {
        event.preventDefault();
        disableMenus("")
        divMenu.style.display = "block";
        divMenu.style.left = event.pageX + "px";
        divMenu.style.top = event.pageY + "px";
        currentFile = null;
    });

    document.addEventListener('click', function(e) {
        if (!divMenu.contains(e.target)) {
            divMenu.style.display = 'none';
        }

        if (!folderMenu.contains(e.target)) {
            folderMenu.style.display = 'none';
        }

        if (!fileMenu.contains(e.target)) {
            fileMenu.style.display = 'none';
        }

        currentFile = null;
    });
    loadFiles();
};

function disableMenus(type) {
    const fileMenu = document.getElementById("fileMenu");
    const divMenu = document.getElementById("divMenu");
    const folderMenu = document.getElementById("folderMenu");

    if (type === "file") {
        divMenu.style.display = 'none';
        folderMenu.style.display = 'none';
    }

    if (type === "folder") {
        divMenu.style.display = 'none';
        fileMenu.style.display = 'none';
    }

    if (type === "") {
        fileMenu.style.display = 'none';
        folderMenu.style.display = 'none';
    }

    if (type === "all") {
        fileMenu.style.display = 'none';
        folderMenu.style.display = 'none';
        divMenu.style.display = 'none';
    }
}

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
    save(false);
}

function updateText() {
    const code = document.getElementById("code").value;
    for (let i = 0; i < files.length; i++) {
        if (files[i].path === currentFilePath) {
            files[i].content = code;
            break;
        }
    }
}

function save(type) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save?" + id, type);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(files));
}

function loadFiles () {
    const fileList = document.getElementById("files");
    fileList.replaceChildren();
    const sections = window.location.href.split("/");
    const url = "/" + sections[sections.length - 1];
    id = url.split("?")[1];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            files = JSON.parse(xhr.responseText);
            files.forEach(file => {
                const button = document.createElement("button");
                button.style.paddingLeft = (layer(file.path) * 20) + "px";
                button.innerText = (file.type === "directory" 
                    ? ">  " 
                    : `(${file.type})  `) + file.name;
                button.className = "file-item";
                if (file.type !== "directory") {
                    button.onclick = function() {
                        loadFileContent(file.path);
                    };
                }
                if (file.type === "directory") {
                    button.addEventListener("contextmenu", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        disableMenus("folder");
                        const folderMenu = document.getElementById("folderMenu");
                        folderMenu.style.display = "block";
                        folderMenu.style.left = event.pageX + "px";
                        folderMenu.style.top = event.pageY + "px";
                        currentFile = file;
                    });
                } else {
                    button.addEventListener("contextmenu", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        disableMenus("file");
                        const fileMenu = document.getElementById("fileMenu");
                        fileMenu.style.display = "block";
                        fileMenu.style.left = event.pageX + "px";
                        fileMenu.style.top = event.pageY + "px";
                        currentFile = file;
                    });
                }
                fileList.appendChild(button);
            });
        } else {
            alert("Error loading content: " + xhr.statusText);
            setTimeout(returnHome, 3000);
        }
    };
    xhr.send();
}

function addFile(type) {
    const path = encodeURIComponent(currentFile ? currentFile.path : `projects/${id.split("=")[1]}/`);
    const fileName = encodeURIComponent(prompt("Enter the name of the new file:", "file name"));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/add-file?path=${path}&fileName=${fileName}&type=${type}`);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            loadFiles();
        } else {
            alert("Error creating file: " + xhr.statusText);
        }
    };
    xhr.send();
    disableMenus("all");
}

function deleteFile() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/delete-file");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            loadFiles();
        } else {
            alert("Error deleting file: " + xhr.statusText);
        }
    };
    xhr.send(JSON.stringify(currentFile));
    disableMenus("all");
}

function rename() {
    const path = encodeURIComponent(currentFile ? currentFile.path : `projects/${id.split("=")[1]}/`);
    const fileName = encodeURIComponent(prompt("Enter the name of the new file:", "new name"));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/rename-file?path=${path}&fileName=${fileName}`);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            loadFiles();
        } else {
            alert("Error creating file: " + xhr.statusText);
        }
    };
    xhr.send();
    disableMenus("all");
}

function layer(path) {
    return path.split("/").length - 3;
}