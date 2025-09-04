import { ObjectId as MongoObjectId } from "mongodb";

const crypto = require('crypto');
declare global {
    interface String {
        between(str1: string, str2: string): string
    }

    interface Array<T> {
        includesid(element: T): Array<T>;
        toggle(element: T): Array<T>;
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
            ownership?: "mine" | "owner",
            resource?: string,
            prioritize_mine?: boolean
            jid?: string,
        }
        ) => Promise<any>,
        direct: (specs: {
            app: string,
            body: string,
            ownership?: "mine" | "owner",
            resource?: string,
            prioritize_mine?: boolean
            jid?: string,
        }) => Promise<any>,
        sendtojid: (jid: string, body: string) => Promise<any>,
        sendtochannel: (channel: string, body: any) => Promise<any>,
    }

    var nexus: NX

    function decryptor(text: string, key: string): Promise<string>
    function encryptor(text: string, key: string): Promise<string>
    function serialgenerator(length: number): string;

    function RemainingTime(bigger: Date | number, smaller: Date | number, region?: string, words?: Array<string>)
    function SerialGenerator(len: number): string
    function FAtoENRatio(inputString: string): number
    function MD5(data: string | Buffer): string
    function SHA256(input: string | Buffer): string
    function getRandomElements(arr: Array<any>, n: number): Array<any>
    function cdn(url: string): string;
    function api(url: string, data?: any): Promise<any>;
    namespace QSON {
        export function parse(input: string): any;
        export function stringify(input: Object): string;
    }
    var uid: MongoObjectId
    var xmrole: "user" | "partner" | "owner"
}

global.SerialGenerator = (len: number): string => {
    var chars = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < len; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

global.MD5 = (data: string | Buffer) => {
    const hash = crypto.createHash('md5');
    hash.update(data);
    const hashResult = hash.digest('hex');
    return hashResult;
}

global.encryptor = async function (text: string, password: string): Promise<string> {
    const isBrowser = typeof window !== 'undefined' && typeof window.crypto?.subtle !== 'undefined';
    const enc = new TextEncoder();
    const encodedPassword = enc.encode(password);

    const keyMaterial = isBrowser
        ? await window.crypto.subtle.digest('SHA-256', encodedPassword)
        : require('crypto').createHash('sha256').update(password).digest();

    const iv = isBrowser
        ? window.crypto.getRandomValues(new Uint8Array(12))
        : require('crypto').randomBytes(12);

    const key = isBrowser
        ? await window.crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['encrypt'])
        : null;

    const encrypted = isBrowser
        ? await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
        : (() => {
            const crypto = require('crypto');
            const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, iv);
            const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
            const authTag = cipher.getAuthTag();
            return Buffer.concat([ciphertext, authTag]);
        })();

    const buffer = isBrowser ? new Uint8Array(encrypted) : encrypted;
    const authTag = buffer.slice(-16);
    const ciphertext = buffer.slice(0, -16);

    const btoaFn = typeof btoa !== 'undefined'
        ? btoa
        : (str: string) => Buffer.from(str, 'binary').toString('base64');

    const joinBase64 = (buf: Uint8Array) => btoaFn(String.fromCharCode(...buf));

    return [
        joinBase64(iv),
        joinBase64(ciphertext as any),
        joinBase64(authTag as any)
    ].join(':');
};

global.decryptor = async function (encryptedBase64: string, password: string): Promise<string> {
    const [ivB64, ciphertextB64, tagB64] = encryptedBase64.split(':');
    const isBrowser = typeof window !== 'undefined' && typeof window.crypto?.subtle !== 'undefined';
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    const atobFn = typeof atob !== 'undefined'
        ? atob
        : (b64: string) => Buffer.from(b64, 'base64').toString('binary');

    const toUint8Array = (b64: string) =>
        Uint8Array.from(atobFn(b64), c => c.charCodeAt(0));

    const iv = toUint8Array(ivB64);
    const ciphertext = toUint8Array(ciphertextB64);
    const authTag = toUint8Array(tagB64);
    const data = new Uint8Array([...ciphertext, ...authTag]);

    const encodedPassword = enc.encode(password);
    const keyMaterial = isBrowser
        ? await window.crypto.subtle.digest('SHA-256', encodedPassword)
        : require('crypto').createHash('sha256').update(password).digest();

    const key = isBrowser
        ? await window.crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['decrypt'])
        : null;

    if (isBrowser) {
        const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
        return dec.decode(decrypted);
    } else {
        const crypto = require('crypto');
        const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial, iv);
        decipher.setAuthTag(Buffer.from(authTag));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(ciphertext)),
            decipher.final()
        ]);
        return decrypted.toString('utf8');
    }
};



global.SHA256 = (data: string | Buffer) => {
    if (typeof data != "string" && !(data instanceof Buffer)) {
        return ""
    }
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const hashResult = hash.digest('hex');
    return hashResult;
}


global.FAtoENRatio = (inputString: string) => {
    let latins = (inputString.match(/[A-Za-z0-9]/g) || []).length
    let persians = inputString.replace(/\n/g, "")
        .replace(/[A-Za-z0-9\s;]/g, "").replace(/\s/g, "").replace(/!@#$%^&*()_+\-={}\[\]:;"'<>,.?\/\\|~`\]/g, "").length
    let persianCount = (inputString.match(/[ا-ی]/g) || []).length;
    let englishCount = inputString.length;
    return latins ? persianCount / englishCount : 1000;
}

global.serialgenerator = (len: number): string => {
    var chars = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < len; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

global.getRandomElements = (arr, n) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}


global.MD5 = (data: string | Buffer) => {
    const hash = crypto.createHash('md5');
    hash.update(data);
    const hashResult = hash.digest('hex');
    return hashResult;
}

global.api = async (url: string, data?: any): Promise<any> => {
    if (data) {
        return await (await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })).json()
    }
    else {
        return await (await fetch(url)).json()
    }
}

global.QSON = {
    stringify: (obj) => JSON.stringify(obj),
    parse: (str) => JSON.parse(str)
}


if (typeof String.prototype.between === 'undefined') {
    Object.defineProperty(String.prototype, 'between', {
        value: function (startStr, endStr) {
            const startIndex = this.indexOf(startStr) + startStr.length;
            const endIndex = this.indexOf(endStr, startIndex);
            if (startIndex === -1 || endIndex === -1) {
                return null;
            }
            return this.slice(startIndex, endIndex);
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

if (typeof Array.prototype.includesid === 'undefined') {

    Object.defineProperty(Array.prototype, 'includesid', {
        value: function (objid) {
            if (!objid) {
                return false
            }
            return !!this.find(obj => obj.equals(objid))
        }
    });
}

if (typeof Array.prototype.toggle === 'undefined') {
    Object.defineProperty(Array.prototype, 'toggle', {
        value: function (el) {
            const index = this.indexOf(el);
            if (index !== -1) {
                this.splice(index, 1);
            } else {
                this.push(el);
            }
            return this;
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
}

global.ObjectId = MongoObjectId


global.RemainingTime = (bigger, smaller, region = "fa-IR", words = ["هم اکنون", "روز", "ساعت", "دقیقه"]) => {
    var bigdate = null
    let now = words[0]
    let days = words[1], hours = words[2], mins = words[3]


    if (typeof bigger == "number") {
        bigdate = new Date(bigger);
    }
    else if (typeof bigger == "string") {
        bigdate = new Date(Number(bigger));
    }
    else {
        bigdate = bigger
    }

    var smalldate = null
    if (typeof smaller == "number") {
        smalldate = new Date(smaller);
    }
    else if (typeof smaller == "string") {
        smalldate = new Date(Number(smaller));
    }
    else {
        smalldate = smaller
    }

    var out = "";
    if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 86400000) {
        out = ((bigdate.getTime() - smalldate.getTime()) / 86400000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + days
    }
    else if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 3600000) {
        out = ((bigdate.getTime() - smalldate.getTime()) / 3600000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + hours
    }
    else if (Math.abs(bigdate.getTime() - smalldate.getTime()) > 60000) {
        out = ((bigdate.getTime() - smalldate.getTime()) / 60000).toLocaleString(region, { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " " + mins
    }
    else {
        out = now
    }
    return (out || "").replace(" ", " ")
}

