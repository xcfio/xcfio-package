import {
    ClientEvents,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    ButtonInteraction,
    ModalSubmitInteraction,
    AnySelectMenuInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
    RepliableInteraction,
    Interaction,
    Client,
    ClientOptions
} from "discord.js"

export type Options<CommandOptions = {}> = {
    token: string
    webhook: string
    options: ClientOptions

    events: EventsObject | ((client: Client) => Promise<boolean> | boolean)
    interaction:
        | InteractionObject<CommandOptions>
        | ((interaction: Interaction, option: Required<Options<CommandOptions>>) => Promise<boolean> | boolean)

    validator?: (interaction: Interaction, option?: CommandOptions) => Promise<boolean> | boolean
    error?: (error: NonNullable<Error>, origin?: any, type?: string) => Promise<any> | any
    int_error?: (interaction: RepliableInteraction, error?: Error) => Promise<any> | any
}

export type EventsObject = Map<keyof ClientEvents, (...arg: any) => any>
export type InteractionObject<CommandOptions> = {
    ChatInput: Array<CommandObject<RESTPostAPIChatInputApplicationCommandsJSONBody, CommandOptions>>
    Context: Array<CommandObject<RESTPostAPIContextMenuApplicationCommandsJSONBody, CommandOptions>>
    Button: Map<string, (arg: ButtonInteraction) => any>
    Modal: Map<string, (arg: ModalSubmitInteraction) => any>
    SelectMenu: Map<string, (arg: AnySelectMenuInteraction) => any>
}

export type CommandObject<CommandType extends RESTPostAPIApplicationCommandsJSONBody, options> = {
    option?: options
    data: CommandType
    run: (arg: RepliableInteraction) => any
}
