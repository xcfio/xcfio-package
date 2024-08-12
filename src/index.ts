import { Client } from "discord.js"
import { Options } from "./type"
import { Events } from "./event"
import { Interaction } from "./interaction"

export * from "./event"
export * from "./interaction"
export * from "./type"

export function client<T>(opt: Options<T>) {
    const option: Required<Options<T>> = {
        ...opt,
        validator: opt.validator ?? (() => true),
        error: opt.error ?? ((error, origin) => console.trace(error, origin)),
        int_error: opt.int_error ?? ((int) => int.reply({ content: "An unknown error happened", ephemeral: true }))
    }

    const client = new Client(opt.options)
    client.login(option.token)

    process.on("uncaughtException", (err: Error, origin) => error("Uncaught Exception", err, origin))
    process.on("unhandledRejection", (reason: Error, origin) => error("Unhandled Rejection", reason, origin))
    process.on("uncaughtExceptionMonitor", (err: Error, origin) => error("Uncaught Exception", err, origin))

    function error(type: string, error: Error, origin: any) {
        if (error.message === "getaddrinfo ENOTFOUND discord.com") return console.log(error.stack)
        if (error.message === "getaddrinfo EAI_AGAIN discord.com") return console.log(error.stack)
        option.error(error, origin, type)
    }

    client.on("ready", (client) => {
        if (typeof option.events === "function") {
            option.events(client)
        } else {
            Events(client, option.events)
        }
    })

    client.on("interactionCreate", (interaction) => {
        if (typeof option.interaction === "function") {
            option.interaction(interaction, option)
        } else {
            Interaction<T>(interaction, option)
        }
    })

    return client
}
