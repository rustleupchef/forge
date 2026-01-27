function submit() {
    const xhr = new XMLHttpRequest();

    const name = encodeURIComponent(document.getElementById("projectName").value);
    const description = encodeURIComponent(document.getElementById("projectDescription").value);
    const isPrivate = encodeURIComponent(document.getElementById("isPrivate").checked);
    const type = encodeURIComponent(document.getElementById("Language").value);

    console.log(type);

    xhr.open("POST",
        "/create-project?name=" + name + 
        "&description=" + description + 
        "&isprivate=" + isPrivate +
        "&type=" + type);

    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            window.location.href = "/home";
        } else {
            console.error(xhr.statusText);
        }
    };
    
    xhr.send();
}