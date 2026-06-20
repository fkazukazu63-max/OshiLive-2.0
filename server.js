const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = 3000;

const youtube = google.youtube({
    version: "v3",
    auth: "AIzaSyC_dl1Bc5pHDLtQB6OH5DpBcM8D2RzpOvM"
});

app.use(express.static(__dirname));

app.get("/api/test", (req, res) => {xx
    res.json({
        message: "OshiLive Server Working!"
    });
});

app.get("/api/channel", async (req, res) => {
    try {
        const response = await youtube.channels.list({
            part: "snippet",
            id: "UCspv01oxUFf_MTSipURRhkA"
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
app.get("/api/youtube-live", async (req, res) => {
    const channelId = req.query.channelId;

    if (!channelId) {
        return res.status(400).json({
            error: "channelId is required"
        });
    }

    try {
        console.log(`Checking live status for: ${channelId}`);

        const response = await youtube.search.list({
            part: "snippet",
            channelId: channelId,
            eventType: "live",
            type: "video",
            maxResults: 1
        });

        const isLive = response.data.items.length > 0;

        console.log(
            `${channelId}: ${isLive ? "LIVE" : "OFFLINE"}`
        );

        res.json({
            channelId: channelId,
            isLive: isLive,
            videoTitle: isLive
                ? response.data.items[0].snippet.title
                : null,
            videoId: isLive
                ? response.data.items[0].id.videoId
                : null
        });

    } catch (error) {

        console.error("========== YOUTUBE API ERROR ==========");
        console.error("Channel:", channelId);
        console.error("Message:", error.message);

        if (error.response) {
            console.error("Status:", error.response.status);

            console.error(
                "Data:",
                JSON.stringify(error.response.data, null, 2)
            );
        }

        console.error("Full Error:");
        console.error(error);
        console.error("======================================");

        res.status(500).json({
            error: error.message
        });
    }
});
app.get("/api/upcoming-streams", async (req, res) => {
    const channelId = req.query.channelId;

    if (!channelId) {
        return res.status(400).json({
            error: "channelId is required"
        });
    }

    try {
        const searchResponse = await youtube.search.list({
            part: "snippet",
            channelId: channelId,
            eventType: "upcoming",
            type: "video",
            maxResults: 3
        });

        const searchItems = searchResponse.data.items || [];
        const videoIds = searchItems
            .map(item => item.id.videoId)
            .filter(Boolean);

        if (videoIds.length === 0) {
            return res.json([]);
        }

        const videosResponse = await youtube.videos.list({
            part: "snippet,liveStreamingDetails",
            id: videoIds.join(",")
        });

        const videos = videosResponse.data.items || [];

        const streams = videos.map(video => ({
            title: video.snippet.title,
            scheduledTime: video.liveStreamingDetails?.scheduledStartTime || null,
            videoId: video.id,
            url: `https://www.youtube.com/watch?v=${video.id}`
        }));

        res.json(streams);

    } catch (error) {
        console.error("Upcoming streams error:", error.message);

        if (error.response) {
            console.error(
                "Data:",
                JSON.stringify(error.response.data, null, 2)
            );
        }

        res.status(500).json({
            error: error.message
        });
    }
});


app.get("/api/channel-by-url", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const handle = url.split("@")[1]?.split("/")[0];

    if (!handle) {
        return res.status(400).json({ error: "Only @handle URLs are supported for now" });
    }

    try {
        const response = await youtube.channels.list({
            part: "snippet",
            forHandle: handle
        });

        const channel = response.data.items[0];

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        res.json({
            id: channel.id,
            name: channel.snippet.title,
            image: channel.snippet.thumbnails.high.url,
            youtube: url
        });

    } catch (error) {
        console.error("Channel by URL error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
