let verificationCode = null;

function resetVerificationCode() {
    verificationCode = null;
    document.getElementById("verificationCode").setAttribute("disabled", true);
    document.getElementById("verificationCode").setAttribute("placeholder", "Verification code will be sent to your email");
    document.getElementById("verificationCode").setAttribute("required", false);
    document.getElementById("verificationCode").value = "";
    document.getElementById("email").value = "";
}

function signup() {
    const xhr = new XMLHttpRequest();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const enteredVerificationCode = document.getElementById("verificationCode").value;
    if (verificationCode !== enteredVerificationCode && verificationCode !== null) {
        alert("Invalid verification code");
        return;
    }
    xhr.open("POST", "/signup?email=" + email + "&username=" + username + "&password=" + password, true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            if (xhr.responseText === "OK") {
                alert("Signup successful");
                window.location.href = "/login";
            } else if (xhr.responseText === "EMAIL_EXISTS") {
                alert("Email already exists");
            } else if (xhr.responseText === "USERNAME_EXISTS") {
                alert("Username already exists");
            } else {
                verificationCode = xhr.responseText;
                alert("Verification code sent to your email. Please enter it below.");
                document.getElementById("verificationCode").setAttribute("disabled", false);
                document.getElementById("verificationCode").setAttribute("placeholder", "Enter verification code");
                document.getElementById("verificationCode").setAttribute("required", true);
                setTimeout(resetVerificationCode, 5 * 60 * 1000);
            }
        } else {
            alert("Signup failed: " + xhr.responseText);
        }
    };
}