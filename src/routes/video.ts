import { Elysia } from "elysia";
import yt from "../yt";
import { Utils } from "youtubei.js";
import { getId } from "../util";
const app = new Elysia({
    prefix: "video",
});

import ffmpeg from "fluent-ffmpeg";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";

app.get("/", async ({ query: { url } }) => {
    if (!url) return "No url provided";
    const id = getId(url);
    try {
        const info = await yt.getBasicInfo(id);
        const videostream = await yt.download(id, {
            type: "video",
            quality: "best",
        });

        const audiostream = await yt.download(id, {
            type: "audio",
            quality: "best",
        });

        const res = await new Promise(async (resolve, reject) => {
            const vw = createWriteStream(`./temp/${id}.mp4`);
            // @ts-ignore
            for await (const chunk of Utils.streamToIterable(videostream)) {
                vw.write(chunk);
            }

            const aw = createWriteStream(`./temp/${id}.mp3`);
            // @ts-ignore
            for await (const chunk of Utils.streamToIterable(audiostream)) {
                aw.write(chunk);
            }

            ffmpeg()
                .input(`./temp/${id}.mp4`)
                .input(`./temp/${id}.mp3`)
                .outputOptions(["-c:v copy", "-c:a aac"])
                // add metaData
                // .outputOptions([
                //     `-metadata`,
                //     `title="${info.basic_info.title
                //         ?.replaceAll('"', "'")
                //         .replaceAll("/", "-")}"`,
                //     `-metadata`,
                //     `thumbnail="${info.basic_info.thumbnail?.[0].url}"`,
                // ])
                .format("mp4")
                .output(`./temp/output_${id}.mp4`)

                .on("end", function () {
                    // console.log("Finished processing");

                    const stream = Bun.file(`./temp/output_${id}.mp4`)
                        .stream()
                        .getReader();

                    const rS = new ReadableStream({
                        start(controller) {
                            return next();

                            async function next() {
                                const { done, value } = await stream.read();

                                if (done) {
                                    controller.close();
                                    await unlink(`./temp/output_${id}.mp4`);
                                    await unlink(`./temp/${id}.mp4`);
                                    await unlink(`./temp/${id}.mp3`);
                                    return;
                                }

                                controller.enqueue(value);
                                return next();
                            }
                        },
                    });

                    const res = new Response(rS, {
                        headers: {
                            "Content-Type": "video/mp4",
                            "Content-Disposition": `attachment; filename="${encodeURI(info.basic_info.title
                                ?.replaceAll('"', "'")
                                .replaceAll("/", "-"))}.mp4"`,
                        },
                    });

                    resolve(res);
                })
                .on("error", function (err) {
                    console.error(err);
                })
                .run();
        });
        return res;
    } catch (e) {
        console.error(e);
        return "Error";
    }
})
    //@ts-ignore
    .post("/", async ({ body: { url } }) => {
        if (!url) return "No url provided";
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
    });

export default app;

