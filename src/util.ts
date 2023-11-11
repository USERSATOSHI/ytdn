import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import yt from "./yt";
import ffmpeg from "fluent-ffmpeg";
import { Utils } from "youtubei.js";
export const getId = (url: string) => {
    // handle youtube.com/watch?v=ID
    // handle youtu.be/ID
    // handle youtube.com/embed/ID
    // handle youtube.com/v/ID
    // handle youtube.com/shorts/ID
    // handle youtube.com/playlist?list=ID

    const parts = url.split("/");
    const id = parts[parts.length - 1];
    return id.split("?")[1].split("=")[1];
};


export const getVideo = async (id:string,path:string)  => {
      const videostream = await yt.download(id, {
          type: "video",
          quality: "best",
      });

      const audiostream = await yt.download(id, {
          type: "audio",
          quality: "best",
      });

      const res = await new Promise<void>(async (resolve, reject) => {
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
              .format("mp4")
              .output(path)
              .on("end", function () {
                  // console.log("Finished processing");
                  console.log(`downloaded ${id}`);
                  unlink(`./temp/${id}.mp4`);
                  unlink(`./temp/${id}.mp3`);
                resolve();
              })
              .on("error", function (err) {
                  console.error(err);
              })
              .run();
      });

      return res;
}

export const getAudio = async (id:string,path:string)  => {
    const audiostream = await yt.download(id, {
        type: "audio",
        quality: "best",
    });

    const aw = createWriteStream(path);
    // @ts-ignore
    for await (const chunk of Utils.streamToIterable(audiostream)) {
        aw.write(chunk);
    }
    console.log(`downloaded ${id}`);
    return;
}