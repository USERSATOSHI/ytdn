import { Elysia } from "elysia";
import yt from "../yt";
import { getId } from "../util";
import { mkdirSync,rmSync } from "node:fs";
import * as yti from "youtubei.js"


const app = new Elysia({
    prefix: "playlist",
});

// app.group("video", (app) => {
//     .get("/", async ({ query: {url} }) => {
//         if(!url) return "No url provided";
//         const id = getId(url);
//         const playlistInfo = await yt.getPlaylist(id);
//         const videos = playlistInfo.videos;

//         mkdirSync(`./${id}`);

//         for(const video of videos) {
//             if(!video.as(yti.YTNodes.PlaylistVideo).is_playable) continue;

//             const stream = await yt.download(video.id);

//             Bun.write(`./${id}/${video.id}.mp4`, new Response(stream,{
//                 headers: {
//                     "Content-Type": "video/mp4",
//                 }
//             }));
//         }


//     })
// })
