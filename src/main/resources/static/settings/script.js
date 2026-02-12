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