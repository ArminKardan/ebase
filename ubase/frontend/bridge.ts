import crossstyles from "@/styles/crossstyles";
import SerialGenerator from "./components/qecomps/SerialGenerator";
declare global {
    var bridge: {
        send: (data: any) => Promise<any>
    }

    type NexusReceiveType = {
        fromjid: string,
        app: string,
        uid: string,
        resource: string,
        role: "owner" | "partner" | "user",
        body: string,
        itsme: boolean,
        itsbro: boolean,
        channel: string
    }

    type NexusOnReceiveType = {
        fromjid: string,
        app: string,
        uid: string,
        resource: string,
        role: "owner" | "partner" | "user",
        body: { [key: string]: any },
        itsme: boolean,
        itsbro: boolean,
    }

    interface NX {
        subscribe: (channel: string) => void,
        unsubscribe: (channel: string) => void,
        channels: Set<string>,
        msgreceiver: (specs: NexusReceiveType) => void,
        connected: boolean,
        on: {
            direct: (cb: (specs: NexusOnReceiveType) => Promise<any>) => string,
            channel: (channelname: string, cb: (specs: NexusOnReceiveType) => Promise<any>) => string,
        },
        clearon: (cbid: string) => void,
        api: (specs: {
            app: string,
            cmd: string,
            body?: any,
            onlymine?: boolean,
            onlyowner?: boolean,
            resource?: string,
            prioritize_mine?: boolean
            jid?: string,
        }
        ) => Promise<any>,
        direct: (specs: {
            app: string,
            body: string,
            onlymine?: boolean,
            onlyowner?: boolean,
            resource?: string,
            prioritize_mine?: boolean
            jid?: string,
        }) => Promise<any>,
        sendtojid: (jid: string, body: string) => Promise<any>,
        sendtochannel: (channel: string, body: string) => Promise<any>,

    }
    var nexus: NX
    var myjid: string
}
export const init = () => {
    die()
    global.mcb = {}
    window.addEventListener('message', async (event) => {
        try {
            let data = QSON.parse(event.data)


            if (data.mid) {
                let mid = data.mid
                delete data.mid
                global.mcb[mid]?.(data)
            }
        } catch { }
    })

}

export const die = () => {
    window["removeAllMessageListeners"]();
}

export const send = (data) => {
    let mid = SerialGenerator(6)
    let rp = new Promise(r => {
        global.mcb[mid] = (resp) => {
            r(resp)
        }
    })
    window.parent.postMessage(QSON.stringify({ ...data, mid }), "*",);
    return rp as any
}

