const http = require("http");
const fs = require("fs");
const path = require("path");

const urlRoutes = require("./routes/urlRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const frontendPath = path.join(__dirname, "../frontend");

const server = http.createServer((req, res) => {
    // Allow frontend JavaScript to communicate with the backend
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // API routes
    if (urlRoutes(req, res)) {
        return;
    }

    if (analyticsRoutes(req, res)) {
        return;
    }

    // Open dashboard when visiting the root URL
    let requestedPath = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname
    );

    if (requestedPath === "/") {
        requestedPath = "/dashboard.html";
    }

    // Serve frontend files
    const filePath = path.resolve(frontendPath, "." + requestedPath);

    // Prevent access to files outside the frontend folder
    if (!filePath.startsWith(frontendPath + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Page not found");
            return;
        }

        const extension = path.extname(filePath);

        const contentTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "text/javascript",
            ".json": "application/json"
        };

        res.writeHead(200, {
            "Content-Type": contentTypes[extension] || "application/octet-stream"
        });

        res.end(content);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`SnapLink is running at http://localhost:${PORT}`);
});