import pako from 'pako'
import SerialGenerator from '../components/qecomps/SerialGenerator';
import { SSRGlobal } from '../components/qecomps/Context';
import { ZType } from '../components/qecomps/Component';
import { Loopez } from '@/common/dynamic';


/**
 * Compress (deflate) a string and return it as a Base64-encoded string.
 * @param {string} input - The string to compress.
 * @returns {string} - Base64-encoded compressed string.
 */
function deflateToBase64(input) {
    // Convert the input string to a Uint8Array
    const inputData = new TextEncoder().encode(input);

    // Compress the data using pako
    const compressedData = pako.deflate(inputData);

    // Convert the compressed data to a Base64-encoded string
    const base64String = Buffer
        ? Buffer.from(compressedData).toString('base64') // Node.js
        : btoa(String.fromCharCode(...compressedData)); // Browser

    return base64String;
}

/**
 * Decompress (inflate) a Base64-encoded string and return the original string.
 * @param {string} base64String - The Base64-encoded compressed string.
 * @returns {string} - The decompressed string.
 */
function inflateFromBase64(base64String) {
    // Convert the Base64 string to a Uint8Array
    const compressedData = Buffer
        ? Uint8Array.from(Buffer.from(base64String, 'base64')) // Node.js
        : Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)); // Browser

    // Decompress the data using pako
    const decompressedData = pako.inflate(compressedData, { to: 'string' });

    return decompressedData;
}


export default async (z: ZType) => {

    global.xmppxml = window["XMPP"].xml
    global.xmppclient = window["XMPP"].client

    if (z.enduser?.uid && !global.xmpp) {
        if (!global.resource) {
            global.resource = "webxo" + Math.floor(Math.random() * 10000).toString()
        }
        global.xmppapicb = {}

        global.nexus = {
            agent: {} as any,
            subscribe: async (channel: string) => {
                await global.xmpp.send(global.xmppxml(
                    'presence',
                    { to: `${channel + "@conference.qepal.com"}/${global.xmpp_app}-${z.enduser.uid}-${global.xmpp_role}-${global.resource}`, type:"available" },
                ));
                global.nexus.channels.add(channel)
                return 0
            },
            unsubscribe: async (channel: string) => {
                global.xmpp.send(global.xmppxml(
                    'presence',
                    {
                        to: `${channel + "@conference.qepal.com"}`,
                        type: 'unavailable'
                    }
                ));
            },
            channels: new Set(),
            msgreceiver: () => { },
            connected: false,
            api: async (specs: {
                app: string,
                cmd: string,
                body?: any,
                onlymine?: boolean,
                onlyowner?: boolean,
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {

                let jid = specs.jid
                if (!jid) {
                    let json = await api("https://qepal.com/api/bridge/worker/findfreeresource",
                        {
                            app: specs.app,
                            secret: z.enduser.token,
                            onlymine: specs.onlymine,
                            onlyowner: specs.onlyowner,
                            resource: specs.resource,
                        })
                    let jids = json.jids
                    if (jids.length > 0) {
                        jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
                    }
                }

                if (!jid) {
                    console.error("x-nexus: no jid found.")
                }

                return new Promise(async resolve => {
                    let mid = SerialGenerator(10)

                    let msg = JSON.stringify({
                        mid,
                        api: specs.cmd,
                        ...(specs.body || {}),
                    })

                    msg = deflateToBase64(msg)

                    let c = setTimeout(() => {
                        resolve({ error: "timeout" })
                    }, 120 * 1000);

                    global.xmppapicb[mid] = {
                        mid,
                        cb: (ob) => { clearTimeout(c); resolve(ob); }
                    }

                    await global.xmpp.send(global.xmppxml(
                        "message",
                        { to: jid, type: "chat" }, // type: "chat" for one-to-one messages
                        global.xmppxml("body", {}, msg,
                        )))
                })

            },

            direct: async (specs: {
                app: string,
                body: string,
                onlymine?: boolean,
                onlyowner?: boolean,
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {
                let jid = specs.jid
                if (!jid) {
                    let json = await api("https://qepal.com/api/bridge/worker/findfreeresource",
                        {
                            app: specs.app,
                            secret: z.enduser.token,
                            onlymine: specs.onlymine,
                            onlyowner: specs.onlyowner,
                            resource: specs.resource,
                        })
                    let jids = json.jids
                    if (jids.length > 0) {
                        jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
                    }
                }

                if (!jid) {
                    console.error("nexus: no jid found.")
                }

                let bd = deflateToBase64(specs.body)
                await global.xmpp.send(global.xmppxml(
                    "message",
                    { to: jid, type: "chat" }, // type: "chat" for one-to-one messages
                    global.xmppxml("body", {}, bd,
                    )))
            },


            sendtojid: async (jid: string, body: string) => {
                let bd = deflateToBase64(body)
                await global.xmpp.send(global.xmppxml(
                    "message",
                    { to: jid, type: "chat" }, // type: "chat" for one-to-one messages
                    global.xmppxml("body", {}, bd,
                    )))
            },
            sendtochannel: async (channel: string, body: string) => {
                let bd = deflateToBase64(body)
                let subs = global.nexus.channels as Set<string>
                if (!subs.has(channel)) {

                    await global.nexus.subscribe(channel);
                    await sleep(500)
                }
                await global.xmpp.send(global.xmppxml(
                    "message",
                    {
                        to: `${channel}@conference.qepal.com`,
                        from: global.myjid,
                        type: "groupchat"
                    },
                    global.xmppxml("body", {}, bd,
                    )))
            },
        }

        Loopez();

        let json = await (await fetch("https://qepal.com/api/bridge/worker/service", {
            method: "POST",
            body: JSON.stringify({
                secret: z.enduser.token,
                image: "/files/icons/userv.webp",
                public: false
            })
        })).json()

        if (json.code != 0) {
            console.error("Cannot fetch nexus params from QE.", json)
            console.error("USER:", z.enduser)
            return
        }

        global.myjid = json.user + "@qepal.com/" + global.resource
        global.xmpp_app = json.app
        global.xmpp_role = json.role

        global.xmpp = global.xmppclient({
            service: "wss://bridge.qepal.com/ws",
            domain: "qepal.com",
            resource: global.resource,
            username: json.user,
            password: json.password,
        });

        let isReconnecting = false;

        function reconnect() {
            if (isReconnecting) {
                console.log('Reconnection already in progress. Skipping...');
                return;
            }
            console.log('Attempting to reconnect...');
            isReconnecting = true;
            global.xmpp.stop().then(() => {
                global.xmpp.start().catch(async (err) => {
                    console.error('Reconnection failed:', err.message);
                    if (err.message.includes("not-authorized")) {
                        let json = await API["bridge/register"](null);
                        if (json.code == 0) {
                            setTimeout(reconnect, 5000);
                        }
                        return
                    }
                    setTimeout(reconnect, 5000);
                });
            }).catch((err) => {
                console.error('Failed to stop XMPP client:', err.message);
                setTimeout(reconnect, 5000);
            }).finally(() => {
                isReconnecting = false;
            });
        }

        global.xmpp.on('error', (err) => {
            if (err.message.includes('network error') || err.message.includes('non-101 status code')) {
                reconnect();
            }
        });

        global.xmpp.on('offline', () => { reconnect(); });


        global.xmpp.on('stanza', async (stanza) => {
            if (stanza.is("message")) {
                let bdd = stanza.getChildText("body");
                try { bdd = inflateFromBase64(bdd) } catch { }
                const body = bdd;
                const from = stanza.attrs.from;
                const itsme = (from as string).includes(global.xmpp_app + "-" + z.enduser.uid + "-" + global.xmpp_role + "-" + global.resource)
                const itsbro = !itsme && (from as string).includes(global.xmpp_app + "-" + z.enduser.uid)
                if (body && !stanza.getChild('delay')) {

                    if (body.startsWith("{")) {
                        try {
                            let json = JSON.parse(body);
                            if (json.api && !from.includes("@conference.qepal.com")) {
                                return
                            }
                            else if (json.mid && global.xmppapicb[json.mid]) {
                                let mid = json.mid
                                delete json.mid
                                global.xmppapicb[mid].cb(json)
                                return
                            }
                        }
                        catch { }
                    }

                    {
                        let channel = null
                        let uid = null
                        let resource = null
                        let role = null
                        let app = null
                        let valid = false
                        if (from.includes("@conference.qepal.com")) {
                            channel = from.split("@conference.qepal.com/")[0]
                            let rest = from.split("@conference.qepal.com/")[1]
                            let rests = rest.split("-")
                            if (rests.length == 4) {
                                if (rests[1].length == 24) {
                                    app = rests[0]
                                    uid = rests[1]
                                    role = rests[2]
                                    resource = rests[3]
                                    valid = true
                                }
                            }
                        }
                        else if (from.includes("@qepal.com/")) {
                            let ss = from.split("@qepal.com/")
                            let head = ss[0];
                            let tail = ss[1];
                            let heads = head.split("-")

                            if (heads.length == 3) {
                                if (uid.length == 24 && ObjectId.isValid(uid)) {
                                    app = heads[0]
                                    uid = heads[1]
                                    role = heads[2]
                                    resource = tail
                                    valid = true
                                }
                            }
                        }
                        if (valid)
                            global.nexus.msgreceiver({ fromjid: from, body, role, channel, app, uid, resource, itsme, itsbro })
                    }
                }
            }
        });


        global.xmpp.on('online', async (address) => {
            await global.xmpp.send(global.xmppxml("presence"));
            console.log("[x-nexus] connected:", global.resource)
            global.nexus.connected = true
            await global.nexusconnected?.func?.()
        });

        global.xmpp.start().catch((err) => {
            reconnect();
        });
    }


}