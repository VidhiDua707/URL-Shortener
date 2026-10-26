function analyticsRoutes(req, res) {
    const url = new URL(req.url, "http://localhost:3000");

    // Get analytics for all shortened URLs
    if (req.method === "GET" && url.pathname === "/api/analytics") {
        const urlRoutes = require("./urlRoutes");

        const analytics = urlRoutes.getAnalytics();

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(analytics));
        return true;
    }

    return false;
}

module.exports = analyticsRoutes;