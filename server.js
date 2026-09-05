const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
    console.error("Missing required environment variable: YOUTUBE_API_KEY");
    process.exit(1);
}

const youtube = google.youtube({
    version: "v3",
    auth: YOUTUBE_API_KEY
});

app.use(express.static(__dirname));

app.get("/api/test", (req, res) => {
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
        return res.status(400).json({ error: "channelId is required" });
    }

    try {
        const response = await youtube.search.list({
            part: "snippet",
            channelId,
            eventType: "live",
            type: "video",
            maxResults: 1
        });

        const isLive = response.data.items.length > 0;

        res.json({
            channelId,
            isLive,
            videoTitle: isLive ? response.data.items[0].snippet.title : null,
            videoId: isLive ? response.data.items[0].id.videoId : null
        });
    } catch (error) {
        console.error("YouTube live status error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/upcoming-streams", async (req, res) => {
    const channelId = req.query.channelId;

    if (!channelId) {
        return res.status(400).json({ error: "channelId is required" });
    }

    try {
        const searchResponse = await youtube.search.list({
            part: "snippet",
            channelId,
            eventType: "upcoming",
            type: "video",
            maxResults: 3
        });

        const searchItems = searchResponse.data.items || [];
        const videoIds = searchItems.map(item => item.id.videoId).filter(Boolean);

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
        res.status(500).json({ error: error.message });
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
    console.log(`Server running on port ${PORT}`);
});
