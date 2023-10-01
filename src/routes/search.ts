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
        const vid = video;
        const title = vid.title;
        const id = vid.id;
        const url = `https://www.youtube.com/watch?v=${id}`;

        return `${title}: <a href="/info?url=${url}">info</a> | <a href="/video?url=${url}">video</a> | <a href="/audio?url=${url}">audio</a>`;
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
        const vid = video;
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
