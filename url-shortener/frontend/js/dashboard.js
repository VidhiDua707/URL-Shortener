// Get HTML elements
let totalClicksElement = document.getElementById("totalClicks");
let totalLinksElement = document.getElementById("totalLinks");
let averageClicksElement = document.getElementById("averageClicks");
let recentLinksElement = document.getElementById("recentLinks");
let searchInput = document.getElementById("searchInput");
let linkCountElement = document.getElementById("linkCount");

let links = [];

// Load links from backend
async function loadLinks() {
    try {
        let response = await fetch("/api/urls");

        if (!response.ok) {
            throw new Error("Could not load links");
        }

        links = await response.json();

        showStatistics();
        displayLinks(links);

    } catch (error) {
        console.log(error);

        recentLinksElement.innerHTML = `
            <tr>
                <td colspan="5" class="message">
                    Could not load links. Please check the server.
                </td>
            </tr>
        `;

        linkCountElement.textContent = "Links could not be loaded";
    }
}

// Calculate statistics
function showStatistics() {
    let totalClicks = 0;

    for (let i = 0; i < links.length; i++) {
        totalClicks += Number(links[i].clicks) || 0;
    }

    let totalLinks = links.length;
    let averageClicks = 0;

    if (totalLinks > 0) {
        averageClicks = (totalClicks / totalLinks).toFixed(1);
    }

    totalClicksElement.textContent = totalClicks;
    totalLinksElement.textContent = totalLinks;
    averageClicksElement.textContent = averageClicks;
}

// Display links in the table
function displayLinks(list) {
    if (list.length === 0) {
        recentLinksElement.innerHTML = `
            <tr>
                <td colspan="5" class="message">
                    No links found. Create your first short URL!
                </td>
            </tr>
        `;

        linkCountElement.textContent = "Showing 0 links";
        return;
    }

    let html = "";

    for (let i = 0; i < list.length; i++) {
        let link = list[i];
        let shortUrl = window.location.origin + "/" + link.shortCode;

        html += `
            <tr>
                <td>${i + 1}</td>

                <td>
                    <span class="original-url" title="${escapeHTML(link.originalUrl)}">
                        ${escapeHTML(link.originalUrl)}
                    </span>
                </td>

                <td>
                    <a class="short-url"
                       href="${escapeHTML(shortUrl)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        ${escapeHTML(shortUrl)}
                    </a>
                </td>

                <td>
                    <span class="click-badge">${Number(link.clicks) || 0}</span>
                </td>

                <td>
                    <button class="copy-button"
                            data-url="${escapeHTML(shortUrl)}">
                        Copy
                    </button>
                </td>
            </tr>
        `;
    }

    recentLinksElement.innerHTML = html;
    linkCountElement.textContent = "Showing " + list.length + " links";
}

// Search links
searchInput.addEventListener("input", function () {
    let searchText = searchInput.value.toLowerCase();
    let filteredLinks = [];

    for (let i = 0; i < links.length; i++) {
        let originalUrl = links[i].originalUrl.toLowerCase();
        let shortCode = links[i].shortCode.toLowerCase();

        if (
            originalUrl.includes(searchText) ||
            shortCode.includes(searchText)
        ) {
            filteredLinks.push(links[i]);
        }
    }

    displayLinks(filteredLinks);
});

// Copy short URL
recentLinksElement.addEventListener("click", async function (event) {
    let button = event.target.closest(".copy-button");

    if (!button) {
        return;
    }

    try {
        await navigator.clipboard.writeText(button.dataset.url);

        button.textContent = "Copied!";

        setTimeout(function () {
            button.textContent = "Copy";
        }, 1500);

    } catch (error) {
        alert("Could not copy the link. Please copy it manually.");
    }
});

// Escape text before showing it in HTML
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        let characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];
    });
}

// Start dashboard
loadLinks();