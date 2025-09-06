import fs from 'fs';
import path from 'path';
import figlet from 'figlet';
import "./Prototypes"
const { client, xml } = require("./xmpp.min.js");
import { MongoClient, ObjectId } from 'mongodb'
var zlib = require('zlib');
import dotenv from 'dotenv';
import os from 'os'



declare global { var udb: import("mongodb").Db; }
declare global { var xdb: import("mongodb").Db; }
declare global {
    function sleep(ms): Promise<any>
}
import pako from 'pako'
import { Loopez } from './dynamic';

const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');



function encrypt(text, password) {
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [
        iv.toString('base64'),
        ciphertext.toString('base64'),
        authTag.toString('base64')
    ].join(':');
}

function decrypt(encryptedBase64, password) {
    const [ivB64, ciphertextB64, tagB64] = encryptedBase64.split(':');
    const key = crypto.createHash('sha256').update(password).digest();

    const iv = Buffer.from(ivB64, 'base64');
    const ciphertext = Buffer.from(ciphertextB64, 'base64');
    const authTag = Buffer.from(tagB64, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}

/**
 * Get all files in a directory (non-recursive).
 * @param {string} dirPath - The directory path to read.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file names.
 */
async function getFilesInDirectory(dirPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, entries) => {
            if (err) return reject(err);

            const filePaths = [];

            entries.forEach(entry => {
                const fullPath = path.join(dirPath, entry);
                const stat = fs.statSync(fullPath);
                if (stat.isFile()) {
                    filePaths.push(fullPath);
                }
            });

            resolve(filePaths);
        });
    });
}


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



global.sleep = (ms) => {
    return new Promise(r => setTimeout(() => r(null), ms))
}


export namespace App {
    let c: {
        app: string,
        resource: string,
        image?: string,
        public?: boolean,
    };

    function convertMinutes(minutes) {
        if (minutes < 1) return "اکنون";
        if (minutes < 60) return `${minutes.toLocaleString("fa-IR")} دقیقه`;
        if (minutes < 24 * 60) return `${Math.floor(minutes / 60).toLocaleString("fa-IR")} ساعت`;
        if (minutes < 30 * 24 * 60) return `${Math.floor(minutes / (24 * 60)).toLocaleString("fa-IR")} روز`;
        return `${Math.floor(minutes / (30 * 24 * 60)).toLocaleString("fa-IR")} ماه`;
    }

    export const encryptor = async (text: string, password: string) => {
        return await encrypt(text, password)
    }

    export const decryptor = async (encryptedBase64: string, password: string) => {
        return await decrypt(encryptedBase64, password)
    }



    const Declareglobals = async () => {

        global.jidhash = {}

        setInterval(() => {
            global.jidhash = {}
        }, 60000);

        global.xmppapicb = {}

        global.nexus = {
            agent: {} as any,
            subscribe: async (channel: string) => {
                console.log("subscribing to:", `${channel + "@conference.qepal.com"}/${global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource}`)
                await global.xmpp.send(global.xmppxml(
                    'presence',
                    { to: `${channel + "@conference.qepal.com"}/${global.app + "-" + global.uid.toString() + "-" + c.resource + "-" + global.xmrole}` },
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
                        }
                    }
                }

                global.jidhash[md5] = jid

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

                    msg = deflateToBase64(msg)

                    if (msg.length > 4096) {
                        return "too large, max: 4Kbytes";
                    }

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
                body: any,
                ownership?: "mine" | "owner",
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
                        }
                    }
                }

                global.jidhash[md5] = jid


                if (!jid) {
                    console.error("nexus: no jid found.")
                }



                let bd = deflateToBase64(specs.body)
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
                        from: `${global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource}@qepal.com/${c.resource}`,
                        type: "groupchat"
                    },
                    global.xmppxml("body", {}, bd,
                    )))
            },
        }
    }

    let Events: Array<{ api: string, cb: (specs: { body: any, role: "owner" | "partner" | "user", uid: string, servid: string, servsecret: string, app: string, resource: string }) => any }> = [];

    export function on(api: string, cb: (specs: { body: any, uid: string | null, app: string | null, resource: string | null, servid: string, servsecret: string, }) => any) {
        Events.push({ api, cb })
    }

    export async function Init() {

        let envs = await getFilesInDirectory("./envs") as Array<string>
        for (let p of envs) {
            dotenv.config({ path: p });
        }
        Loopez()
    }

    export async function initUDB() {

        if (!process.env.UMONGOURL && process.env.EXPLORE_SECRET) {
            let json = await api("https://qepal.com/api/explore/getmongourl",
                { secret: process.env.EXPLORE_SECRET })
            if (json.code == 0 && json.mongourl) {
                process.env.UMONGOURL = json.mongourl
                process.env.UMONGODB_DB = (json.mongourl as string).split(":")[1].replace("//", "")
            }
        }

        if (process.env.UMONGOURL && process.env.EXPLORE_SECRET) {
            try {
                var uclient = new MongoClient(process.env.UMONGOURL)
                let umongo = await uclient.connect()
                global.udb = umongo.db(process.env.UMONGODB_DB)
                await uclient.db().command({ ping: 1 });
                console.log("udb-mongo successfully connected.");
            } catch {
                console.error("udb-mongo connection failed.")
            }
        }


        if (!process.env.XMONGOURL && process.env.SERVICE_SECRET) {
            let json = await api("https://qepal.com/api/service/getmongourl",
                { secret: process.env.SERVICE_SECRET })
            if (json.code == 0 && json.mongourl) {
                process.env.XMONGOURL = json.mongourl
                process.env.XMONGODB_DB = (json.mongourl as string).split(":")[1].replace("//", "")
            }
        }

        if (process.env.XMONGOURL && process.env.SERVICE_SECRET) {
            try {
                var xclient = new MongoClient(process.env.XMONGOURL)
                let xmongo = await xclient.connect()
                global.xdb = xmongo.db(process.env.XMONGODB_DB)
                await xclient.db().command({ ping: 1 });
                console.log("xdb-mongo successfully connected.");
            } catch {
                console.error("xdb-mongo connection failed.")
            }
        }
    }

    export type UnitName = "usd" | "eur" | "gbp" | "usdt" | "toman" | "aud" | "tron" | "usdc" | "cad" | "rial"

    export async function payg(specs: { uid: string, amount: number, unit: UnitName, details: string }) {
        if (!process.env.EXPLORE_SECRET) {
            throw "Explore secret is missing and its necessary when you call PAYG function."
        }
        return await api("https://qepal.com/api/service/payg", {
            uid: specs.uid,
            amount: specs.amount,
            unit: specs.unit,
            exploresecret: process.env.EXPLORE_SECRET,
            details: specs.details,
        })
    }

    export async function usequota(specs: { uid: string, amount: number, details: string }) {
        if (!process.env.EXPLORE_SECRET) {
            throw "Explore secret is missing and its necessary when you call PAYG function."
        }
        return await api("https://qepal.com/api/service/usequota", {
            uid: specs.uid,
            amount: specs.amount,
            exploresecret: process.env.EXPLORE_SECRET,
            details: specs.details,
        })
    }


    export async function Connect(config: {
        public?: boolean,
        image?: string,
    }): Promise<{
        resource: string,
        image?: string,
        public?: boolean,
    }> {


        let appname = path.basename(path.join(__dirname, "../../"))
        let workername = path.basename(path.join(__dirname, "../"))
        global.resource = workername + "." + appname + ".dev"
        if (process.env.RESOURCE) {
            global.resource = process.env.RESOURCE
        }
        let secret = null
        if (process.env.EXPLORE_SECRET) {
            secret = process.env.EXPLORE_SECRET
        }
        if (process.env.SERVICE_SECRET) {
            secret = process.env.SERVICE_SECRET
        }

        if (!secret) {
            throw "No service or explore secret code found in envs."
        }

        let json = await (await fetch("https://qepal.com/api/bridge/worker/service", {
            method: "POST",
            body: JSON.stringify({
                secret: secret,
                image: config.image,
                resource: global.resource,
                public: config.public
            })
        })).json()


        if (json.code != 0) {
            throw "ERROR: ****WRONG SECRETKEY IN ENVS****"
        }

        global.app = json.app
        global.xmrole = json.role
        global.uid = ObjectId.createFromHexString(json.uid)
        global.myjid = json.user + "@qepal.com/" + global.resource

        c = { app: json.app, image: config.image, public: config.public, resource: global.resource }

        if (global.wsdebug) console.log("Connect function calling...")

        for (let i = 2; i < process.argv.length; i++) {
            const [key, value] = process.argv[i].split('=');
            if (c.hasOwnProperty(key)) {
                if (value === 'null') {
                    c[key] = null;
                } else if (!isNaN(Number(value))) {
                    c[key] = Number(value);
                } else if (value === 'true' || value === 'false') {
                    c[key] = value === 'true';
                } else if (value.startsWith('[') && value.endsWith(']')) {
                    c[key] = JSON.parse(value);
                } else {
                    c[key] = value;
                }
            }
        }



        return await new Promise<any>(async r => {

            const nicknameToJidMap = {}
            const xmpp = client({
                service: "wss://bridge.qepal.com/ws",
                domain: "qepal.com",
                resource: global.resource,
                username: json.user,
                password: json.password,
            });

            global.xmpp = xmpp
            global.xmppxml = xml
            global.xmppclient = client
            const users = {}

            Declareglobals()

            // let envs = await api("https://qepal.com/api/safemap", { user_secret: process.env.USER_SECRET });
            // if (envs.code == 0) {
            //     for (let en of envs.values) {
            //         process.env[en.k] = en.v
            //     }
            // }

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
                    reconnect();
                }
            });

            xmpp.on('offline', () => {
                reconnect();
            });

            xmpp.on('stanza', async (stanza) => {

                if (stanza.is('presence')) {
                    const from = stanza.attrs.from;
                    const x = stanza.getChild('x', 'http://jabber.org/protocol/muc#user');
                    if (x) {
                        const item = x.getChild('item');
                        if (item && item.attrs.jid) {
                            nicknameToJidMap[from] = item.attrs.jid;
                        }
                    }
                }

                if (stanza.is("message")) {

                    let bdd = stanza.getChildText("body");
                    try { bdd = inflateFromBase64(bdd) } catch { }
                    const body = bdd;

                    let from = stanza.attrs.from;
                    let itsme = (from as string).includes(global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource)
                    let itsbro = !itsme && (from as string).includes(global.app + "-" + global.uid.toString())
                    if (body && !stanza.getChild('delay')) {

                        let json = null
                        if (body.trim().startsWith("{") || body.trim().startsWith("[")) {
                            try {
                                json = JSON.parse(body);
                                if (json.api && !from.includes("@conference.qepal.com")) {
                                    let found = false
                                    for (let ev of Events) {
                                        if (ev.api == json.api) {
                                            let { api, mid, ...data } = json
                                            let uid = null
                                            let resource = null
                                            let head = from.split("@qepal.com/")
                                            let heads = head[0].split("-");
                                            let app = heads[0]
                                            let ___useruid = heads[1]
                                            let role = heads[2]
                                            if (___useruid.length == 24 && ObjectId.isValid(___useruid)) {
                                                uid = ___useruid
                                            }
                                            resource = head[1]

                                            let res = { code: -500, msg: "not implemented." };


                                            let servid = null;
                                            let servsecret = null;

                                            if (!users[uid] && process.env.SERVICE_SECRET) {
                                                let json = await global.api("https://qepal.com/api/service/getbysecret", {
                                                    servicesecret: process.env.SERVICE_SECRET,
                                                    uid
                                                })

                                                if (json.code != 0) {
                                                    if (app != global.app || (role != "partner" && role != "owner")) {
                                                        res = { code: -3000, msg: "you dont have active service." }
                                                    }
                                                }
                                                else {
                                                    servid = json.servid;
                                                    servsecret = process.env.SERVICE_SECRET;
                                                    users[uid] = { servid, servsecret }
                                                }
                                            }
                                            else if (!users[uid] && process.env.EXPLORE_SECRET) {

                                                let json = await global.api("https://qepal.com/api/service/hasaliveservice", {
                                                    exploresecret: process.env.EXPLORE_SECRET,
                                                    uid
                                                })

                                                if (json.code != 0) {
                                                    if (app != global.app || (role != "partner" && role != "owner")) {
                                                        res = { code: -3000, msg: "you dont have active service." }
                                                    }
                                                }
                                                else {
                                                    servid = json.servid;
                                                    servsecret = json.secret;
                                                    users[uid] = { servid, servsecret }
                                                }
                                            }
                                            else if (users[uid]) {
                                                servid = users[uid]["servid"]
                                                servsecret = users[uid]["secret"]
                                            }

                                            if (res.code != -3000)
                                                res = await ev.cb({
                                                    uid, role, app,
                                                    resource, servid,
                                                    servsecret,
                                                    body: data
                                                })

                                            await xmpp.send(xml(
                                                "message",
                                                { to: from, type: "chat" }, // type: "chat" for one-to-one messages
                                                xml("body", {}, deflateToBase64(JSON.stringify({ ...res, mid: json.mid, })),
                                                )))
                                            found = true
                                        }

                                    }
                                    if (found) { return }
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
                            if (from.includes("@conference.qepal.com")) {
                                channel = from.split("@")[0]
                                let f = nicknameToJidMap[from]
                                if (f)
                                    from = f
                            }
                            let ss = from.split("@qepal.com/")
                            let head = ss[0];
                            let tail = ss[1];
                            let heads = head.split("-")
                            app = heads[0]
                            uid = heads[1]
                            role = heads[2]
                            resource = tail
                            if (uid == global.uid.toHexString()) {
                                itsbro = true
                                if (global.resource == resource) {
                                    itsme = true
                                }
                            }
                            if (heads.length == 3 || heads.length == 4) {
                                if (uid.length == 24 && ObjectId.isValid(uid)) {
                                    global.nexus.msgreceiver({ fromjid: from, body: json, role, channel, app, uid, resource, itsme, itsbro })

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
                }
            });

            xmpp.on('online', async (address) => {
                xmpp.send(xml("presence"));
                console.log(`[nexus-${global.resource}] connected.`)
                r(c)
            });

            xmpp.start().catch((err) => {
                reconnect();
            });

            process.on('uncaughtException', (err) => { });
            process.on('unhandledRejection', (err) => { });
            process.on('exit', async () => {
                if (global.wsdebug)
                    console.log("exiting...")
                xmpp.stop().catch((err) => { });
            });


            App.on("ping", async (specs) => {
                // console.log("ping request from:", specs.uid)
                return { code: 0, pong: true }
            })
        })


    }

    export const Figlet = (text): string => {
        let data = fs.readFileSync(path.join(process.cwd(), "./files/Big.flf"), "utf8");
        figlet.parseFont("Bigger", data);
        return figlet.textSync(text, "Bigger" as any)
    }



    /**
     * Generates a random filename with the same extension
     * @param {string} originalName - The original file name
     * @returns {string} - The new hashed file name
     */
    function generateRandomFileName(originalName) {
        const extension = path.extname(originalName);
        const hash = crypto.randomBytes(12).toString('hex'); // 24-character hash
        return `${hash}${extension}`;
    }

    /**
     * Uploads a string or Buffer as a virtual file
     * @param {string|Buffer} content - The content to upload
     * @param {number} maxAgeSec - Expiry time for the file (in seconds)
     * @param {Function} [onProgress] - Optional callback for progress updates
     */
    const streamifier = require('streamifier'); // Ensure streamifier is installed
    export async function uploader(content, maxAgeSec, extension?) {
        let onProgress = null;
        let uid = global.uid?.toString?.();
        if (!uid) {
            throw "UID Not found!";
        }
        if (extension && !(extension.startsWith("."))) {
            extension = "." + extension
        }

        let serverUrl = 'https://cdn.ituring.ir/qeupload/uploader.php';
        if (global.wsdebug) console.log("UID is:", uid);

        try {
            const newFileName = generateRandomFileName(extension ? `file${extension}` : "file.dat"); // Ensure filename with extension
            const formData = new FormData();

            // Append required fields
            formData.append('uid', uid);
            formData.append('max_age_sec', maxAgeSec);
            formData.append('submit', '1');

            // Convert the string to a Buffer, then to a readable stream
            let bufferContent: any = Buffer.from("No data.", "utf8")
            if (Buffer.isBuffer(content)) {
                bufferContent = content
            }
            else if (typeof content == "string") {
                bufferContent = Buffer.from(content, 'utf-8'); // Convert string to Buffer
            }
            else if (typeof content == "object") {
                bufferContent = Buffer.from(JSON.stringify(content, null, 2), 'utf-8'); // Convert string to Buffer
            }

            bufferContent = content

            const bufferStream = streamifier.createReadStream(bufferContent); // Convert Buffer to stream

            // Debugging: Check the type of 'content' and 'bufferStream'
            if (global.wsdebug) {
                console.log('Content type:', typeof content);
                console.log('Buffer Stream:', bufferStream);
                console.log('File to upload:', newFileName);
            }

            // Append the readable stream to FormData
            formData.append('filesToUpload[]', bufferStream, newFileName);

            // Prepare headers and send the POST request
            const response = await axios.post(serverUrl, formData, {
                // headers: { ...formData.getHeaders() },
                // maxBodyLength: Infinity,
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const total = progressEvent.total || bufferContent.length;

                        // Handle edge case when total is not provided
                        if (!total) {
                            console.error("No total size found in progress event.");
                            return;
                        }

                        let percent = 0;
                        if (total) {
                            percent = Math.floor((progressEvent.loaded / total) * 100);
                        }

                        // Trigger the progress callback
                        onProgress(percent);
                    }
                },
            });

            // Log the successful response
            return `https://cdn.ituring.ir/qeupload/${uid}/${newFileName}`;
        } catch (error) {
            // Debugging: Log the error
            console.error(`Upload failed for Buffer:`, error);
            if (error.response) {
                if (global.wsdebug) console.error('Response from server:', error.response.data);
            } else {
                if (global.wsdebug) console.error('Error message:', error.message);
            }
        }
    }
    export async function downloader(url: string, proxy: boolean = false) {
        if (proxy) {
            let data = await (await fetch("https://irmapserver.ir/api.php", {
                method: "POST",
                body: JSON.stringify({
                    url,
                    headers: {}
                })
            })).json()
            return Buffer.from(data.body, "base64")
        }
        else {
            try {
                // Make a GET request to the URL and get the response as a Buffer
                const response = await axios.get(url, {
                    responseType: 'arraybuffer' // Ensure response is treated as raw binary data
                });

                // The response data is now a Buffer
                const dataBuffer = Buffer.from(response.data);
                console.log(`Downloaded ${dataBuffer.length} bytes`);

                return dataBuffer;
            } catch (error) {
                console.error(`Error downloading from URL: ${url}`, error);
                throw error;
            }
        }
    }



    export async function proxy(specs: { url: string, bodytype: "binary" | "string" | "json", body?: any, headers?: { [key in string]: string } }) {
        let data = await (await fetch("https://irmapserver.ir/api.php", {
            method: "POST",
            body: JSON.stringify({
                url: specs.url,
                body: specs.body,
                headers: specs.headers || {}
            })
        })).json()

        if (specs.bodytype == "binary") {
            return { body: Buffer.from(data.body, "base64"), responseHeaders: data.responseHeaders }
        }
        else if (specs.bodytype == "string") {
            return { body: Buffer.from(data.body, "base64").toString("utf8"), responseHeaders: data.responseHeaders }
        }
        else if (specs.bodytype == "json") {
            return { body: JSON.parse(Buffer.from(data.body, "base64").toString("utf8")), responseHeaders: data.responseHeaders }
        }
    }

}





