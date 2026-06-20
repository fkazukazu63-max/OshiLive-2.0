let vtubers = [
    {
        id: "kuzuha",
        nameEn: "Kuzuha",
        nameJa: "葛葉",
        agency: "NIJISANJI",
        channelId: "UCSFCh5NL4qXrAy9u-u2lX3g",
        descriptionEn: "A popular VTuber known for gaming and entertaining streams.",
        descriptionJa: "ゲーム配信や面白い配信で人気のVTuber。",
        image: "images/kuzuha.jpg",
        youtube: "https://www.youtube.com/@Kuzuha",
        tags: ["gaming", "energetic"]
    },
    {
        id: "kanae",
        nameEn: "Kanae",
        nameJa: "叶",
        agency: "NIJISANJI",
        channelId: "UCspv01oxUFf_MTSipURRhkA",
        descriptionEn: "A calm and skilled VTuber, great for relaxing streams.",
        descriptionJa: "落ち着いた雰囲気とゲームの上手さが魅力のVTuber。",
        image: "images/kanae.jpg",
        youtube: "https://www.youtube.com/@Kanae",
        tags: ["gaming", "relaxing"]
    },
    {
        id: "fuwa",
        nameEn: "Fuwa Minato",
        nameJa: "不破湊",
        agency: "NIJISANJI",
        channelId:"UC6wvdADTJ88OfIbJYIpAaDA",
        descriptionEn: "A bright VTuber known for singing and fun talk.",
        descriptionJa: "歌と明るいトークが魅力のVTuber。",
        image: "images/fuwa.jpg",
        youtube: "https://www.youtube.com/@FuwaMinato",
        tags: ["singing", "energetic"]
    },
    {
        id: "lauren",
        nameEn: "Lauren Iroas",
        nameJa: "ローレン",
        agency: "NIJISANJI",
        channelId:"UCgmFrRcyH7d1zR9sIVQhFow",
        descriptionEn: "A high-energy VTuber known for gaming streams.",
        descriptionJa: "テンションの高いゲーム配信が魅力のVTuber。",
        image: "images/lauren.jpg",
        youtube: "https://www.youtube.com/@LaurenIroas",
        tags: ["gaming", "energetic"]
    }
];
const savedCustomVTubers = JSON.parse(localStorage.getItem("customVTubers")) || [];
vtubers.push(...savedCustomVTubers);
const savedEdits = JSON.parse(localStorage.getItem("vtuberEdits")) || {};

vtubers = vtubers.map(vtuber => {
    if (savedEdits[vtuber.id]) {
        return {
            ...vtuber,
            ...savedEdits[vtuber.id]
        };
    }
    return vtuber;
});

let currentLanguage = "en";
let showingFavorites = false;
let savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

let favorites = savedFavorites.filter(id =>
    vtubers.some(vtuber => vtuber.id === id)
);
let liveStatus = JSON.parse(localStorage.getItem("liveStatus")) || {};
let liveTitles = JSON.parse(localStorage.getItem("liveTitles")) || {};
let previousLiveStatus = JSON.parse(localStorage.getItem("previousLiveStatus")) || {};

function renderCards(list = vtubers) {
    const container = document.getElementById("cardContainer");
    container.innerHTML = "";

    list.forEach(vtuber => {
        const isFavorite = favorites.includes(vtuber.id);
        const memoKey = `memo-${vtuber.id}`;
        const savedMemo = localStorage.getItem(memoKey) || "";
        const savedSchedule =
        localStorage.getItem(`schedule-${vtuber.id}`) || "";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${vtuber.image}" alt="${vtuber.nameEn}">

            <h2>${currentLanguage === "en" ? vtuber.nameEn : vtuber.nameJa}</h2>

            <p>${vtuber.agency}</p>

            <p>${currentLanguage === "en" ? vtuber.descriptionEn : vtuber.descriptionJa}</p>

            <p id="status-${vtuber.id}" class="status-badge">
                ${liveStatus[vtuber.id] ? "🔴 LIVE" : "⚫ Offline"}
            </p>
            ${liveStatus[vtuber.id] && liveTitles[vtuber.id] ? `
            <p class="live-title">
             ${liveTitles[vtuber.id]}
            </p>
            ` : ""}

           <button class="manual-live-toggle" onclick="toggleLiveStatus('${vtuber.id}')">
            ${liveStatus[vtuber.id]
             ? (currentLanguage === "en" ? "End Stream" : "配信終了")
            : (currentLanguage === "en" ? "Go Live" : "配信開始")}
            </button>

            <a class="youtube-btn" href="${vtuber.youtube}" target="_blank">
                ${currentLanguage === "en" ? "Watch Stream" : "配信を見る"}
            </a>
            ${vtuber.twitch ? `
            <a class="twitch-btn" href="${vtuber.twitch}" target="_blank">
            Twitch
            </a>
            ` : ""}

            <button class="favorite-btn" onclick="toggleFavorite('${vtuber.id}')">
                ${isFavorite ? "★" : "☆"} ${currentLanguage === "en" ? "Favorite" : "お気に入り"}
            </button>

            <textarea
                class="memo"
                id="${memoKey}"
                placeholder="${currentLanguage === "en" ? "Write a memo..." : "メモを書く..."}">${savedMemo}</textarea>

            <button onclick="saveMemo('${memoKey}')">
                ${currentLanguage === "en" ? "Save Memo" : "メモ保存"}
            </button>
            <textarea
            class="schedule"
            id="schedule-${vtuber.id}"
            placeholder="${currentLanguage === "en" ? "Write stream schedule..." : "配信予定を書く..."}">${localStorage.getItem(`schedule-${vtuber.id}`) || ""}</textarea>

            <button onclick="saveSchedule('schedule-${vtuber.id}')">

             ${currentLanguage === "en" ? "Save Schedule" : "予定保存"}
            </button>
            <button onclick="autoFetchSchedule('${vtuber.id}')">
             ${currentLanguage === "en" ? "Auto Fetch Schedule" : "予定を自動取得"}
            </button>
            ${savedSchedule ? `
            <div class="upcoming-streams">
            <h4>📅 Upcoming Streams</h4>
            <ul>
        ${savedSchedule
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(line => `<li>${formatScheduleLine(line)}</li>`)
            .join("")}
    </ul>
</div>
` : ""}

            <button class="ai-analysis-btn" onclick="analyzeMemo('${memoKey}', 'result-${vtuber.id}')">
                ${currentLanguage === "en" ? "AI Analysis" : "AI分析"}
            </button>

            <p class="ai-analysis-result" id="result-${vtuber.id}"></p>
            <button onclick="deleteVTuber('${vtuber.id}')">
            🗑 Delete
            </button>
            <button onclick="editVTuber('${vtuber.id}')">
            ✏️ Edit
            </button>
        `;

        container.appendChild(card);

        if (liveStatus[vtuber.id]) {
            card.classList.add("live-card");
        }
    });
}

function formatScheduleLine(line) {
    const urlMatch = line.match(/\((https?:\/\/[^)]+)\)$/);

    if (!urlMatch) {
        return line;
    }

    const url = urlMatch[1];
    const text = line.replace(` (${url})`, "");
    const linkText = currentLanguage === "en" ? "Watch" : "視聴";

    return `${text} <a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    if (showingFavorites) {
        const favoriteList = vtubers.filter(vtuber =>
            favorites.includes(vtuber.id)
        );
        renderCards(favoriteList);
    } else {
        renderCards(vtubers);
    }

    updateFavoriteCount();
}

function showFavorites() {
    const favoriteList = vtubers.filter(vtuber => favorites.includes(vtuber.id));
    renderCards(favoriteList);
}

function showAllCards() {
    renderCards(vtubers);
}

function saveMemo(memoId) {
    const memo = document.getElementById(memoId).value;
    localStorage.setItem(memoId, memo);

    alert(currentLanguage === "en" ? "Memo saved!" : "メモを保存しました！");
}
function saveSchedule(scheduleId) {
    const schedule = document.getElementById(scheduleId).value;
    localStorage.setItem(scheduleId, schedule);

    updateNextStream();

    alert(currentLanguage === "en" ? "Schedule saved!" : "予定を保存しました！");
}

async function autoFetchSchedule(vtuberId) {
    const vtuber = vtubers.find(v => v.id === vtuberId);

    if (!vtuber) return;

    const channelId = vtuber.channelId || vtuber.id;

    if (!channelId || !channelId.startsWith("UC")) {
        alert("Valid YouTube channelId is required");
        return;
    }

    try {
        const response = await fetch(
            `/api/upcoming-streams?channelId=${encodeURIComponent(channelId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch upcoming streams");
        }

        if (!Array.isArray(data) || data.length === 0) {
            alert("No upcoming streams found");
            return;
        }

        const scheduleKey = `schedule-${vtuber.id}`;
        const currentSchedule = localStorage.getItem(scheduleKey) || "";
        const currentLines = currentSchedule
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

        const now = new Date();
        const blockedTitleKeywords = [
            "ふりーちゃっと",
            "free chat",
            "freechat",
            "フリーチャット"
        ];

        const newLines = data
            .filter(stream => {
                const title = stream.title || "";
                const videoId = stream.videoId || "";
                const scheduledTime = stream.scheduledTime || "";

                if (!scheduledTime) {
                    return false;
                }

                const scheduledDate = new Date(scheduledTime);

                if (isNaN(scheduledDate.getTime()) || scheduledDate <= now) {
                    return false;
                }

                const normalizedTitle = title.toLowerCase();

                if (blockedTitleKeywords.some(keyword =>
                    normalizedTitle.includes(keyword.toLowerCase())
                )) {
                    return false;
                }

                return !currentLines.some(line =>
                    (videoId && line.includes(videoId)) ||
                    (title && line.includes(title))
                );
            })
            .map(stream => {
                const scheduledTime = new Date(stream.scheduledTime).toLocaleString();

                return `${scheduledTime} - ${stream.title} (${stream.url})`;
            });

        if (newLines.length === 0) {
            alert("No new upcoming streams found");
            return;
        }

        const updatedSchedule = [...currentLines, ...newLines].join("\n");

        localStorage.setItem(scheduleKey, updatedSchedule);

        const scheduleTextarea = document.getElementById(scheduleKey);
        if (scheduleTextarea) {
            scheduleTextarea.value = updatedSchedule;
        }

        renderCards();
        updateNextStream();

        alert("Schedule updated!");

    } catch (error) {
        console.error("Auto fetch schedule failed:", error);
        alert("Failed to fetch schedule");
    }
}

function changeLanguage(language) {
    currentLanguage = language;
    renderCards();
    updateWelcomeMessage();
    updateLiveNowSection();
}

document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filtered = vtubers.filter(vtuber => {
        return (
            vtuber.nameEn.toLowerCase().includes(keyword) ||
            vtuber.nameJa.includes(keyword)
        );
    });

    renderCards(filtered);
});

function recommendVTuber() {
    const mood = document.getElementById("moodInput").value.toLowerCase();
    const result = document.getElementById("recommendResult");

    const match = vtubers.find(vtuber =>
        vtuber.tags.some(tag => mood.includes(tag))
    );

    if (!match) {
        result.innerText =
            currentLanguage === "en"
                ? "Try typing: gaming, singing, relaxing, or energetic."
                : "ゲーム、歌、癒し、元気 などを入力してみてください。";
        return;
    }

    result.innerText =
        currentLanguage === "en"
            ? `Recommended: ${match.nameEn}`
            : `おすすめ: ${match.nameJa}`;
}

function analyzeMemo(memoId, resultId) {
    const memo = document.getElementById(memoId).value.toLowerCase();
    const result = document.getElementById(resultId);

    if (memo.includes("valo") || memo.includes("valorant")) {
        result.innerText =
            currentLanguage === "en"
                ? "🎮 You seem interested in competitive FPS streams."
                : "🎮 FPS系配信への興味が高いようです。";
    } else if (
        memo.includes("sing") ||
        memo.includes("song") ||
        memo.includes("歌")
    ) {
        result.innerText =
            currentLanguage === "en"
                ? "🎤 You seem to enjoy singing streams."
                : "🎤 歌配信への興味が高いようです。";
    } else if (
        memo.includes("relax") ||
        memo.includes("癒し")
    ) {
        result.innerText =
            currentLanguage === "en"
                ? "🌿 Relaxing streams may suit you."
                : "🌿 落ち着いた配信がおすすめです。";
    } else {
        result.innerText =
            currentLanguage === "en"
                ? "Write more notes for better analysis."
                : "もっとメモを書くと分析できます。";
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function toggleLiveStatus(id) {
    liveStatus[id] = !liveStatus[id];
    

    localStorage.setItem("liveStatus", JSON.stringify(liveStatus));

    renderCards();
    updateLiveCount();
    updateLiveNowSection();
}

function updateWelcomeMessage() {
    const message = document.getElementById("welcomeMessage");

    if (!message) return;

    if (currentLanguage === "en") {
        message.innerText = "Welcome to OshiLive!";
    } else {
        message.innerText = "OshiLiveへようこそ!";
    }
}

function parseScheduleLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const autoFetchMatch = trimmed.match(
        /^(.+?)\s+-\s+(.+?)(?:\s+\(https?:\/\/.+\))?$/
    );

    if (autoFetchMatch) {
        const dateText = autoFetchMatch[1].trim();
        const title = autoFetchMatch[2].trim();
        const date = new Date(dateText);

        if (!isNaN(date.getTime())) {
            return {
                date,
                dateText,
                title
            };
        }
    }

    const manualMatch = trimmed.match(
        /^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})\s+(\d{1,2}):(\d{2})(?:\s+(.+))?$/
    );

    if (manualMatch) {
        const year = Number(manualMatch[1]);
        const month = Number(manualMatch[2]) - 1;
        const day = Number(manualMatch[3]);
        const hour = Number(manualMatch[4]);
        const minute = Number(manualMatch[5]);
        const title = manualMatch[6]?.trim() || "Untitled";
        const date = new Date(year, month, day, hour, minute);

        if (!isNaN(date.getTime())) {
            return {
                date,
                dateText: `${manualMatch[1]}/${manualMatch[2]}/${manualMatch[3]} ${manualMatch[4]}:${manualMatch[5]}`,
                title
            };
        }
    }

    return null;
}

function getCountdownText(targetDate) {
    const now = new Date();
    const diffMs = Math.max(0, targetDate - now);
    const totalMinutes = Math.floor(diffMs / 60000);

    return {
        days: Math.floor(totalMinutes / (60 * 24)),
        hours: Math.floor((totalMinutes % (60 * 24)) / 60),
        minutes: totalMinutes % 60
    };
}

function updateNextStream() {
    const box = document.getElementById("nextStreamBox");
    if (!box) return;

    const now = new Date();
    let nextStream = null;

    vtubers.forEach(vtuber => {
        const scheduleText = localStorage.getItem(`schedule-${vtuber.id}`) || "";

        scheduleText.split("\n").forEach(line => {
            const parsed = parseScheduleLine(line);
            if (!parsed || parsed.date <= now) return;

            if (!nextStream || parsed.date < nextStream.date) {
                nextStream = {
                    vtuber,
                    date: parsed.date,
                    dateText: parsed.dateText,
                    title: parsed.title
                };
            }
        });
    });

    if (!nextStream) {
        box.innerText =
            currentLanguage === "en"
                ? "🔔 Next Stream: No upcoming schedule"
                : "🔔 次の配信予定: 予定はありません";
        return;
    }

    const countdown = getCountdownText(nextStream.date);
    const vtuberName = currentLanguage === "en"
        ? nextStream.vtuber.nameEn
        : nextStream.vtuber.nameJa;

    if (currentLanguage === "en") {
        box.innerText =
            `🔔 Next Stream: ${vtuberName} - ${nextStream.dateText} - ${nextStream.title}\n` +
            `⏳ Starts in: ${countdown.days} days ${countdown.hours} hours ${countdown.minutes} minutes`;
    } else {
        box.innerText =
            `🔔 次の配信予定: ${vtuberName} - ${nextStream.dateText} - ${nextStream.title}\n` +
            `⏳ 開始まで: ${countdown.days}日 ${countdown.hours}時間 ${countdown.minutes}分`;
    }
}
renderCards();
updateWelcomeMessage();
updateLiveCount();
updateFavoriteCount();
updateNextStream();
updateLiveNowSection();
checkYoutubeLiveStatus();

setInterval(() => {
    updateNextStream();
}, 60 * 1000);

setInterval(() => {
    checkYoutubeLiveStatus();
}, 60 * 60 * 1000);
function updateLiveCount() {
    const liveCount =
        Object.values(liveStatus)
            .filter(status => status)
            .length;

    document.getElementById("liveCount").innerText =
        `Live VTubers: ${liveCount}`;
}
function updateLiveNowSection() {
    const section = document.getElementById("liveNowSection");
    const list = document.getElementById("liveNowList");

    if (!section || !list) return;

    const heading = section.querySelector("h2");
    if (heading) {
        heading.innerText = currentLanguage === "en"
            ? "🔴 LIVE NOW"
            : "🔴 配信中";
    }

    const liveVTubers = vtubers.filter(vtuber => liveStatus[vtuber.id]);

    if (liveVTubers.length === 0) {
        list.innerHTML = currentLanguage === "en"
            ? "No one is live now"
            : "現在配信中のライバーはいません";
        return;
    }

    list.innerHTML = liveVTubers
        .map(vtuber => {
            const name = currentLanguage === "en"
                ? vtuber.nameEn
                : vtuber.nameJa;

            const title = liveTitles[vtuber.id]
                ? `<span class="live-now-title">${liveTitles[vtuber.id]}</span>`
                : "";

            return `
                <a class="live-now-item" href="${vtuber.youtube}" target="_blank" rel="noopener noreferrer">
                    <span class="live-now-name">${name}</span>
                    ${title}
                </a>
            `;
        })
        .join("");
}
function updateFavoriteCount() {
    document.getElementById("favoriteCount").innerText =
        `Favorites: ${favorites.length}`;
}
function toggleFavoriteView() {
    showingFavorites = !showingFavorites;

    if (showingFavorites) {
        const favoriteList = vtubers.filter(vtuber =>
            favorites.includes(vtuber.id)
        );

        renderCards(favoriteList);

        document.getElementById("favoriteToggleBtn").innerText =
            currentLanguage === "en"
                ? "Show All"
                : "全て表示";
    } else {
        renderCards(vtubers);

        document.getElementById("favoriteToggleBtn").innerText =
            currentLanguage === "en"
                ? "Favorites Only"
                : "お気に入りのみ";
    }
}

function deleteVTuber(id) {

    const index =
        vtubers.findIndex(v => v.id === id);

    if (index === -1) return;

    vtubers.splice(index, 1);
    saveCustomVTubers();

    favorites =
        favorites.filter(fav => fav !== id);

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    renderCards();

    updateFavoriteCount();
}
function saveCustomVTubers() {
    const defaultIds = ["kuzuha", "kanae", "fuwa", "lauren"];

    const customVTubers = vtubers.filter(vtuber =>
        vtuber &&
        vtuber.id &&
        vtuber.channelId &&
        !defaultIds.includes(vtuber.id)
    );

    localStorage.setItem("customVTubers", JSON.stringify(customVTubers));

    console.log("Saved custom VTubers:", customVTubers);
}
function editVTuber(id) {
    const vtuber = vtubers.find(v => v.id === id);
    if (!vtuber) return;

    const editBox = document.createElement("div");
    editBox.className = "edit-modal";

    editBox.innerHTML = `
<div class="edit-content">
    <h2>Edit VTuber</h2>

    <input id="editNameEn"
    value="${vtuber.nameEn}"
    placeholder="English Name">

    <input id="editNameJa"
    value="${vtuber.nameJa}"
    placeholder="Japanese Name">

    <input id="editAgency"
    value="${vtuber.agency}"
    placeholder="Agency">

    <input id="editImage"
    value="${vtuber.image}"
    placeholder="Image URL">

    <input id="editYoutube"
    value="${vtuber.youtube}"
    placeholder="YouTube URL">

    <input id="editTwitch"
    value="${vtuber.twitch || ""}"
    placeholder="Twitch URL">

    <textarea id="editDescriptionEn"
    placeholder="English Description">${vtuber.descriptionEn}</textarea>

    <textarea id="editDescriptionJa"
    placeholder="Japanese Description">${vtuber.descriptionJa}</textarea>

    <input id="editTags"
    value="${vtuber.tags.join(",")}"
    placeholder="Tags">

    <button onclick="saveEditVTuber('${id}')">
        Save
    </button>

    <button onclick="closeEditModal()">
        Cancel
    </button>
</div>
`;

    document.body.appendChild(editBox);
}
function saveEditVTuber(id) {
    const vtuber = vtubers.find(v => v.id === id);
    if (!vtuber) return;

    vtuber.nameEn = document.getElementById("editNameEn").value;
    vtuber.nameJa = document.getElementById("editNameJa").value;
    vtuber.agency = document.getElementById("editAgency").value;
    vtuber.image = document.getElementById("editImage").value;
    vtuber.youtube = document.getElementById("editYoutube").value;
    vtuber.twitch = document.getElementById("editTwitch").value;
    vtuber.descriptionEn = document.getElementById("editDescriptionEn").value;
    vtuber.descriptionJa = document.getElementById("editDescriptionJa").value;

    vtuber.tags = document.getElementById("editTags").value
        .split(",")
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== "");

    saveCustomVTubers();
    saveVTuberEdits();
    closeEditModal();
    renderCards();
}

function closeEditModal() {
    const modal = document.querySelector(".edit-modal");
    if (modal) {
        modal.remove();
    }
}
function saveVTuberEdits() {
    const edits = {};

    vtubers.forEach(vtuber => {
        edits[vtuber.id] = {
    nameEn: vtuber.nameEn,
    nameJa: vtuber.nameJa,
    agency: vtuber.agency,
    descriptionEn: vtuber.descriptionEn,
    descriptionJa: vtuber.descriptionJa,
    image: vtuber.image,
    youtube: vtuber.youtube,
    twitch: vtuber.twitch,
    tags: vtuber.tags
    };
    });

    localStorage.setItem("vtuberEdits", JSON.stringify(edits));
}
async function checkYoutubeLiveStatus() {

    for (const vtuber of vtubers) {

        const channelId =
            vtuber.channelId || vtuber.id;

        if (!channelId.startsWith("UC")) {
            continue;
        }

        try {

            const response = await fetch(
                `/api/youtube-live?channelId=${channelId}`
            );

            const data = await response.json();

            liveStatus[vtuber.id] = data.isLive;
            liveTitles[vtuber.id] = data.videoTitle || "";
            if (data.isLive && !previousLiveStatus[vtuber.id]) {
            showLiveNotification(vtuber);
            }

            previousLiveStatus[vtuber.id] = data.isLive;

            console.log(
                `${vtuber.nameEn}: ${data.isLive ? "LIVE" : "OFFLINE"}`
            );

        } catch (error) {

            console.error(
                `Failed to check ${vtuber.nameEn}`,
                error
            );

        }
        localStorage.setItem("previousLiveStatus", JSON.stringify(previousLiveStatus));
    }
localStorage.setItem("liveStatus", JSON.stringify(liveStatus));
localStorage.setItem("liveTitles", JSON.stringify(liveTitles));

sortVTubersByLiveStatus();
renderCards();
updateLiveCount();
updateLiveNowSection();


}
async function addFromYoutubeUrl() {
    const url = document.getElementById("youtubeUrlInput").value;

    if (!url) {
        alert("Enter a YouTube URL");
        return;
    }

    try {
        const response = await fetch(
            `/api/channel-by-url?url=${encodeURIComponent(url)}`
        );

        const data = await response.json();

        console.log("Channel data:", data);

        if (!data.id) {
            alert("Failed to get channel data");
            return;
        }

        const newVTuber = {
            id: data.id,
            channelId: data.id,
            nameEn: data.name,
            nameJa: data.name,
            agency: "Unknown",
            descriptionEn: "Added from YouTube",
            descriptionJa: "YouTubeから追加",
            image: data.image,
            youtube: data.youtube,
            twitch: "",
            tags: []
        };

        vtubers.push(newVTuber);

        saveCustomVTubers();

        console.log("All VTubers:", vtubers);
        console.log("Saved:", JSON.parse(localStorage.getItem("customVTubers")));

        renderCards();
        updateFavoriteCount();

        document.getElementById("youtubeUrlInput").value = "";

        alert("VTuber added!");
    } catch (error) {
        console.error(error);
        alert("Failed to add VTuber");
    }
}
function sortVTubersByLiveStatus() {
    vtubers.sort((a, b) => {
        const aLive = liveStatus[a.id] ? 1 : 0;
        const bLive = liveStatus[b.id] ? 1 : 0;

        return bLive - aLive;
    });
}
function showLiveNotification(vtuber) {
    alert(`🔔 ${vtuber.nameJa} started streaming!`);
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch(error => console.error("Service Worker error:", error));
}
