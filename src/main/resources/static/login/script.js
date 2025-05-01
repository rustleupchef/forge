function login() {
    const email = encodeURIComponent(document.getElementById("email").value);
    const password = encodeURIComponent(document.getElementById("password").value);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/login?email=" + email + "&password=" + password, true);
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            if (xhr.responseText === "OK") {
                window.location.href = "/home";
            }
            else if (xhr.responseText.length > 0) {
                alert(xhr.responseText);
            }
            else {
                alert("An unexpected error occurred");
            }
        }
    }
    xhr.send();
}