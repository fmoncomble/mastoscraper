document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('start-btn');

    startBtn.addEventListener('click', function () {
        const mastoscraperUrl = encodeURIComponent('mastoscraper.html');
        const url = chrome.runtime.getURL(mastoscraperUrl);
        chrome.tabs.create({ url: url });
        window.close();
    });
});