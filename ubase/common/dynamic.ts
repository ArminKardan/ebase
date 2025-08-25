export type UnitName = "usd" | "eur" | "gbp" | "usdt" | "toman" | "aud" | "tron" | "usdc" | "cad" | "rial"

declare global {
    interface NX {
        "agent":
        {
            translate: (specs: {
                from: string, text: string,
                to: string, engine: "google" | "microsoft" | "yandex"
            }) =>
                Promise<string>,

            gpt35: (specs: {
                prompts: Array<string>,
            }) =>
                Promise<string>

            gpt4o: (specs: {
                prompts: Array<string>,
            }) =>
                Promise<string>,

            sms: {
                confirm: (phone: string, code: string) => Promise<any>,
                modem: (phone, text) => Promise<any>
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
    if (!global.nexus.agent) {
        global.nexus.agent = {} as any
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
                }, resource: "default", onlyowner: true
            })

            return json
        }
    }

    if (!global.nexus.agent.translate) {
        global.nexus.agent.translate = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "translate-" + specs.engine, body: {
                    source: specs.from, target: specs.to, text: specs.text
                }, resource: "default", onlyowner: true
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
                }, resource: "default", onlyowner: true
            })
            if (json.status == 200) {
                return json.result
            }
            return null
        }
    }

    if (!global.nexus.agent.gpt35) {
        global.nexus.agent.gpt35 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt35", body: {
                    prompts: specs.prompts,
                }, resource: "default", onlyowner: true
            })
            if (json.status == 200) {
                return json.result[0]
            }
            return null
        }
    }


    if (!global.nexus.agent.gpt4o) {
        global.nexus.agent.gpt4o = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt4o", body: {
                    prompts: specs.prompts,
                }, resource: "default", onlyowner: true
            })
            if (json.status == 200) {
                return json.result[0]
            }
            return null
        }
    }


    if (!global.nexus.agent.sms) {
        global.nexus.agent.sms = {} as any
        global.nexus.agent.sms.confirm = async (phone, code) => {
            let json = await nexus.api({
                app: "eagents", cmd: "sms-confirm", body: {
                    phone, code
                }, resource: "default", onlyowner: true
            })

            return json
        }

        global.nexus.agent.sms.modem = async (phone, text) => {
            let json = await nexus.api({
                app: "esms", cmd: "send", body: {
                    phone, text
                }, resource: "default", onlyowner: true
            })

            return json
        }
    }


    if (!global.nexus.agent.ssh) {
        global.nexus.agent.ssh = {
            ping: async () => {
                let json = await nexus.api({
                    app: "essh", cmd: "ping", resource: "default", onlyowner: true
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
                    }, resource: "default", onlyowner: true
                })
                return json
            },
            disconnect: async (specs) => {
                let json = await nexus.api({
                    app: "essh", cmd: "disconnect",
                    body: {
                        channelid: specs.channelid,
                    }, resource: "default", onlyowner: true
                })
                return json;
            },
            command: async (specs) => {
                let json = await nexus.api({
                    app: "essh", cmd: "command",
                    body: {
                        channelid: specs.channelid,
                        command: specs.input
                    }, resource: "default", onlyowner: true
                })
                return json
            },
        }
    }
}