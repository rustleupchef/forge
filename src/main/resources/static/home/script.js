function showTab(tab) {
    if (tab === "home") {
        return;
    }
    window.location.href = tab;
}

function grabImage(type) {
    const order = ["java", "py", "js", "cpp", "cs", "c"];
    const icons = {
        "c" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        "cpp" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        "java" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        "cs" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
        "py" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        "js" : "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        "default" : "https://cdn-icons-png.flaticon.com/128/9496/9496401.png"};
    return icons[order[type - 1]] || icons["default"];

}

window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/get-projects", true);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const projects = JSON.parse(xhr.responseText);
            const projectList = document.getElementById("projects");
            projectList.innerHTML = "";
            projects.forEach(project => {
                const bar = document.createElement("div");
                bar.className = "project-box";
                bar.onclick = function() {
                    window.location.href = "/project?id=" + project.id;
                };

                const img = document.createElement("img");
                img.src = grabImage(project.type);
                bar.appendChild(img);

                const contentDiv = document.createElement("div");

                const title = document.createElement("h3");
                title.textContent = project.name;
                contentDiv.appendChild(title);
                
                const desc = document.createElement("p");
                desc.textContent = project.description;
                contentDiv.appendChild(desc);

                bar.appendChild(contentDiv);
                projectList.appendChild(bar);
            });
        } else {
            console.error("Failed to fetch projects:", xhr.statusText);
        }
    }
    xhr.send();
}