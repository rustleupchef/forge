function submit() {
    const submit = document.getElementById("submit");
    
    const xhr = new XMLHttpRequest();

    const name = encodeURIComponent(document.getElementById("projectName").value);
    const description = encodeURIComponent(document.getElementById("projectDescription").value);
    const isPrivate = encodeURIComponent(document.getElementById("isPrivate").checked);
    const type = encodeURIComponent(document.getElementById("Language").value);

    if (name.length === 0) {
        alert("You must enter a name");
    }

    if (description.length === 0) {
        alert("You must enter a description");
    }

    xhr.open("POST",
        "/create-project?name=" + name + 
        "&description=" + description + 
        "&isprivate=" + isPrivate +
        "&type=" + type);

    submit.setAttribute("disabled", "disabled");
    xhr.onload = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            window.location.href = "/home";
        } else {
            alert(xhr.statusText);
            submit.removeAttribute("disabled");
        }
    };
    
    xhr.send();
}