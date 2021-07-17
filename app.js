const express = require("express");
app = express();
app.enable("trust proxy");
const { broker } = require("./molecular_setup");

app.use(express.json());

app.get("/ip", async (req, res) => {
    const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await broker.start();
    try {
        const resp = await broker.call("webhooks.trigger", {
            ipAddress,
        });
        res.send(resp);
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
});
app.post("/register", async (req, res) => {
    await broker.start();
    const targetURL = req.body.targetURL;
    const resp = await broker.call("webhooks.register", {
        targetURL,
    });
    res.send(resp);
});
app.get("/list", async (req, res) => {
    await broker.start();
    const resp = await broker.call("webhooks.list");
    res.send(resp);
});

app.put("/update", async (req, res) => {
    await broker.start();
    const newTargetUrl = req.body.newTargetUrl;
    const id = req.body.id;

    try {
        const resp = await broker.call("webhooks.update", {
            id,
            newTargetUrl,
        });
        res.send("success");
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
});

app.delete("/delete", async (req, res) => {
    const { id } = req.body;
    await broker.start();
    try {
        const resp = await broker.call("webhooks.delete", {
            id,
        });
        res.send("success");
    } catch (e) {
        res.status(500).json({ err: e.message });
    }
});
const PORT = process.env.port || 3000;
app.listen(PORT, (err) => {
    console.log(`listening to ${PORT}`);
});
