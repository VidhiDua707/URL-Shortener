const generateCode = require("../utlis/generateCode");

// Temporary storage for shortened URLs
const urls = [];

function urlRoutes(req, res) {
    const url = new URL(req.url, "http://localhost:3000");
    const pathname = url.pathname;

    // Get all shortened URLs
    if (req.method === "GET" && pathname === "/api/urls") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(urls));
        return true;
    }

    // Create a new shortened URL
    if (req.method === "POST" && pathname === "/api/urls") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const originalUrl = data.originalUrl;

                // Validate the original URL
                const parsedUrl = new URL(originalUrl);

                if (
                    parsedUrl.protocol !== "http:" &&
                    parsedUrl.protocol !== "https:"
                ) {
                    throw new Error("Only HTTP and HTTPS URLs are allowed.");
                }

                const shortCode = generateCode();

                const newUrl = {
                    originalUrl: originalUrl,
                    shortCode: shortCode,
                    clicks: 0,
                    createdAt: new Date().toISOString()
                };

                urls.push(newUrl);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify(newUrl));

            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Please enter a valid URL."
                }));
            }
        });

        return true;
    }

    // Redirect short links to the original URL
    const shortCode = pathname.slice(1);

    if (req.method === "GET" && shortCode && !pathname.startsWith("/api/")) {
        const foundUrl = urls.find((item) => {
            return item.shortCode === shortCode;
        });

        if (foundUrl) {
            foundUrl.clicks++;

            res.writeHead(302, {
                Location: foundUrl.originalUrl
            });

            res.end();
            return true;
        }
    }

    return false;
}

urlRoutes.getAnalytics = function () {
    return urls;
};

module.exports = urlRoutes;