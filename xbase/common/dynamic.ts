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

type LLMCustomInputType = {
    policy:
    {
        name: string,
        worksfor: string,
        context: string,
        commands: Array<string>,
        tone: "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "angry"
    },
    input: string
}


type LLMTextClassificationInput = { categories: Array<{ key: string, trigger: string }>, memory: Array<string>, inputtext: string }

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
                "toneRecognition": {
                    light: (input: string) => Promise<{ code: number, tone: "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "offensive" }>,
                    v2: (input: string) => Promise<{ code: number, tone: "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "offensive" }>,
                    v3: (input: string) => Promise<{ code: number, tone: "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "offensive" }>,
                },
                "chatCompletion": {
                    gpt4: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    gpt5: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    gemma34BQ8: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    gemma312BQ4: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    oss20B: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    oss36B: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                    oss120B: (specs: LLMChatCompletionInputType) => Promise<{ code: number, response: string, usage: any }>,
                },
                "customAnswer": {
                    gpt4: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    gpt5: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    gemma34BQ8: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    gemma312BQ4: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    oss20B: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    oss36B: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                    oss120B: (specs: LLMCustomInputType) => Promise<{ code: number, answer: string, usage: any }>,
                },
                "fillStructure": {
                    light: (specs: { schema: { [key in string]: any }, input: string }) => Promise<{ code: number, data: any }>,
                    v2: (specs: { schema: { [key in string]: any }, input: string }) => Promise<{ code: number, data: any }>,
                    v3: (specs: { schema: { [key in string]: any }, input: string }) => Promise<{ code: number, data: any }>,
                },
                "textClassifier": {
                    light: (specs: LLMTextClassificationInput) => Promise<{ code: number, categories: Array<string> }>,
                    v2: (specs: LLMTextClassificationInput) => Promise<{ code: number, categories: Array<string> }>,
                    v3: (specs: LLMTextClassificationInput) => Promise<{ code: number, categories: Array<string> }>,
                },
                "dataBaseAnswer": {
                    light: (specs: { data: any, input: string }) => Promise<{ code: number, answer: string }>,
                    v2: (specs: { data: any, input: string }) => Promise<{ code: number, answer: string }>,
                    v3: (specs: { data: any, input: string }) => Promise<{ code: number, answer: string }>,
                },
                "imageClassifier": {
                    gemma34BQ8: (specs: LLMImageClassifierInputType) => Promise<{ code: number, classes: Array<string>, usage: any }>
                    gemma312BQ4: (specs: LLMImageClassifierInputType) => Promise<{ code: number, classes: Array<string>, usage: any }>
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
        global.nexus.agent = {
            llms: {
                chatCompletion: {}, dataBaseAnswer: {}, customAnswer: {},
                imageClassifier: {}, textClassifier: {}, fillStructure: {}, toneRecognition: {}
            }
        } as any
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

    if (!global.nexus.agent.llms.imageClassifier.gemma34BQ8) {
        global.nexus.agent.llms.imageClassifier.gemma34BQ8 = async (specs) => {
            let json = await nexus.api({ app: "egemma3x4bxq8", cmd: "imageclassify", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.dataBaseAnswer.light) {
        global.nexus.agent.llms.dataBaseAnswer.light = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "data-based-answer-light", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.dataBaseAnswer.v2) {
        global.nexus.agent.llms.dataBaseAnswer.v2 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "data-based-answer-v2", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.dataBaseAnswer.v3) {
        global.nexus.agent.llms.dataBaseAnswer.v3 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "data-based-answer-v3", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }



    if (!global.nexus.agent.llms.fillStructure.light) {
        global.nexus.agent.llms.fillStructure.light = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "fill-by-schema-light", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.fillStructure.v2) {
        global.nexus.agent.llms.fillStructure.v2 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "fill-by-schema-v2", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.fillStructure.v3) {
        global.nexus.agent.llms.fillStructure.v3 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "fill-by-schema-v3", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }




    if (!global.nexus.agent.llms.toneRecognition.light) {
        global.nexus.agent.llms.toneRecognition.light = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-tonerecognition-light", body: { input: specs } })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.toneRecognition.v2) {
        global.nexus.agent.llms.toneRecognition.v2 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-tonerecognition-v2", body: { input: specs } })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.toneRecognition.v3) {
        global.nexus.agent.llms.toneRecognition.v3 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-tonerecognition-v3", body: { input: specs } })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }




    if (!global.nexus.agent.llms.textClassifier.light) {
        global.nexus.agent.llms.textClassifier.light = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-classify-light", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.textClassifier.v2) {
        global.nexus.agent.llms.textClassifier.v2 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-classify-v2", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.textClassifier.v3) {
        global.nexus.agent.llms.textClassifier.v3 = async (specs) => {
            let json = await nexus.api({ app: "eagents", cmd: "text-classify-v3", body: specs })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }



    if (!global.nexus.agent.llms.chatCompletion.gemma34BQ8) {
        global.nexus.agent.llms.chatCompletion.gemma34BQ8 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gemma34b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.chatCompletion.gemma312BQ4) {
        global.nexus.agent.llms.chatCompletion.gemma312BQ4 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gemma312b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.chatCompletion.oss20B) {
        global.nexus.agent.llms.chatCompletion.oss20B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "oss20b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.chatCompletion.oss36B) {
        global.nexus.agent.llms.chatCompletion.oss36B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "oss36b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.chatCompletion.oss120B) {
        global.nexus.agent.llms.chatCompletion.oss120B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "oss120b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.chatCompletion.gpt5) {
        global.nexus.agent.llms.chatCompletion.gpt5 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt5", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.chatCompletion.gpt4) {
        global.nexus.agent.llms.chatCompletion.gpt4 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "gpt4", body: specs
            })

            if (json.code == 0) {
                return json
            }
            return null
        }
    }






    if (!global.nexus.agent.llms.customAnswer.gemma34BQ8) {
        global.nexus.agent.llms.customAnswer.gemma34BQ8 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-gemma34b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.customAnswer.gemma312BQ4) {
        global.nexus.agent.llms.customAnswer.gemma312BQ4 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-gemma312b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.customAnswer.oss20B) {
        global.nexus.agent.llms.customAnswer.oss20B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-oss20b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.customAnswer.oss36B) {
        global.nexus.agent.llms.customAnswer.oss36B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-oss36b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.customAnswer.oss120B) {
        global.nexus.agent.llms.customAnswer.oss120B = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-oss120b", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }


    if (!global.nexus.agent.llms.customAnswer.gpt5) {
        global.nexus.agent.llms.customAnswer.gpt5 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-gpt5", body: specs
            })
            if (json.code == 0) {
                return json
            }
            return null
        }
    }

    if (!global.nexus.agent.llms.customAnswer.gpt4) {
        global.nexus.agent.llms.customAnswer.gpt4 = async (specs) => {
            let json = await nexus.api({
                app: "eagents", cmd: "custom-gpt4", body: specs
            })

            if (json.code == 0) {
                return json
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