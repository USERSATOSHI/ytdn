import { Elysia } from "elysia";
import yt from "../yt";
import { Utils } from "youtubei.js";
import { getAudio, getId, getVideo } from "../util";
import { createWriteStream, existsSync, mkdirSync, rmSync } from "node:fs";
import { unlink } from "node:fs/promises";
import * as yti from "youtubei.js";
import tar from "tar";
import { rm } from "node:fs/promises";

const app = new Elysia({
    prefix: "playlist",
});

app.get("/video", async ({ query: { url } }) => {
    try {
        if (!url) return "No url provided";
        const id = getId(url);
        const playlistInfo = await yt.getPlaylist(id);
        const videos = playlistInfo.videos;
        if (existsSync(`./temp/${id}`)) {
            const tarr = tar.c(
                {
                    gzip: true,
                    cwd: `./temp/${id}`,
                },
                videos.map((v) => `./output_${v.id}.mp4`),
            );

            const writer = createWriteStream(`./temp/${id}.tar.gz`);
            // @ts-ignore
            tarr.pipe(writer);

            const res = await new Promise((resolve, reject) => {
                tarr.on("end", () => {
                    const reader = Bun.file(`./temp/${id}.tar.gz`)
                        .stream()
                        .getReader();
                    // const reader = Bun.file(`./temp/${id}.tar.gz`).stream().getReader();

                    const rS = new ReadableStream({
                        start(controller) {
                            return next();

                            async function next() {
                                const { done, value } = await reader.read();

                                if (done) {
                                    controller.close();
                                    console.log("done");
                                    unlink(`./temp/${id}.tar.gz`);
                                    rm(`./temp/${id}`, {
                                        recursive: true,
                                    });
                                    return;
                                }

                                controller.enqueue(value);
                                return next();
                            }
                        },
                    });

                    console.log("cached");

                    resolve(
                        new Response(rS, {
                            headers: {
                                "Content-Type": "application/x-gzip",
                                "Content-Disposition": `attachment; filename="${id}.tar.gz"`,
                            },
                        }),
                    );
                });
            });
            return res;
        } else {
            mkdirSync(`./temp/${id}`);

            const promises = [];

            for (const video of videos) {
                if (!video.as(yti.YTNodes.PlaylistVideo).is_playable) continue;

                promises.push(
                    getVideo(video.id, `./temp/${id}/output_${video.id}.mp4`),
                );
            }

            await Promise.all(promises);

            const tarr = tar.c(
                {
                    gzip: true,
                    cwd: `./temp/${id}`,
                },
                videos.map((v) => `./output_${v.id}.mp4`),
            );

            const writer = createWriteStream(`./temp/${id}.tar.gz`);
            // @ts-ignore
            tarr.pipe(writer);

            const res = await new Promise((resolve, reject) => {
                tarr.on("end", () => {
                    const reader = Bun.file(`./temp/${id}.tar.gz`)
                        .stream()
                        .getReader();
                    // const reader = Bun.file(`./temp/${id}.tar.gz`).stream().getReader();

                    const rS = new ReadableStream({
                        start(controller) {
                            return next();

                            async function next() {
                                const { done, value } = await reader.read();

                                if (done) {
                                    controller.close();
                                    console.log("done");
                                    unlink(`./temp/${id}.tar.gz`);
                                    rm(`./temp/${id}`, {
                                        recursive: true,
                                    });
                                    return;
                                }

                                controller.enqueue(value);
                                return next();
                            }
                        },
                    });

                    console.log("cached");

                    resolve(
                        new Response(rS, {
                            headers: {
                                "Content-Type": "application/x-gzip",
                                "Content-Disposition": `attachment; filename="${id}.tar.gz"`,
                            },
                        }),
                    );
                });
            });
            return res;
        }
    } catch (e) {
        console.error(e);
        return "e";
    }
}).get("/audio", async ({ query: { url } }) => {
    const id = getId(url);

    mkdirSync(`./temp/${id}`, {
        recursive: true,
    });

    const playlistInfo = await yt.getPlaylist(id);
    const videos = playlistInfo.videos;

    const promises = [];

    for (const video of videos) {
        if (!video.as(yti.YTNodes.PlaylistVideo).is_playable) continue;

        promises.push(
            getAudio(video.id, `./temp/${id}/output_${video.id}.mp3`),
        );
    }

    await Promise.all(promises);

    const tarr = tar.c(
        {
            gzip: true,
            cwd: `./temp/${id}`,
        },
        videos.map((v) => `./output_${v.id}.mp3`),
    );

    const writer = createWriteStream(`./temp/${id}.tar.gz`);
    // @ts-ignore
    tarr.pipe(writer, {
        end: true,
    });

    const res = await new Promise((resolve, reject) => {
        tarr.on("end", () => {
            const reader = Bun.file(`./temp/${id}.tar.gz`).stream().getReader();
            // const reader = Bun.file(`./temp/${id}.tar.gz`).stream().getReader();

            const rS = new ReadableStream({
                start(controller) {
                    return next();

                    async function next() {
                        const { done, value } = await reader.read();

                        if (done) {
                            controller.close();
                            console.log("done");
                            unlink(`./temp/${id}.tar.gz`);
                            rm(`./temp/${id}`, {
                                recursive: true,
                            });
                            return;
                        }

                        controller.enqueue(value);
                        return next();
                    }
                },
            });

            console.log("cached");

            resolve(
                new Response(rS, {
                    headers: {
                        "Content-Type": "application/x-gzip",
                        "Content-Disposition": `attachment; filename="${playlistInfo.info.title
                            ?.replaceAll('"', "'")
                            .replaceAll("/", "-")}.tar.gz"`,
                    },
                }),
            );
        });
    });

    return res;
});

export default app;
