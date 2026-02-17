let verificationCode = null;

window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/grab-user");
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("testing");
            const customer = JSON.parse(xhr.responseText);
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            
            name.value = customer.name;
            email.value = customer.email;

        }
    }
    xhr.send();
}

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
        if (name === "password") {
            if (input.value.length < 8 && input.value.length > 0) {
                alert("Please enter a suffcient password");
                return;
            }
        }
        input.disabled = true;
        input.style.color = "gray";
        
        
        element.innerText = "Edit";
        save();
    }
}

function askForCode() {
    const box = document.querySelector(".overlay-box");
    box.style.display = "flex";
}

function confirmCode() {
    verificationCode = document.getElementById("code").value;
    const box = document.querySelector(".overlay-box");
    box.style.display = "none";
    setTimeout(() => {
        verificationCode = null;
    }, 5 * 60 * 1000);
    save();
}

function save() {
    const xhr = new XMLHttpRequest();
    if (verificationCode == null) {
        const email = encodeURIComponent(document.getElementById("email").value);
        xhr.open("POST", "/send-verification-code?email=" + email);
        xhr.onload = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                askForCode();
            }
        }
        xhr.send();
        return;
    }

    const newName = encodeURIComponent(document.getElementById("name").value);
    const newEmail = encodeURIComponent(document.getElementById("email").value);
    const newPassword = encodeURIComponent(document.getElementById("password").value);

    const enteredPassword = prompt("Enter password:")

    xhr.open("POST", "/update-user");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            verificationCode = null;
        }
    }
    xhr.send(JSON.stringify({ name: newName, email: newEmail, password: newPassword, entered: enteredPassword}));

}