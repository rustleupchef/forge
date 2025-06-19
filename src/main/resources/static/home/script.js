function showTab(tab) {
    if (tab === "home") {
        return;
    }
    window.location.href = tab;
}

window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/get-projects", true);
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            const projects = JSON.parse(xhr.responseText);
            console.log(projects);
            const projectList = document.getElementById("projectList");
            projectList.innerHTML = "";
            projects.forEach(project => {
                const bar = document.createElement("div");
                bar.className = "project-bar";
                bar.innerHTML = "<h3>" + project.name + "</h3><h5>" + project.description + "</h5>";
                bar.onclick = function() {
                    window.location.href = "/project?id=" + project.id;
                };
                projectList.appendChild(bar);
            });
        } else {
            console.error("Failed to fetch projects:", xhr.statusText);
        }
    }
    xhr.send();
}