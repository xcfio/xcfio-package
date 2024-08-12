import { Client } from "discord.js"
import { EventsObject } from "./type"

export async function Events(client: Client, events: EventsObject) {
    for (const [name, callback] of events) {
        if (typeof callback === "function") {
            client.on(name, (...arg) => callback(...arg, client))
        } else {
            console.trace(`${name} is not a function`)
        }
    }
}
