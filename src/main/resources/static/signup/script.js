let verificationCode = null;

function resetVerificationCode() {
    verificationCode = null;
    document.getElementById("verificationCode").setAttribute("disabled", "disabled");
    document.getElementById("verificationCode").setAttribute("placeholder", "Verification code will be sent to your email");
    document.getElementById("verificationCode").setAttribute("required", "required");
    document.getElementById("verificationCode").value = "";
    document.getElementById("submit").innerHTML = "Send Verification Code";
}

function signup() {
    const xhr = new XMLHttpRequest();
    const password = encodeURIComponent(document.getElementById("password").value);
    if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
    }

    const confirmPassword = encodeURIComponent(document.getElementById("confirmPassword").value);
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    const email = encodeURIComponent(document.getElementById("email").value);
    if (email.length < 5 || !document.getElementById("email").value.includes("@")) {
        alert("Invalid email address");
        return;
    }
    const username = encodeURIComponent(document.getElementById("username").value);
    if (username.length < 3) {
        alert("Username must be at least 3 characters long");
        return;
    }

    const enteredVerificationCode = encodeURIComponent(document.getElementById("verificationCode").value);
    if (verificationCode !== enteredVerificationCode && verificationCode !== null) {
        alert("Invalid verification code");
        return;
    }
    xhr.open("POST", "/signup?email=" + email + "&username=" + username + "&password=" + password + "&verificationCode=" + verificationCode, true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            console.log(xhr.responseText);
            if (xhr.responseText === "OK") {
                alert("Signup successful");
                window.location.href = "/login";
            } else if (xhr.responseText === "EMAIL_EXISTS") {
                alert("Email already exists");
                resetVerificationCode();
            } else if (xhr.responseText === "") {
                alert("Signup failed: No response from server");
                resetVerificationCode();
            } else {
                console.log(xhr.responseText);
                verificationCode = xhr.responseText;
                alert("Verification code sent to your email. Please enter it below.");
                document.getElementById("verificationCode").removeAttribute("disabled");
                document.getElementById("verificationCode").setAttribute("placeholder", "Enter verification code");
                document.getElementById("verificationCode").setAttribute("required", true);
                document.getElementById("submit").innerHTML = "Submit";
                setTimeout(resetVerificationCode, 5 * 60 * 1000);
            }
        } else {
            alert("Signup failed: " + xhr.responseText);
        }
    };
    xhr.send();
}