import fetch from "node-fetch";

export async function sendToServer(type: string, payload?: unknown) {
    const response = await fetch("http://localhost:54321/message", {
        method: "POST",
        body: JSON.stringify({ type, payload }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    return await response.json();
}
