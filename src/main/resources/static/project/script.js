let id;
let files;
let isOwner = false
let currentFilePath;
let isRunning = false;
let isPinging = false;
let currentFile;

window.onload = function() {

    const sections = window.location.href.split("/");
    const url = "/" + sections[sections.length - 1];
    id = url.split("?")[1];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/check-ownership?" + id);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            isOwner = (xhr.responseText == "true");
            if (isOwner) {
                setupEditor();
            } else {
                document.getElementById("code").readOnly = true;
                document.getElementById("save").style.display = "none";
            }
        }
    }
    xhr.send();

    loadFiles();
    setInterval(ping, 200);
};

function setupEditor() {
    const fileMenu = document.getElementById("fileMenu");
    const divMenu = document.getElementById("divMenu");
    const folderMenu = document.getElementById("folderMenu");
    const settingsMenu = document.getElementById("settingsMenu");


    document.getElementById("files").addEventListener("contextmenu", function(event) {
        event.preventDefault();
        disableMenus("")
        divMenu.style.display = "block";
        divMenu.style.left = event.pageX + "px";
        divMenu.style.top = event.pageY + "px";
        currentFile = null;
    });

    document.getElementById("top-bar").addEventListener("contextmenu", function(event) {
        event.preventDefault();
        disableMenus("settings");
        const settingsMenu = document.getElementById("settingsMenu");
        settingsMenu.style.display = "block";
        settingsMenu.style.left = event.pageX + "px";
        settingsMenu.style.top = event.pageY + "px";
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

        if (!settingsMenu.contains(e.target)) {
            settingsMenu.style.display = 'none';
        }

        currentFile = null;
    });
}

function disableMenus(type) {
    const fileMenu = document.getElementById("fileMenu");
    const divMenu = document.getElementById("divMenu");
    const folderMenu = document.getElementById("folderMenu");
    const settingsMenu = document.getElementById("settingsMenu");

    if (type === "file") {
        divMenu.style.display = 'none';
        folderMenu.style.display = 'none';
        settingsMenu.style.display = 'none';
    }

    if (type === "folder") {
        divMenu.style.display = 'none';
        fileMenu.style.display = 'none';
        settingsMenu.style.display = 'none';
    }

    if (type === "settings") {
        divMenu.style.display = 'none';
        fileMenu.style.display = 'none';
        folderMenu.style.display = 'none';
    }

    if (type === "") {
        fileMenu.style.display = 'none';
        folderMenu.style.display = 'none';
        settingsMenu
    }

    if (type === "all") {
        const menus = document.querySelectorAll(".context-menu");
        menus.forEach(menu => {
            menu.style.display = 'none';
        });
    }
}

window.onbeforeunload = function() {
    kill();
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
            document.getElementById("code").readOnly = !isOwner;
            document.getElementById("code").value = file.content;     
        }
    });
}

function closeFolder(file) {
    inititalValue = file.hidden;    
    const path = file.path;
    for (let i = 0; i < files.length; i++) {
        if (files[i].path.startsWith(path) && files[i].path !== path) {
            files[i].hidden = !file.hidden;
        }
    }
    if (inititalValue) file.hidden = false;
    const fileList = document.getElementById("files");
    fileList.replaceChildren();
    displayFiles(files);
    if (!inititalValue) file.hidden = true;
}

function kill() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/stop?" + id);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            isRunning = false;
            document.getElementById("run").innerText = "Run";
            document.getElementById("run").className = "";
            save(false);
        } else {
            alert("Error stopping the process: " + xhr.statusText);
        }
    }
    xhr.send();
    destroyConsoleInputs();
}

function destroyConsoleInputs() {
    const consoleInputs = document.querySelectorAll(".console-input");
    consoleInputs.forEach(input => {
        input.remove();
    });
}

function addConsoleInput() {
    const consoleInput = document.createElement("input");
    consoleInput.type = "text";
    consoleInput.placeholder = "Enter command";
    consoleInput.className = "console-input";
    consoleInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const command = consoleInput.value;
            document.getElementById("console").innerText += command + "\n";
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/console-command?command=" + encodeURIComponent(command));
            xhr.send();
        }
    });
    document.getElementById("console").appendChild(consoleInput);
}

function run() {
    if (isRunning) {
        kill();
        return;
    }
    document.getElementById("console").innerText = "";
    save(false);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/run?" + id);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            isRunning = true;
            document.getElementById("run").innerText = "Stop";
            document.getElementById("run").className = "running-button";
            addConsoleInput();
        }
    }
    xhr.send();
}

function ping() {
    if (!isRunning) return;
    if (isPinging) return;
    isPinging = true;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/ping");
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const response = JSON.parse(xhr.responseText);
            if (response.type === "running") {
                document.getElementById("console").innerText += response.message;
                addConsoleInput();
            }

            if (response.type === "stopped") {
                alert(response.message);
                isRunning = false;
                document.getElementById("run").innerText = "Run";
                document.getElementById("run").className = "";
                save(false);
                destroyConsoleInputs();
            }

            if (response.type === "error") {
                isRunning = false;
                document.getElementById("run").innerText = "Run";
                document.getElementById("run").className = "";
                document.getElementById("console").innerText += response.message;
                save(false);
                destroyConsoleInputs();
            }
        } else {
            alert("Error pinging the server: " + xhr.statusText);
        }
        isPinging = false;
    }
    xhr.send();
}

function updateText() {
    if (!isOwner) return;
    const code = document.getElementById("code").value;
    for (let i = 0; i < files.length; i++) {
        if (files[i].path === currentFilePath) {
            files[i].content = code;
            break;
        }
    }
}

function save(type) {
    if (!isOwner) return;
    if (isRunning) return;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save?" + id, type);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(files));
}

function loadFiles () {
    const fileList = document.getElementById("files");
    fileList.replaceChildren();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/project?" + id);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            files = JSON.parse(xhr.responseText);
            displayFiles(files);
        } else {
            alert("Error loading content: " + xhr.statusText);
            setTimeout(returnHome, 3000);
        }
    };
    xhr.send();
}

function displayFiles(files, fileList = document.getElementById("files")) {
    files.forEach(file => {
        if (file.hidden) return;
        const button = document.createElement("button");
        button.style.paddingLeft = (layer(file.path) * 20) + "px";
        button.innerHTML = (file.type === "directory" 
            ? ">  " 
            : `<img src=\"${grabImage(file.type)}\">`) + file.name;
        button.className = "file-item";
        if (file.type === "directory") {
            button.onclick = function() {
                closeFolder(file);
            }
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
            button.onclick = function() {
                loadFileContent(file.path);
            };
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
}

function grabImage(type) {
    const icons = {
        "c" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        "cpp" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        "java" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        "cs" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
        "py" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        "js" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        "default" : "https://cdn-icons-png.flaticon.com/128/9496/9496401.png"};
    return icons[type] || icons["default"];

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

function deleteProject() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/delete-project?" + id);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            alert("Project deleted successfully.");
            returnHome();
        } else {
            alert("Error deleting project: " + xhr.statusText);
        }
    }
    xhr.send();
    disableMenus("all");
}

function layer(path) {
    return path.split("/").length - 3;
}