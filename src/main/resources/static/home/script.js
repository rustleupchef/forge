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
        if (xhr.status === 200) {
            const projects = JSON.parse(xhr.responseText);
            const projectList = document.getElementById("project-list");
            projectList.innerHTML = "";
            projects.forEach(project => {
                const li = document.createElement("li");
                li.innerHTML = "<h3>" + project.name + "</h3><p>" + project.description + "</p>";
                li.onclick = function() {
                    window.location.href = "/project/" + project.id;
                };
                projectList.appendChild(li);
            });
        } else {
            console.error("Failed to fetch projects:", xhr.statusText);
        }
    }
    xhr.send();
}