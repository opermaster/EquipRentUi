const localhost = "https://localhost:7251/api/";
const popup = document.getElementById("pop-up");
const popupText = document.getElementById("pop-up-text");
const statuses = [
    "Pending",
    "Confirmed",
    "Rejected",
    "InUse",
    "Done"
];
function createCell(text) {
    const th = document.createElement("th");
    th.textContent = text;
    return th;
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString();
}
function showPopup(text, type = "neg", timeout = 3000) {
    popupText.textContent = text;

    popup.classList.remove("pos", "neg", "active");
    popup.classList.add(type);
    requestAnimationFrame(() => {
        popup.classList.add("active");
    });
    setTimeout(() => {
        popup.classList.remove("active");
    }, timeout);
}