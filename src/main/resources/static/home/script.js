function showTab(tab) {
    if (tab === "home") {
        return;
    }
    window.location.href = "/home/" + tab;
}