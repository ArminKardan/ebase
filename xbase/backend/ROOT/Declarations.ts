import SSRVerify from '../SSRVerify'
import { Prosper } from '../SSRVerify'
import SerialGenerator from '@/frontend/components/qecomps/SerialGenerator'
import schedule from 'node-schedule'
import { ObjectId } from 'mongodb'
import Cacher from '../Cacher'
import '@/common/Prototypes'

export default async () => {


    global.workers = []

    global.ObjectId = ObjectId;


    global.sss = (arg1, arg2) => arg2 ? console.log(arg1, arg2) : console.log(arg1)
    global.sleep = async ms => await new Promise(r => setTimeout(() => r(null), ms)) as any
    global.fetchv2 = async (input, init) => {
        return await fetch(input, { ...init, redirect: 'manual' })
    }

    global.removefile = async (link: string) => {
        console.error("File remove is only available at frontend.")
    }

    Cacher.init();

    String.prototype.betweenxy = function (str1, str2, startindex = 0) {
        const startIndex = this.indexOf(str1, startindex);
        if (startIndex === -1) return '';

        const endIndex = this.indexOf(str2, startIndex + str1.length);
        if (endIndex === -1) return '';

        return this.substring(startIndex + str1.length, endIndex);
    }

    global.cacher = []

    global.MD5 = (data: string | Buffer) => {
        if (typeof data != "string" && !(data instanceof Buffer)) {
            return ""
        }
        const hash = crypto.createHash('md5');
        hash.update(data);
        const hashResult = hash.digest('hex');
        return hashResult;
    }

    global.SHA256 = (data: string | Buffer) => {
        if (typeof data != "string" && !(data instanceof Buffer)) {
            return ""
        }
        const hash = crypto.createHash('sha256');
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


    global.Schedule = function (hour?: number, minute?: number, second?: number, cb?): any {
        const rule = new schedule.RecurrenceRule();
        if (hour >= 0) {
            rule.hour = hour;
        }
        if (minute >= 0) {
            rule.minute = minute;
        }
        if (second >= 0) {
            rule.second = second;
        }
        return schedule.scheduleJob(rule, async function () {
            cb();
        })
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


    global.Round = (number, digits) => {
        if (digits >= 0) {
            return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
        }

        var factor = Math.pow(10, -digits);
        var rounded = Math.round(number / factor) * factor;

        if (digits == -1) {
            return Math.floor(rounded);
        } else {
            return Math.floor(rounded / 10) * 10;
        }
    }

    global.BotUID = new ObjectId('635111afff61db2b04928f45')

    global._srvs = []
    var crypto = require("crypto");
    global.SSRVerify = SSRVerify;//require('../SSRVerify')
    global.Prosper = Prosper;//require('../SSRVerify')
    global.visitors = {}
    global.visitorsM1 = {}
    global.visitorsH1 = {}
    global.visitorsD1 = {}
    global.wrongserialrequests = {}
    global.logcache = []
    global.sessionemailuidmap = {};
    global.expmsgcol = {};
    global.timeoffset = 0;
    if (!global.serialGenerator) {
        global.serialGenerator = SerialGenerator
    }
    global.captchas = {};
    if (!global.fs) {
        global.fs = require('fs')
    }
    if (!global.crypto) {
        global.crypto = crypto
    }
    if (!global.gethash) {
        global.gethash1 = hash => crypto.createHash('md5').update(hash).digest("hex").substr(0, 10)
    }

    if (!global.md5) {
        global.md5 = hash => crypto.createHash('md5').update(hash).digest("hex")
    }


    global.devices = {}

    if (!global.workers) {
        global.workers = []
    }

    global.temp = {}

    global.agent = {};

    global.Datasources = {} as any;

}


import crypto from 'crypto'

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