import { Elysia } from "elysia";
import video from "./routes/video";
import audio from "./routes/audio";
import info from "./routes/info";
import search from "./routes/search";
import playlist from "./routes/playlist";
const app = new Elysia();

app.get(
    "/",
    () => `
    Youtube Downloader API

    Endpoints:
    / - Home
    /video - Download video - /video?url=video_url

    /audio - Download audio - /audio?url=video_url

    /info - Get info - /info?url=video_url

    /search - Search videos - /search?query=search_query
    /search/html - Search videos (html) - /search/html?query=search_query

    github: https://github.com/usersatoshi/ytdn
    cli: https://github.com/usersatoshi/ytdn-cli
`,
)
    .use(video)
    .use(audio)
    .use(info)
    .use(search)
    .use(playlist)
    .listen(3000, () => console.log("Listening on port 3000"));



