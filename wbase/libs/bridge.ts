import fs from 'fs';
import readline from 'readline'
import kleur from 'kleur';
import path from 'path';
import figlet from 'figlet';
import "./Prototypes"
const { client, xml } = require("./xmpp.min.js");
import { MongoClient, ObjectId } from 'mongodb'
var zlib = require('zlib');
import dotenv from 'dotenv';
import puppeteer, { Browser as B } from 'puppeteer-core'
import os from 'os'
import express from 'express'



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


    export const rest = express();

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
                onlymine?: boolean,
                onlyowner?: boolean,
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {

                let md5 = MD5(JSON.stringify({
                    app: specs.app,
                    onlymine: specs.onlymine,
                    onlyowner: specs.onlyowner,
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
                                onlymine: specs.onlymine,
                                onlyowner: specs.onlyowner,
                                resource: specs.resource,
                            })
                        let jids = json.jids
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
                body: string,
                onlymine?: boolean,
                onlyowner?: boolean,
                resource?: string,
                prioritize_mine?: boolean
                jid?: string,
            }) => {

                let md5 = MD5(JSON.stringify({
                    app: specs.app,
                    onlymine: specs.onlymine,
                    onlyowner: specs.onlyowner,
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
                                onlymine: specs.onlymine,
                                onlyowner: specs.onlyowner,
                                resource: specs.resource,
                            })
                        let jids = json.jids
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
                if (typeof body != "string") {
                    body = JSON.stringify(body)
                }
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
                if (typeof body != "string") {
                    body = JSON.stringify(body)
                }
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

    export async function Init(port?: number | boolean) {

        let envs = await getFilesInDirectory("./envs") as Array<string>
        for (let p of envs) {
            dotenv.config({ path: p });
        }

        let _port = null
        if (typeof port == "number") {
            _port = port
        }
        if (os.platform() == "linux") {
            _port = 3000
        }
        if (port == true) {
            _port = 3000
        }

        if (_port) {
            rest.use(express.json()); // to parse JSON bodies
            rest.listen(_port, () => { });
            rest.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
                if (req.method === 'OPTIONS') {
                    return res.sendStatus(204);
                }
                next();
            });
            rest.get('/start', (req, res) => {
                res.json({ code: 0 });
            });
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

        c = { app: json.app, image: config.image, public: config.public, resource:global.resource }

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
                        if (body.startsWith("{")) {
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
                                    global.nexus.msgreceiver({ fromjid: from, body, role, channel, app, uid, resource, itsme, itsbro })

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
                console.log("ping request from:", specs.uid)
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


    export namespace Browser {

        export let instance = null as B;

        export async function Start(headless: boolean, httpproxy?: string) {

            let args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
            if (httpproxy) {
                args.push(`--proxy-server=${httpproxy}`)
            }
            Browser.instance = await puppeteer.launch({
                headless,
                executablePath: os.platform() == "linux" ? '/usr/bin/chromium-browser' : path.join(__dirname, '../../../chrome/chrome.exe'),
                defaultViewport: {
                    width: 1024,
                    height: 768
                },
                args
            });
        }
    }

    export namespace Telegram {

        export type TelegramResponse<T> = {
            ok: boolean;
            result: T;
        };

        export type Chat = {
            id: number;
            type: "private" | "group" | "supergroup" | "channel";
            title?: string;
            username?: string;
            first_name?: string;
            last_name?: string;
        };

        export type User = {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
        };


        export type ChatMember = {
            user: User;
            status: "member" | "creator" | "administrator",
            is_anonymous: boolean
        };

        export type Contact = {
            phone_number: string,
            first_name: string,
            last_name: string,
            user_id: number
        }

        export type Poll = {
            id: string,
            question: string,
            options: Array<{ text: string, voter_count: number }>,
            total_voter_count: number,
            is_closed: boolean,
            is_anonymous: boolean,
            type: string,
            allows_multiple_answers: boolean
        }

        export type Location = { latitude: number, longitude: number, live_period: number }

        export type Message = {
            id: string;
            message_id: number;
            edited_date?: number;
            from: User;
            chat: Chat;
            date: number;
            forward_origin?: { type: string, sender_user_name: string, date: number }
            forward_sender_name: string,
            inline_message_id: string,
            text?: string;
            data: string,
            chat_instance: string,
            message: { message_id: number, from: User, chat: Chat, date: number, text: string, reply_markup: any },
            photo?: Array<{
                file_id: string,
                file_unique_id: string,
                file_size: number,
                width: number,
                height: number
            }>;
            contact?: Contact,
            audio?: {
                duration: number,
                file_name: string,
                mime_type: 'audio/mpeg',
                title: string,
                performer: string,
                file_id: string,
                file_unique_id: string,
                file_size: number
            },
            poll?: Poll,
            location?: Location,
            voice?: {
                duration: number,
                mime_type: 'audio/ogg',
                file_id: string,
                file_unique_id: string,
                file_size: number
            },
            document?: {
                file_name: string,
                mime_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'audio/mpeg' | 'audio/ogg' | 'audio/mp4' | 'audio/flac' | 'audio/wav'
                | 'video/mp4' | 'video/mpeg' | 'video/x-msvideo' | 'video/quicktime' | 'application/pdf' | 'application/zip' | 'application/x-rar-compressed'
                | 'text/plain' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'application/vnd.ms-excel'
                | 'audio/ogg' | 'video/webm',
                thumbnail: {
                    file_id: string,
                    file_unique_id: string,
                    file_size: number,
                    width: number,
                    height: number
                },
                thumb: {
                    file_id: string,
                    file_unique_id: string,
                    file_size: number,
                    width: number,
                    height: number
                },
                file_id: string,
                file_unique_id: string,
                file_size: number
            }
        };

        export type InlineQuery = {
            id: string,
            from: User,
            chat_type: string,
            query: '',
            offset: ''
        }

        export type InlineButton = {
            id: string,
            from: User,
            inline_message_id: string,
            chat_instance: string,
            data: string
        }

        export type Update = {
            update_id: number;
            message?: Message;
            edited_message: Message;
            callback_query: Message;
            inline_query: InlineQuery;
        };

        export type SendMessageOptions = {
            chat_id: number;
            text: string;
            parse_mode?: "Markdown" | "HTML";
            disable_web_page_preview?: boolean;
            disable_notification?: boolean;
            reply_to_message_id?: number;
            reply_markup?: {
                inline_keyboard?: Array<Array<any>>,
                keyboard?: Array<Array<{ text: string, request_contact?: boolean, request_location?: boolean }>>,
                resize_keyboard?: boolean,
                remove_keyboard?: boolean,
                one_time_keyboard?: boolean,
            };


        }

        export type SendPhotoOptions = {
            chat_id: number;
            photo: string; // File ID or URL
            caption?: string;
            parse_mode?: "Markdown" | "HTML";
            disable_notification?: boolean;
            reply_to_message_id?: number;
        };

        export type SendFileOptions = {
            chat_id: number;
            type: "photo" | "video" | "audio" | "zip"
            file: Buffer; // File ID or URL
            caption?: string;
            parse_mode?: "Markdown" | "HTML";
            disable_notification?: boolean;
            reply_to_message_id?: number;
        };

        export interface TelegramBotConfig {
            token: string;
            maxmsgin300s: number;
            maxmsgin3600s: number;
            maxmsgin86400s: number;
            pollingInterval?: number;
            admin_usernames?: Array<string>,
            forcetojoin?: Array<string>,
        }

        export type Person = {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            chat_instances: Array<string>;
            joindate: Date;
            lastseen: Date;
            role: Array<string>;
            is_bot: boolean;
            is_premium?: boolean;
            custom: any;
        }

        type MessageID = number

        export class Bot {
            private readonly token: string;
            private readonly apiUrl: string;
            private offset: number = -1;
            private pollingInterval: number;
            private lastmsgjson: string
            private lastcmd = {}
            private lastdata = {}
            private maxmsgin300s: number;
            private maxmsgin3600s: number;
            private maxmsgin86400s: number;
            private c;
            private admin_usernames: Array<string>;
            private forcetojoin: Array<string>;
            // private buttondatamap = {} as any
            private msgstore = {} as { [key in string]: {
                message_id?: number,
                chat_id?: number,
                text?: string,
                buttons?: Array<Array<{ text: string, data?: any, url?: string }>>
            } }

            private _participants = {} as { [key in string]: { user: User, totalmesseges: { "s300": number, "s3600": number, "s86400": number } } }
            public participants: Array<Person> = [];
            pcol = udb.collection("participants")

            convertbuttons(buttons, msgid) {
                let rowidx = 0, columnidx = 0
                let result = JSON.parse(JSON.stringify(buttons || []))
                for (let bg of result) {
                    for (let b of bg) {
                        delete b["data"]
                        b["callback_data"] = msgid + "-" + rowidx + "-" + columnidx
                        columnidx++
                    }
                    rowidx++
                }
                return result
            }

            constructor(config: TelegramBotConfig) {
                this.token = config.token;
                this.c = null
                this.maxmsgin300s = config.maxmsgin300s;
                this.maxmsgin3600s = config.maxmsgin3600s;
                this.maxmsgin86400s = config.maxmsgin86400s;
                this.admin_usernames = config.admin_usernames;
                this.forcetojoin = config.forcetojoin;
                this.apiUrl = `https://api.telegram.org/bot${this.token}`;
                this.pollingInterval = config.pollingInterval || 5000;


                setInterval(() => {
                    for (let id of Object.keys(this._participants)) {
                        this._participants[id].totalmesseges.s300 = 0
                    }
                }, 300000);

                setInterval(() => {
                    for (let id of Object.keys(this._participants)) {
                        this._participants[id].totalmesseges.s3600 = 0
                    }
                }, 3600000);

                setInterval(() => {
                    for (let id of Object.keys(this._participants)) {
                        this._participants[id].totalmesseges.s86400 = 0
                    }
                }, 86400000);



                this.startPolling(async (update) => {
                    let from = null as User
                    try {
                        if (update.callback_query) {
                            if (!update.callback_query.from.username)
                                update.callback_query.from.username = ""
                            from = update.callback_query.from
                        }

                        if (update.inline_query) {
                            if (!update.inline_query.from.username)
                                update.inline_query.from.username = ""
                            from = update.inline_query.from
                        }
                        if (update.edited_message) {
                            if (!update.edited_message.from.username)
                                update.edited_message.from.username = ""
                            from = update.edited_message.from
                        }
                        if (update.message) {
                            if (!update.message.from.username)
                                update.message.from.username = ""
                            from = update.message.from
                        }


                        if (!this._participants[from.id]) {
                            this._participants[from.id] = { user: from, totalmesseges: { "s300": 0, "s3600": 0, "s86400": 0 } }
                        }
                        else if (!((this.admin_usernames || []).includes(from.username)) && this._participants[from.id].totalmesseges.s300 > this.maxmsgin300s) {
                            return
                        }
                        else if (!((this.admin_usernames || []).includes(from.username)) && this._participants[from.id].totalmesseges.s3600 > this.maxmsgin3600s) {
                            return
                        }
                        else if (!((this.admin_usernames || []).includes(from.username)) && this._participants[from.id].totalmesseges.s86400 > this.maxmsgin86400s) {
                            return
                        }
                    } catch (err) { if (global.wsdebug) console.log(err) }
                    let person: Person = this.participants.find(pp => pp.id == from.id)
                    if (!person) {
                        person = {
                            ...from, id: from.id, role: ([] as string[]), chat_instances: ([] as string[]),
                            joindate: new Date(), lastseen: new Date(),
                            is_bot: false,
                            custom: {},
                        }
                        if (update.callback_query?.chat_instance) {
                            person.chat_instances = [update.callback_query.chat_instance]
                        }
                        this.participants.push(person)
                        await this.pcol.insertOne(person)
                        delete person["_id"]
                    }
                    else {
                        if ((person.lastseen as Date).getTime() < new Date().getTime() - 300000) {
                            person.lastseen = new Date()
                            await this.pcol.updateOne({ id: from.id }, { $set: { lastseen: person.lastseen } })
                        }
                        try {
                            if (update.callback_query?.chat_instance) {
                                if (!person.chat_instances.includes(update.callback_query.chat_instance)) {
                                    person.chat_instances.push(update.callback_query.chat_instance)
                                    await this.pcol.updateOne({ id: from.id }, { $addToSet: { chat_instances: update.callback_query.chat_instance } })
                                }
                            }
                        } catch (e) {
                            console.error(e)
                        }
                    }


                    if (update.inline_query) {

                        try {
                            let res = await this.on.inline.start({ inlineid: update.inline_query.id as string, query: update.inline_query.query, person })

                            if (!res) {
                                return
                            }
                            let msgid = SerialGenerator(10)
                            this.msgstore[msgid] = { text: res.text, buttons: res.buttons || [] }


                            let obj = {
                                "inline_query_id": update.inline_query.id,
                                "results": [{
                                    "type": "article",
                                    "id": "1",
                                    "title": res.title,
                                    "description": res.description,
                                    parse_mode: "Markdown",
                                    reply_markup: {
                                        inline_keyboard: this.convertbuttons(res.buttons || [], msgid),
                                    },
                                    "input_message_content": {
                                        "message_text": res.text
                                    }
                                }],
                                "cache_time": 1
                            }
                            let e = await this.answerInlineQuery(obj)
                        } catch (e) { console.error(e) }
                    }



                    if (update.callback_query && update.callback_query.inline_message_id) {

                        let msgid = update.callback_query.data.split("-")[0]
                        let rowidx = update.callback_query.data.split("-")[1]
                        let columnidx = update.callback_query.data.split("-")[2]

                        let data = null
                        if (this.msgstore[msgid] && this.msgstore[msgid].buttons) {
                            data = this.msgstore[msgid].buttons[rowidx][columnidx].data
                        }


                        let resp = await this.on.inline.button({
                            inlineid: update.callback_query.id,
                            inline_msg_id: update.callback_query.inline_message_id,
                            person,
                            chat_instance: update.callback_query.chat_instance,
                            data
                        })

                        if (resp.buttons) {
                            this.msgstore[msgid].buttons = resp.buttons
                        }
                        if (resp.text) {
                            this.msgstore[msgid].text = resp.text
                        }

                        await this.answerCallbackQuery({
                            callback_query_id: update.callback_query.id,
                            text: resp.popup,
                            parse_mode: resp.parse_mode || "Markdown",
                            show_alert: !!resp.alert
                        })


                        if (resp.text || resp.buttons) {
                            let o = {
                                "inline_message_id": update.callback_query.inline_message_id,
                                reply_markup: {
                                    inline_keyboard: this.convertbuttons(this.msgstore[msgid].buttons, msgid),
                                },
                                "text": this.msgstore[msgid].text,
                                parse_mode: "Markdown"
                            }
                            await this.editMessageText(o)
                        }
                    }
                    else if (update.callback_query && !update.callback_query.inline_message_id) {//button


                        let msgid = update.callback_query.data.split("-")[0]
                        let rowidx = update.callback_query.data.split("-")[1]
                        let columnidx = update.callback_query.data.split("-")[2]

                        let data = null
                        if (this.msgstore[msgid] && this.msgstore[msgid].buttons) {
                            data = this.msgstore[msgid].buttons[rowidx][columnidx].data
                        }

                        let resp = await this.on.button({ msgid, person, data, chat: update.callback_query.message.chat })

                        await this.answerCallbackQuery({
                            callback_query_id: update.callback_query.id,
                            text: resp.popup,
                            "parse_mode": resp.parse_mode || "Markdown",
                            show_alert: resp.alert,
                        })


                        if (resp.text && !resp.buttons) {
                            let o = {
                                message_id: update.callback_query.message.message_id,
                                chat_id: update.callback_query.message.chat.id,
                                reply_markup: update.callback_query.message.reply_markup,
                                "text": resp.text,
                                parse_mode: resp.parse_mode || "Markdown"
                            }
                            await this.editMessageText(o)
                        }
                        else if (!resp.text && resp.buttons) {
                            await this.editMessageText({
                                message_id: update.callback_query.message.message_id,
                                chat_id: update.callback_query.message.chat.id,
                                reply_markup: {
                                    inline_keyboard: this.convertbuttons(resp.buttons, msgid),
                                },
                                "text": update.callback_query.message.text,
                                parse_mode: resp.parse_mode || "Markdown"
                            })
                        }
                        else if (resp.text && resp.buttons) {
                            await this.editMessageText({
                                message_id: update.callback_query.message.message_id,
                                chat_id: update.callback_query.message.chat.id,
                                reply_markup: {
                                    inline_keyboard: this.convertbuttons(resp.buttons, msgid),
                                },
                                text: resp.text,
                                parse_mode: resp.parse_mode || "Markdown"
                            })
                        }


                        return
                    }
                    else if (update.edited_message) {
                        update.message = update.edited_message
                    }
                    if (update.message?.photo) {
                        let photoid = update.message.photo.at(-1).file_id
                        if (this.cancelrepeatitive(person, photoid.toString()))
                            return
                        let resp = await App.proxy({ url: `https://api.telegram.org/bot${this.token}/getFile?file_id=${photoid}`, bodytype: "json" })
                        let imgbin = await App.proxy({ url: `https://api.telegram.org/file/bot${this.token}/${resp.body.result.file_path}`, bodytype: "binary" })
                        await this.on.photo({ msgid: update.message.message_id, person, data: imgbin.body, chat: update.message.chat })
                    }
                    if (update.message?.voice) {
                        if (this.cancelrepeatitive(person, update.message.voice.file_id.toString()))
                            return
                        let voiceid = update.message.voice.file_id
                        let resp = await App.proxy({ url: `https://api.telegram.org/bot${this.token}/getFile?file_id=${voiceid}`, bodytype: "json" })
                        let bin = await App.proxy({ url: `https://api.telegram.org/file/bot${this.token}/${resp.body.result.file_path}`, bodytype: "binary" })
                        await this.on.audio({ msgid: update.message.message_id, person, data: bin.body, chat: update.message.chat })
                    }
                    if (update.message?.audio) {
                        if (this.cancelrepeatitive(person, update.message.audio.file_id.toString()))
                            return
                        let _id = update.message.audio.file_id
                        let resp = await App.proxy({ url: `https://api.telegram.org/bot${this.token}/getFile?file_id=${_id}`, bodytype: "json" })
                        let bin = await App.proxy({ url: `https://api.telegram.org/file/bot${this.token}/${resp.body.result.file_path}`, bodytype: "binary" })
                        await this.on.audio({ msgid: update.message.message_id, person, data: bin.body, chat: update.message.chat })
                    }
                    if (update.message?.contact) {
                        if (this.cancelrepeatitive(person, JSON.stringify(update.message.contact)))
                            return
                        await this.on.contact({ msgid: update.message.message_id, person, contact: update.message.contact, chat: update.message.chat })
                    }
                    if (update.message?.poll) {
                        if (this.cancelrepeatitive(person, JSON.stringify(update.message.poll)))
                            return
                        await this.on.poll({ msgid: update.message.message_id, person, poll: update.message.poll, chat: update.message.chat })
                    }
                    if (update.message?.location) {
                        if (this.cancelrepeatitive(person, JSON.stringify(update.message?.location)))
                            return
                        await this.on.location({ msgid: update.message.message_id, person, location: update.message.location, chat: update.message.chat })
                    }
                    else if (update.message?.document) {
                        if (this.cancelrepeatitive(person, update.message?.document.file_id.toString()))
                            return
                        let fileid = update.message.document.file_id
                        let resp = await App.proxy({ url: `https://api.telegram.org/bot${this.token}/getFile?file_id=${fileid}`, bodytype: "json" })
                        let filebin = await App.proxy({ url: `https://api.telegram.org/file/bot${this.token}/${resp.body.result.file_path}`, bodytype: "binary" })
                        let ext = resp.body.result.file_path.split(".").at(-1)
                        await this.on.document({ msgid: update.message.message_id, person, data: filebin.body, chat: update.message.chat, extension: ext })
                    }
                    else if (update.message?.text) {
                        if (this.cancelrepeatitive(person, update.message.text))
                            return
                        let msgid = SerialGenerator(10)
                        this.msgstore[msgid] = { text: update.message.text, chat_id: update.message.chat.id, message_id: update.message.message_id }
                        await this.on.text({ msgid, person, text: update.message.text, chat: update.message.chat })
                    }
                });
            }

            stop() {
                clearInterval(this.c)
            }

            on = {
                inline: {
                    start: async (specs: { inlineid: string, person: Person, query: string }): Promise<{
                        title: string,
                        text: string,
                        description: string,
                        buttons: Array<Array<{ text: string, data: object }>>
                    }> => { return { text: "", description: "", title: "", buttons: [[{ text: "-", data: {} }]] } },
                    button: async (
                        specs: {
                            inlineid: string,
                            inline_msg_id: string,
                            person: Person,
                            chat_instance: string,
                            data: object
                        }): Promise<{
                            popup: string,
                            alert: boolean,
                            text?: string,
                            parse_mode?: "Markdown" | "HTML",
                            buttons?: Array<Array<{ text: string, data: object }>>,
                        }> => { return { popup: "", alert: false } }
                },
                text: async (specs: { msgid: string, person: Person, text: string, chat: Chat }): Promise<void> => { },
                button: async (specs: { msgid: string, person: Person, data: object, chat: Chat }): Promise<{
                    popup: string,
                    alert: boolean,
                    text?: string,
                    parse_mode?: "Markdown" | "HTML",
                    buttons?: Array<Array<{ text: string, data: object }>>,
                }> => { return { popup: "", alert: false } },
                photo: async (specs: { msgid: MessageID, person: Person, data: NodeJS.ArrayBufferView<ArrayBufferLike> | string, chat: Chat }): Promise<void> => { },
                audio: async (specs: { msgid: MessageID, person: Person, data: NodeJS.ArrayBufferView<ArrayBufferLike> | string, chat: Chat }): Promise<void> => { },
                contact: async (specs: { msgid: MessageID, person: Person, contact: Contact, chat: Chat }): Promise<void> => { },
                poll: async (specs: { msgid: MessageID, person: Person, poll: Poll, chat: Chat }): Promise<void> => { },
                location: async (specs: { msgid: MessageID, person: Person, location: Location, chat: Chat }): Promise<void> => { },
                document: async (specs: { msgid: MessageID, person: Person, data: NodeJS.ArrayBufferView<ArrayBufferLike> | string, chat: Chat, extension: string }): Promise<void> => { },
            }

            edit = {
                normal: async (specs: { msgid: string, text?: string, buttons?: Array<Array<{ text: string, data?: any, url?: string }>>, parse_mode?: string }) => {
                    let msg = this.msgstore[specs.msgid]
                    if (specs.text)
                        msg.text = specs.text
                    if (specs.buttons)
                        msg.buttons = specs.buttons
                    await this.editMessageText({
                        message_id: msg.message_id,
                        chat_id: msg.chat_id,
                        parse_mode: specs.parse_mode || "Markdown",
                        text: specs.text || msg.text,
                        buttons: this.convertbuttons(specs.buttons || msg.buttons, specs.msgid)
                    })
                },

                inline: async (specs: any, text?: string, buttons?: any) => {
                    if (specs.inline_msg_id) {
                        if (text && buttons) {
                            await this.editMessageText({
                                "inline_message_id": specs.inline_msg_id,
                                reply_markup: {
                                    inline_keyboard: buttons,
                                },
                                "text": text,
                                parse_mode: "Markdown"
                            })
                        }
                        else if (!text && buttons) {
                            await this.editMessageText({
                                "inline_message_id": specs.inline_msg_id,
                                reply_markup: {
                                    inline_keyboard: buttons,
                                },
                                "text": text,
                                parse_mode: "Markdown"
                            })
                        }
                    }
                }
            }

            resetLastdata = (id: number) => {
                delete this.lastdata[id]
            }
            cancelrepeatitive = (person: Person, data: any) => {
                if (this.lastcmd[person.id] && (new Date().getTime() - this.lastcmd[person.id]) < 1000 && JSON.stringify(data) == this.lastdata[person.id]) {
                    return true
                }
                if (this.lastcmd[person.id] && (new Date().getTime() - this.lastcmd[person.id]) < 500) {
                    return true
                }
                this.lastcmd[person.id] = new Date().getTime()
                if (typeof data == "string")
                    this.lastdata[person.id] = JSON.stringify(data)
            }

            column2(arr) {
                let result = [];
                for (let i = 0; i < arr.length - 1; i += 2) {
                    result.push([arr[i], arr[i + 1]]);
                }
                if (arr.length % 2 !== 0 && arr[arr.length - 1] !== arr.length) {
                    result.push([arr[arr.length - 1]]);
                }
                return result;
            }

            column3(arr) {
                let result = [];
                for (let i = 0; i < arr.length; i += 3) {
                    let group = arr.slice(i, i + 3);
                    result.push(group);
                }
                return result;
            }

            column4(arr) {
                let result = [];
                for (let i = 0; i < arr.length; i += 4) {
                    let group = arr.slice(i, i + 4);
                    result.push(group);
                }
                return result;
            }

            public async send(specs: { text: string, buttons?: Array<Array<{ text: string, data?: any, url?: string }>>, reply_to_message_id?: number },
                originalmsgspecs: { msgid: string, person: Person, text?: string, data?: any, chat: Chat }) {
                let tosend = JSON.parse(JSON.stringify(specs)) as any
                tosend.chat_id = originalmsgspecs.chat.id
                let msgid = SerialGenerator(10)
                if (specs.buttons) {
                    tosend["reply_markup"] = {
                        inline_keyboard: this.convertbuttons(specs.buttons, msgid)
                    }
                    delete tosend["buttons"]
                }
                let msg = await this.sendMessage(tosend)
                this.msgstore[msgid] = { ...specs, message_id: msg.message_id, chat_id: msg.chat.id }
                return { msgid }
            }


            public async reply(specs: { text: string, buttons?: Array<Array<{ text: string, data?: any, url?: string }>> },
                originalmsgspecs: { msgid?: string, person: Person, text?: string, data?: any, chat: Chat }, replyto_msgid: string) {
                let tosend = JSON.parse(JSON.stringify(specs)) as any
                tosend.chat_id = originalmsgspecs.chat.id
                tosend.reply_to_message_id = this.msgstore[replyto_msgid].message_id;
                let msgid = SerialGenerator(10);
                if (specs.buttons) {
                    tosend["reply_markup"] = {
                        inline_keyboard: this.convertbuttons(specs.buttons, msgid)
                    }
                    delete tosend["buttons"]
                }
                let msg = await this.sendMessage(tosend)
                this.msgstore[msgid] = { ...specs, message_id: msg.message_id, chat_id: msg.chat.id }
                return { msgid }
            }

            private async request<T>(method: string, params: object = null): Promise<T> {
                try {
                    // this.offset++
                    let data = await App.proxy({
                        url: `${this.apiUrl}/${method}`, bodytype: "json", body: params,
                    })
                    if (!data?.body?.result) {
                        if (global.wsdebug)
                            console.log("Telegram Error:", data, "Request:", { method, params })
                    }
                    return data?.body?.result || null
                } catch (error) {
                    if (global.wsdebug)
                        console.error(`Telegram API error: ${error}`);
                    return null
                }
            }

            public async getMe(): Promise<User> {
                return this.request<User>("getMe");
            }

            public async getChatMember(channelusername: string, user_id: number): Promise<ChatMember> {
                return this.request<ChatMember>("getChatMember", { chat_id: channelusername, user_id });
            }

            private async getUpdates(): Promise<Update[]> {

                const updates = await this.request<Update[]>("getUpdates", {
                    offset: this.offset,
                    //  allowed_updates: [
                    //     "chosen_inline_result", "inline_query", "update_id", "message", "edited_message",
                    //     "channel_post",
                    //     "edited_channel_post", "business_connection", "business_message", "edited_business_message",
                    //     "deleted_business_messages", "message_reaction", "message_reaction_count", "callback_query", "shipping_query",
                    //     "pre_checkout_query", "purchased_paid_media", 'poll', "poll_answer", "my_chat_member", "chat_member",
                    //     "chat_join_request", "chat_boost", "removed_chat_boost",
                    // ]
                });

                if (updates && updates.length > 0) {
                    this.offset = updates[updates.length - 1].update_id + 1;
                }
                // console.log("start getting:", updates?.[0]?.channel_post?.chat)
                return updates;
            }

            public async answerCallbackQuery(options): Promise<any> {
                return this.request<any>("answerCallbackQuery", options);
            }

            public async editMessageText(options): Promise<any> {
                options.parse_mode = "Markdown";
                return this.request<any>("editMessageText", options);
            }

            public async forwardMessage(options): Promise<any> {
                return this.request<any>("forwardMessage", options);
            }

            public async answerInlineQuery(options): Promise<any> {

                return this.request<any>("answerInlineQuery", options);
            }


            public async sendMessage(options: SendMessageOptions): Promise<Message> {
                let msg = JSON.stringify(options)
                if (this.lastmsgjson == msg) {
                    // console.log("repeatitive cancel...")
                    return
                }
                this.lastmsgjson = msg
                if (!options.parse_mode) {
                    options.parse_mode = "Markdown"
                }
                let answer = await this.request<Message>("sendMessage", options);
                let count = 3
                while (!answer && count-- > 0) {
                    // console.log("retry...")
                    await sleep(1000)
                    answer = await this.request<Message>("sendMessage", options);
                }
                return answer
            }

            public async sendPhoto(options: SendPhotoOptions): Promise<Message> {
                return this.request<Message>("sendPhoto", options);
            }

            public async sendFile(options: SendFileOptions): Promise<Message> {
                let extension = ".dat"
                if (options.type == "photo") {
                    extension = ".png"
                }
                else if (options.type == "video") {
                    extension = ".mp4"
                }
                else if (options.type == "audio") {
                    extension = ".mp3"
                }
                else if (options.type == "zip") {
                    extension = ".zip"
                }
                let url = await App.uploader(options.file, 300, extension)
                await sleep(5000);
                return this.request<Message>("sendDocument", {
                    chat_id: options.chat_id,
                    document: url,
                    caption: options.caption,
                    disable_notification: options.disable_notification,
                    reply_to_message_id: options.reply_to_message_id
                });
            }

            private async setWebhook(url: string): Promise<boolean> {
                return this.request<boolean>("setWebhook", { url });
            }

            public async deleteWebhook(): Promise<boolean> {
                return this.request<boolean>("deleteWebhook");
            }

            public async startPolling(callback: (update: Update) => void): Promise<void> {
                this.c = setInterval(async () => {
                    try {
                        const updates = await this.getUpdates();
                        for (const update of updates || []) {
                            callback(update);
                        }
                    } catch (error) {
                        // if (global.wsdebug)
                        console.error("Error fetching updates:", error);
                    }
                }, this.pollingInterval);
            }
        }
    }




}





