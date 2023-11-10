import { Elysia } from "elysia";
import yt from "../yt";
import * as yti from "youtubei.js";

const app = new Elysia({
    prefix: "search",
});

app.get("/html", async ({ query: { query } }) => {
    if (!query) return "No query provided";
    const results = await yt.search(query as string);
    const links = results.videos.map((video) => {
        const vid = video as yti.YTNodes.Video;
        const title = vid.title;
        const id = vid.id;
        // console.log(vid);
        const author = vid.author?.name ?? "N/A";
        const img = vid.thumbnails[0].url;
        const url = `https://www.youtube.com/watch?v=${id}`;

        return `
        <div class="data">
        <img src=${img} alt="img" />
        ${title} || ${author} : <a href="/info?url=${url}">info</a> | <a href="/video?url=${url}">video</a> | <a href="/audio?url=${url}">audio</a>
        </div>`;
    });

    return new Response(
        `
        <style>
            body {
                font-family: sans-serif;
                background-color: #000;
                color: #fff;
            }

            a {
                color: #8700ff;
                text-decoration: none;
            }
            .data {
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 100%;
              justify-content: space-around;
              
            }

            .data img {
                height: 100px;
            }
            </style>
        ${links.join("<br> <br>")}`,
        {
            headers: {
                "Content-Type": "text/html",
            },
        },
    );
}).get("/", async ({ query: { query }, request }) => {
    if (!query) return "No query provided";
    const results = await yt.search(query as string);
    const host = request.headers.get("host");
    const links = results.videos.map((video) => {
        const vid = video as yti.YTNodes.Video;
        const title = vid.title;
        const id = vid.id;
        const url = `https://www.youtube.com/watch?v=${id}`;

        return {
            title,
            info: `https://${host}/info?url=${url}`,
            video: `https://${host}/video?url=${url}`,
            audio: `https://${host}/audio?url=${url}`,
        };
    });

    return links;
});

export default app;
