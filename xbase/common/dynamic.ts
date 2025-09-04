export type UnitName = "usd" | "eur" | "gbp" | "usdt" | "toman" | "aud" | "tron" | "usdc" | "cad" | "rial"


type LLMChatCompletionInputType = {
    messages: Array<{ role: "system" | "user", content: string }>,
    temperature?: number,
    top_p?: number,
    max_tokens?: number,
    presence_penalty?: number,
    frequency_penalty?: number
}

type LLMImageClassifierInputType = {
    image_url: string,
    classes: Array<string>,
    temperature?: number,
    top_p?: number,
    max_tokens?: number,
    presence_penalty?: number,
    frequency_penalty?: number
}


declare global {
    interface NX {
        "agent":
        {
            translate: (specs: {
                from: string, text: string,
                to: string, engine: "google" | "microsoft" | "yandex"
            }) =>
                Promise<string>,

            llms: {
                "chatCompletion": {
                    gpt35: (specs: { prompts: Array<string> }) => Promise<string>,
                    gpt4o: (specs: { prompts: Array<string> }) => Promise<string>,
                    gemma34BQ8: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: {} }>
                },
                "imagelassifier": {
                    gemma34BQ8: (specs: LLMImageClassifierInputType) => Promise<{ code: number, classes: Array<string>, usage: {} }>
                }
            },


            sms: {
                confirm: (phone: string, code: string) => Promise<{ code: number, msg: string }>,
                modem: (phone, text) => Promise<any>
            },
            email: {
                send: (to: string, subject: string, message) => Promise<{ code: number, msg: string }>,
            },
            poster: {
                make: (specs: {
                    bgurl: string,
                    iconurl: string,
                    iconsize: "large" | "small",
                    service: string,
                    light: string,
                    lightcolor: string,
                    maintext: string,
                    focus: string,
                    focuscolor: string,
                    subtext: string,
                    technologies: Array<"c" | "cpp" | "cs" | "python" | "pytorch" | "tf" | "matlab" | "js" | "node" | "java">,
                    lang: "fa" | "en",
                }) => Promise<{ code: number, imageurl?: string }>
            },

            ssh: {
                ping: () => Promise<any>,
                connect: (specs: {
                    host: string,
                    port: number, username: string, password: string, salt: string, timeout?: number
                })
                    => Promise<{ code: number, channelid: string }>,
                disconnect: (specs: { channelid: string }) => Promise<{ code: number }>,
                command: (specs: { channelid: string, input: string }) => Promise<{ code: number }>,

            }
        }

    } var nexus: NX
}

export const Loopez = () => {
    if (!global.nexus)
        return
    if (!global.nexus.agent || !global.nexus.agent.llms) {
        global.nexus.agent = { llms: { chatCompletion: {}, imagelassifier: {} } } as any
    }

    if (!global.nexus.agent.poster) {
        global.nexus.agent.poster = {} as any
        global.nexus.agent.poster.make = async (specs) => {

            let technologies = {}
            for (let tech of specs.technologies) {
                technologies[tech] = true
            }
            let json = await nexus.api({
                app: "eposter", cmd: "make", body: {
                    access: "icusdboe39c8b",
                    api: "make",
                    bgurl: specs.bgurl,
                    iconurl: specs.iconurl,
                    icontop: specs.iconsize == "large" ? "100px" : "150px",
                    iconheight: specs.iconsize == "large" ? "300px" : "160px",
                    service: specs.service,
                    light: specs.light,
                    lightcolor: specs.lightcolor,
                    maintext: specs.maintext,
                    focus: specs.focus,
                    focuscolor: specs.focuscolor,
                    subtext: specs.subtext,
                    technologies,
                    lang: "fa",
                }
            })

            return json
        }
    }

    if (!global.nexus.agent.translate) {
        global.nexus.agent.translate = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "translate-" + specs.engine, body: {
                    source: specs.from, target: specs.to, text: specs.text
                }
            })
            if (json.status == 200) {
                return json.result
            }
            return null
        }
    }


    if (!global.nexus.agent.translate) {
        global.nexus.agent.translate = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "translate-" + specs.engine, body: {
                    source: specs.from, target: specs.to, text: specs.text
                }
            })
            if (json.status == 200) {
                return json.result
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.chatCompletion.gemma34BQ8) {
        global.nexus.agent.llms.chatCompletion.gemma34BQ8 = async (specs) => {
            let json = await nexus.api({ app: "egemma3x4bxq8", cmd: "completions", body: specs })
            if (json.code == 200) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.imagelassifier.gemma34BQ8) {
        global.nexus.agent.llms.chatCompletion.gemma34BQ8 = async (specs) => {
            let json = await nexus.api({ app: "egemma3x4bxq8", cmd: "imageclassify", body: specs })
            if (json.code == 200) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.chatCompletion.gpt4o) {
        global.nexus.agent.llms.chatCompletion.gpt4o = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt35", body: {
                    prompts: specs.prompts,
                }
            })
            if (json.status == 200) {
                return json.result[0]
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.chatCompletion.gpt35) {
        global.nexus.agent.llms.chatCompletion.gpt35 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt35", body: {
                    prompts: specs.prompts,
                }
            })
            if (json.status == 200) {
                return json.result[0]
            }
            return null
        }
    }

    if (!global.nexus.agent.email) {
        global.nexus.agent.email = {} as any
        global.nexus.agent.email.send = async (to, subject, message) => {
            let json = await nexus.api({
                app: "eagents", cmd: "email-send", body: {
                    to, subject, message
                }
            })
            return json
        }
    }
    if (!global.nexus.agent.sms) {
        global.nexus.agent.sms = {} as any
        global.nexus.agent.sms.confirm = async (phone, code) => {
            let json = await nexus.api({
                app: "eagents", cmd: "sms-confirm", body: {
                    phone, code
                }
            })

            return json
        }

        global.nexus.agent.sms.modem = async (phone, text) => {
            let json = await nexus.api({
                app: "eagents", cmd: "sendsms-modem",
                body: {
                    phone, text
                }
            })

            return json
        }
    }


    if (!global.nexus.agent.ssh) {
        global.nexus.agent.ssh = {
            ping: async () => {
                let json = await nexus.api({
                    app: "essh", cmd: "ping",
                })
                return json;
            },
            connect: async (specs) => {
                let json = await nexus.api({
                    app: "essh", cmd: "connect",
                    body: {
                        host: specs.host,
                        port: specs.port,
                        username: specs.username,
                        password: specs.password,
                        salt: specs.salt,
                        timeout: specs.timeout || 300,
                    },
                })
                return json
            },
            disconnect: async (specs) => {
                let json = await nexus.api({
                    app: "essh", cmd: "disconnect",
                    body: {
                        channelid: specs.channelid,
                    },
                })
                return json;
            },
            command: async (specs) => {
                let json = await nexus.api({
                    app: "essh", cmd: "command",
                    body: {
                        channelid: specs.channelid,
                        command: specs.input
                    },
                })
                return json
            },
        }
    }
}