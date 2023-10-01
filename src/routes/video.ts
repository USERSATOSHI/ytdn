import { Elysia, t } from "elysia";
import yt from "../yt";
import { getId } from "../util";
const app = new Elysia({
    prefix: "video",
});

app.get("/", async ({ query: {url} }) => {
    if(!url) return "No url provided";
    const id = getId(url);
    const stream = await yt.download(id, {
        client: "WEB",
        quality: "best",
        type: "video+audio",
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="${id}.mp4"`,
        },
    });
})
.post("/", async ({ body: {url} }) => {
    if(!url) return "No url provided";
    const id = getId(url as string);
    const stream = await yt.download(id, {
        client: "WEB",
        quality: "best",
        type: "video+audio",
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="${id}.mp4"`,
        },
    });
})


export default app;