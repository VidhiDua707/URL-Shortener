const analyticsTable = document.getElementById("analyticsTable");
const analyticsMessage = document.getElementById("analyticsMessage");

async function loadAnalytics() {
    try {
        const response = await fetch("/api/urls");

        if (!response.ok) {
            throw new Error("Could not load analytics.");
        }

        const links = await response.json();

        analyticsTable.innerHTML = "";

        if (links.length === 0) {
            analyticsTable.innerHTML = `
                <tr>
                    <td colspan="3">No short links created yet.</td>
                </tr>
            `;
            return;
        }

        links.forEach(function (link) {
            const shortUrl =
                window.location.origin + "/" + link.shortCode;

            const row = document.createElement("tr");

            const shortCell = document.createElement("td");
            const shortAnchor = document.createElement("a");
            shortAnchor.href = shortUrl;
            shortAnchor.textContent = shortUrl;
            shortAnchor.target = "_blank";
            shortAnchor.rel = "noopener noreferrer";
            shortCell.appendChild(shortAnchor);

            const originalCell = document.createElement("td");
            originalCell.textContent = link.originalUrl;

            const clicksCell = document.createElement("td");
            clicksCell.textContent = link.clicks ?? 0;

            row.appendChild(shortCell);
            row.appendChild(originalCell);
            row.appendChild(clicksCell);

            analyticsTable.appendChild(row);
        });

    } catch (error) {
        analyticsMessage.textContent =
            "Unable to load analytics. Please check that the server is running.";
    }
}

loadAnalytics();