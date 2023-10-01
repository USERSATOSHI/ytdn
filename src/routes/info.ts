import { Elysia } from "elysia";
import yt from "../yt";
import { getId } from "../util";
const app = new Elysia({
    prefix: "info",
});

app.get("/", async ({ query: {url} }) => {
    if(!url) return "No url provided";
    const id = getId(url);
    const info = await yt.getBasicInfo(id);
    return info.basic_info;
 });

export default app;