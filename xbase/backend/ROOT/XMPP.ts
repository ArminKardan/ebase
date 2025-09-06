import { Prosper } from '../SSRVerify'
import SerialGenerator from '@/frontend/components/qecomps/SerialGenerator'
import schedule from 'node-schedule'
import ws from 'ws'
import '@/common/Prototypes'
import { ObjectId } from 'mongodb'
import { langType } from '@/common/SiteConfig'
import Cacher from '../Cacher'
const crypto = require('crypto');
var zlib = require('zlib');
const { client, xml } = require("../../common/xmpp.min.js");
import pako from 'pako'
import { Loopez } from '@/common/dynamic'
// import { InitXM } from '../API/bridge/worker/init'



export default async () => {

    return await new Promise<any>(async r => {

        if (global.xmpp) {
            return;
        }
        let resource = global.devmode ? ("xdevelopment" + SerialGenerator(4)) : (process.env.RESOURCE || ("xservice" + SerialGenerator(4)))
        let json = await (await fetch("https://qepal.com/api/bridge/worker/service", {
            method: "POST",
            body: JSON.stringify({
                secret: process.env.EXPLORE_SECRET,
                image: "/files/icons/userv.webp",
                resource,
                public: true
            })
        })).json()


        if (json.code != 0) {
            throw "ERROR: ****WRONG SECRETKEY IN .ENV.LOCAL****"
        }


        global.jidhash = {}

        setInterval(() => {
            global.jidhash = {}
        }, 60000);

        let app = json.app
        let uid = json.uid;
        let role = json.role

        const xmpp = client({
            service: "wss://bridge.qepal.com/ws",
            domain: "qepal.com",
            resource: resource,
            username: json.user,
            password: json.password,
        });

        global.xmpp = xmpp
        global.xmppxml = xml
        global.xmppclient_bk = client

        global.xmppapicb_bk = {}
        global.nexus = {
            agent: {} as any,
            subscribe: async (channel: string) => {
                await global.xmpp.send(global.xmppxml(
                    'presence',
                    { to: `${channel}@conference.qepal.com/${app + "-" + uid + "-" + role + "-" + resource}` },
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
            on: {
                direct: (cb) => {
                    if (!global.xmpp_on_pool) {
                        global.xmpp_on_pool = []
                    }
                    let id = SerialGenerator(5);
                    global.xmpp_on_pool.push({ id, type: "direct", cb })
                    return id
                },
                channel: (channelname: string, cb) => {
                    if (!global.xmpp_on_pool) {
                        global.xmpp_on_pool = []
                    }
                    let id = SerialGenerator(5);
                    global.xmpp_on_pool.push({ id, type: "channel", channelname, cb })
                    return id
                },
            },
            clearon: (id: string) => {
                if (id == "all") {
                    global.xmpp_on_pool = []
                }
                else {
                    global.xmpp_on_pool = global.xmpp_on_pool.filter(p => p.id != id && p.channelname != id && p.type != id)
                }
            },
            channels: new Set(),
            msgreceiver: () => { },
            connected: false,

            api: async (specs: {
                app: string,
                cmd: string,
                body?: any,
                ownership?: "mine" | "owner",
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {
                let md5 = MD5(JSON.stringify({
                    app: specs.app,
                    ownership: specs.ownership,
                    resource: specs.resource,
                    jid: specs.jid,
                    prioritize_mine: specs.prioritize_mine
                }))


                let jid = specs.jid
                if (!jid) {
                    if (global.jidhash[md5]) {
                        jid = global.jidhash[md5]
                    }
                    else {
                        let json = await api("https://qepal.com/api/bridge/worker/findfreeresource",
                            {
                                app: specs.app,
                                secret: process.env.EXPLORE_SECRET || process.env.SERVICE_SECRET,
                                ownership: specs.ownership,
                                resource: specs.resource,
                            })
                        if (json.code != 0) {
                            return { code: -2000, msg: "no free worker found." } as any
                        }
                        let jids = json["jids"]
                        if (jids.length > 0) {
                            jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
                            if (jid)
                                global.jidhash[md5] = jid
                        }
                    }
                }

                if (!jid) {
                    console.error("nexus: no jid found.")
                }

                return new Promise(async resolve => {
                    let mid = SerialGenerator(10)

                    let msg = JSON.stringify({
                        mid,
                        api: specs.cmd,
                        ...(specs.body || {}),
                    })

                    msg = zlib.deflateSync(msg).toString('base64')
                    if (msg.length > 4096) {
                        return "too large, max: 4Kbytes";
                    }
                    let c = setTimeout(() => {
                        resolve({ error: "timeout" })
                    }, 120 * 1000);

                    global.xmppapicb_bk[mid] = {
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
                body: any,
                ownership: "owner" | "mine",
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {

                specs.body = JSON.stringify(specs.body)
                let md5 = MD5(JSON.stringify({
                    app: specs.app,
                    ownership: specs.ownership,
                    resource: specs.resource,
                    jid: specs.jid,
                    prioritize_mine: specs.prioritize_mine
                }))


                let jid = specs.jid
                if (!jid) {
                    if (global.jidhash[md5]) {
                        jid = global.jidhash[md5]
                    }
                    else {
                        let json = await api("https://qepal.com/api/bridge/worker/findfreeresource",
                            {
                                app: specs.app,
                                secret: process.env.EXPLORE_SECRET || process.env.SERVICE_SECRET,
                                ownership: specs.ownership,
                                resource: specs.resource,
                            })
                        if (json.code != 0) {
                            return { code: -2000, msg: "no free worker found." } as any
                        }
                        let jids = json["jids"]
                        if (jids.length > 0) {
                            jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
                            if (jid)
                                global.jidhash[md5] = jid
                        }
                    }
                }

                if (!jid) {
                    console.error("nexus: no jid found.")
                }

                // let bd = deflateToBase64(specs.body)
                let bd = zlib.deflateSync(specs.body).toString('base64')
                if (bd.length > 4096) {
                    return "too large, max: 4Kbytes";
                }
                await global.xmpp.send(global.xmppxml(
                    "message",
                    { to: jid, type: "chat" }, // type: "chat" for one-to-one messages
                    global.xmppxml("body", {}, bd,
                    )))
            },
            sendtojid: async (jid: string, body: any) => {
                body = JSON.stringify(body)
                let bd = zlib.deflateSync(body).toString('base64')
                if (bd.length > 4096) {
                    return "too large, max: 4Kbytes";
                }
                await global.xmpp.send(global.xmppxml(
                    "message",
                    { to: jid, type: "chat" }, // type: "chat" for one-to-one messages
                    global.xmppxml("body", {}, bd,
                    )))
            },
            sendtochannel: async (channel: string, body: any) => {
                body = JSON.stringify(body)
                let bd = zlib.deflateSync(body).toString('base64')
                if (bd.length > 4096) {
                    return "too large, max: 4Kbytes";
                }
                let subs = global.nexus.channels as Set<string>
                if (!subs.has(channel)) {

                    await global.nexus.subscribe(channel);
                    await sleep(500)
                }
                await global.xmpp.send(global.xmppxml(
                    "message",
                    {
                        to: `${channel}@conference.qepal.com`,
                        from: app + "-" + uid + "-" + role + "@qepal.com/" + resource,
                        type: "groupchat"
                    },
                    global.xmppxml("body", {}, bd,
                    )))
            },
        }

        Loopez()

        let isReconnecting = false; // Flag to track reconnection attempts

        function reconnect() {
            if (isReconnecting) {
                if (global.wsdebug)
                    console.log('Reconnection already in progress. Skipping...');
                return;
            }
            if (global.wsdebug)
                console.log('Attempting to reconnect...');
            isReconnecting = true;
            xmpp.stop().then(() => {
                xmpp.start().catch((err) => {
                    if (global.wsdebug)
                        console.error('Reconnection failed:', err.message);
                    setTimeout(reconnect, 5000);
                });
            }).catch((err) => {
                if (global.wsdebug)
                    console.error('Failed to stop XMPP client:', err.message);
                setTimeout(reconnect, 5000);
            }).finally(() => {
                isReconnecting = false;
            });
        }

        xmpp.on('error', (err) => {
            if (err.message.includes('network error') || err.message.includes('non-101 status code')) {
                console.log("error try to reconnect...")
                console.log(err)
                reconnect();
            }
        });

        xmpp.on('offline', () => {
            console.log("offlined try to reconnect...")
            reconnect();
        });

        xmpp.on('stanza', async (stanza) => {
            if (stanza.is("message")) {
                let bdd = stanza.getChildText("body");
                try { bdd = inflateFromBase64(bdd) } catch { }
                let body = bdd;
                const from = stanza.attrs.from;
                const itsme = (from as string).includes(app + "-" + uid + "-" + role + "-" + resource)
                const itsbro = !itsme && (from as string).includes(app + "-" + uid)
                if (body && !stanza.getChild('delay')) {

                    let json = null;
                    body = body.trim()
                    if (body.startsWith("{") || body.startsWith("[")) {
                        try {
                            json = JSON.parse(body);
                            if (json.mid && global.xmppapicb_bk[json.mid]) {
                                let mid = json.mid
                                delete json.mid
                                global.xmppapicb_bk[mid].cb(json)
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
                                if (rests[1].length == 24 && ObjectId.isValid(rests[1])) {
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
                        if (valid) {
                            global.nexus.msgreceiver({ fromjid: from, body:json, role, channel, app, uid, resource, itsme, itsbro });
                            if (!itsme && json) {
                                if (global.xmpp_on_pool && global.xmpp_on_pool.length > 0) {
                                    for (let p of global.xmpp_on_pool) {
                                        if (p.type == "direct" && !channel) {
                                            p.cb({ fromjid: from, body: json, role, channel, app, uid, resource, itsme: false, itsbro })
                                        }
                                        else if (p.type == "channel" && channel == p.channelname) {
                                            p.cb({ fromjid: from, body: json, role, channel, app, uid, resource, itsme: false, itsbro })
                                        }
                                    }
                                }
                            }
                        }

                    }
                }

            }

        });

        xmpp.on('online', async (address) => {
            xmpp.send(global.xmppxml("presence"));
            console.log("[uservice-back-bridge connected.]")
            r(null)
        });

        xmpp.start().catch((err) => {
            console.log("start failed try to reconnect...")
            console.log(err)
            reconnect();
        });
    });

}


function inflateFromBase64(base64String) {
    // Convert the Base64 string to a Uint8Array
    const compressedData = Buffer
        ? Uint8Array.from(Buffer.from(base64String, 'base64')) // Node.js
        : Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)); // Browser

    // Decompress the data using pako
    const decompressedData = pako.inflate(compressedData, { to: 'string' });

    return decompressedData;
}

