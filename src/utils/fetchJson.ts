import { setStatus, throwError } from "@/utils/store/loaderSlice";
import { store } from "@/utils/store/store";

export async function fetchJson(url: string, updateLoader:boolean = false,fileName = "") {
    let blob = undefined;
    let contentLength = 0;
    try {
        const response = await fetch(url) as Response;
        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status} (${response.statusText})`);
        }
        // @ts-ignore
        contentLength = +response.headers.get("Content-Length");
        blob = await response.blob();
        const chunksAll = await blob.arrayBuffer();
        const result = new TextDecoder("utf-8").decode(chunksAll);
        return JSON.parse(result);
    } catch (e: any) {
        store.dispatch(throwError(`${e}<br>Incorrect data requested?`));
        throw e;
    } finally {
        store.dispatch(setStatus(`Downloaded ${Math.floor((blob as Blob).size / 1024)}kb ${contentLength>0? `out of ${contentLength/1024}`:""} ${fileName ? ` for: ${fileName}` : ""}`));
    }
}