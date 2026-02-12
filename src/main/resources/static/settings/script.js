function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logout');
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            location.assign("/login");
        }
    }
    xhr.send();
}

function edit(name, element) {

    
    const input = document.getElementById(name);
    
    if (input.disabled) {
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(i => {
            i.disabled = true;
            i.style.color = "gray";
        });

        const buttons = document.querySelectorAll('.edit-button');
        buttons.forEach(i => {
            i.innerText = "Edit";
        });

        input.disabled = false;
        input.style.color = "white";
    
        element.innerText = "Save";
    } else {
        input.disabled = true;
        input.style.color = "gray";

        element.innerText = "Edit";
    }
}