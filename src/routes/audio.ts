import { Elysia, t } from "elysia";
import yt from "../yt";
import { getId } from "../util";
const app = new Elysia({
    prefix: "audio",
});

app.get("/", async ({ query: {url} }) => {
    if(!url) return "No url provided";
    const id = getId(url);
    const info = await yt.getBasicInfo(id);
    const stream = await yt.download(id, {
        client: "WEB",
        quality: "best",
        type: "audio",
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "audio/mp3",
            "Content-Disposition": `attachment; filename="${encodeURI(info.basic_info.title
                                                          ?.replaceAll('"', "'")
                                                          .replaceAll("/", "-"))}.mp3"`,
        },
    });
})
//@ts-ignore
.post("/", async ({ body: {url} }) => {
    if(!url) return "No url provided";
    const id = getId(url as string);
    const stream = await yt.download(id, {
        client: "WEB",
        quality: "best",
        type: "audio",
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "audio/mp3",
            "Content-Disposition": `attachment; filename="${id}.mp3"`,
        },
    });
});

export default app;
