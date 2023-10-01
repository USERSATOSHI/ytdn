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
