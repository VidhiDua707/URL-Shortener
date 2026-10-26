const shortenForm = document.getElementById("shortenForm");
const originalUrlInput = document.getElementById("originalUrl");
const shortenButton = document.getElementById("shortenButton");
const message = document.getElementById("message");
const resultBox = document.getElementById("resultBox");
const shortUrl = document.getElementById("shortUrl");
const copyButton = document.getElementById("copyButton");

// Create a short URL
shortenForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const originalUrl = originalUrlInput.value.trim();

    message.textContent = "Creating your short link...";
    resultBox.hidden = true;
    shortenButton.disabled = true;

    try {
        const response = await fetch("/api/urls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                originalUrl: originalUrl
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not create short link.");
        }

        // Show the generated short URL
        const generatedUrl = window.location.origin + "/" + data.shortCode;

        shortUrl.href = generatedUrl;
        shortUrl.textContent = generatedUrl;

        resultBox.hidden = false;
        message.textContent = "Your short link is ready!";
        originalUrlInput.value = "";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        shortenButton.disabled = false;
    }
});

// Copy the short URL
copyButton.addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(shortUrl.href);
        copyButton.textContent = "Copied!";

        setTimeout(function () {
            copyButton.textContent = "Copy";
        }, 1500);

    } catch (error) {
        message.textContent = "Copy failed. Please copy the link manually.";
    }
});