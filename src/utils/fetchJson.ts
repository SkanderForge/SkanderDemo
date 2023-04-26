export async function fetchJson(url: string) {
    return await fetch(url).then((res) => res.json()).catch(err => {
        console.log("Error fetching data from the API!", err);
    });
}
