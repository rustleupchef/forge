function submit() {
    const xhr = new XMLHttpRequest();

    const name = encodeURIComponent(document.getElementById("projectName").value);
    const description = encodeURIComponent(document.getElementById("projectDescription").value);
    const isPrivate = encodeURIComponent(document.getElementById("isPrivate").checked);

    xhr.open("POST", "/create-project?name=" + name + "&description=" + description + "&isprivate=" + isPrivate, false);
    xhr.send();

    window.location.href = "/home";
}