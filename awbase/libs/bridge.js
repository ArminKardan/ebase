var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var bridge_exports = {};
__export(bridge_exports, {
  App: () => App
});
module.exports = __toCommonJS(bridge_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_figlet = __toESM(require("figlet"));
var import_Prototypes = require("./Prototypes");
var import_mongodb = require("mongodb");
var import_dotenv = __toESM(require("dotenv"));
var import_pako = __toESM(require("pako"));
var import_dynamic = require("./dynamic");
const { client, xml } = require("./xmpp.min.js");
var zlib = require("zlib");
const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");
function encrypt(text, password) {
  const key = crypto.createHash("sha256").update(password).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    ciphertext.toString("base64"),
    authTag.toString("base64")
  ].join(":");
}
function decrypt(encryptedBase64, password) {
  const [ivB64, ciphertextB64, tagB64] = encryptedBase64.split(":");
  const key = crypto.createHash("sha256").update(password).digest();
  const iv = Buffer.from(ivB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
async function getFilesInDirectory(dirPath) {
  return new Promise((resolve, reject) => {
    import_fs.default.readdir(dirPath, (err, entries) => {
      if (err) return reject(err);
      const filePaths = [];
      entries.forEach((entry) => {
        const fullPath = import_path.default.join(dirPath, entry);
        const stat = import_fs.default.statSync(fullPath);
        if (stat.isFile()) {
          filePaths.push(fullPath);
        }
      });
      resolve(filePaths);
    });
  });
}
function deflateToBase64(input) {
  const inputData = new TextEncoder().encode(input);
  const compressedData = import_pako.default.deflate(inputData);
  const base64String = Buffer ? Buffer.from(compressedData).toString("base64") : btoa(String.fromCharCode(...compressedData));
  return base64String;
}
function inflateFromBase64(base64String) {
  const compressedData = Buffer ? Uint8Array.from(Buffer.from(base64String, "base64")) : Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const decompressedData = import_pako.default.inflate(compressedData, { to: "string" });
  return decompressedData;
}
global.sleep = (ms) => {
  return new Promise((r) => setTimeout(() => r(null), ms));
};
var App;
((App2) => {
  let c;
  function convertMinutes(minutes) {
    if (minutes < 1) return "\u0627\u06A9\u0646\u0648\u0646";
    if (minutes < 60) return `${minutes.toLocaleString("fa-IR")} \u062F\u0642\u06CC\u0642\u0647`;
    if (minutes < 24 * 60) return `${Math.floor(minutes / 60).toLocaleString("fa-IR")} \u0633\u0627\u0639\u062A`;
    if (minutes < 30 * 24 * 60) return `${Math.floor(minutes / (24 * 60)).toLocaleString("fa-IR")} \u0631\u0648\u0632`;
    return `${Math.floor(minutes / (30 * 24 * 60)).toLocaleString("fa-IR")} \u0645\u0627\u0647`;
  }
  App2.encryptor = async (text, password) => {
    return await encrypt(text, password);
  };
  App2.decryptor = async (encryptedBase64, password) => {
    return await decrypt(encryptedBase64, password);
  };
  const Declareglobals = async () => {
    global.jidhash = {};
    setInterval(() => {
      global.jidhash = {};
    }, 6e4);
    global.xmppapicb = {};
    global.nexus = {
      agent: {},
      subscribe: async (channel) => {
        console.log("subscribing to:", `${channel + "@conference.qepal.com"}/${global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource}`);
        await global.xmpp.send(global.xmppxml(
          "presence",
          { to: `${channel + "@conference.qepal.com"}/${global.app + "-" + global.uid.toString() + "-" + c.resource + "-" + global.xmrole}` }
        ));
        global.nexus.channels.add(channel);
        return 0;
      },
      unsubscribe: async (channel) => {
        global.xmpp.send(global.xmppxml(
          "presence",
          {
            to: `${channel + "@conference.qepal.com"}`,
            type: "unavailable"
          }
        ));
      },
      on: {
        direct: (cb) => {
          if (!global.xmpp_on_pool) {
            global.xmpp_on_pool = [];
          }
          let id = SerialGenerator(5);
          global.xmpp_on_pool.push({ id, type: "direct", cb });
          return id;
        },
        channel: (channelname, cb) => {
          if (!global.xmpp_on_pool) {
            global.xmpp_on_pool = [];
          }
          let id = SerialGenerator(5);
          global.xmpp_on_pool.push({ id, type: "channel", channelname, cb });
          return id;
        }
      },
      clearon: (id) => {
        if (id == "all") {
          global.xmpp_on_pool = [];
        } else {
          global.xmpp_on_pool = global.xmpp_on_pool.filter((p) => p.id != id && p.channelname != id && p.type != id);
        }
      },
      channels: /* @__PURE__ */ new Set(),
      msgreceiver: () => {
      },
      connected: false,
      find: async (specs) => {
        let json = await api(
          "https://qepal.com/api/bridge/worker/findfreeresource",
          {
            app: specs.app,
            secret: process.env.EXPLORE_SECRET || process.env.SERVICE_SECRET,
            ownership: specs.ownership,
            resource: specs.resource
          }
        );
        if (json.code != 0) {
          return { code: -2e3, msg: "no free worker found." };
        }
        let jids = json["jids"];
        return { code: 0, jids };
      },
      api: async (specs) => {
        let md5 = MD5(JSON.stringify({
          app: specs.app,
          ownership: specs.ownership,
          resource: specs.resource,
          jid: specs.jid,
          prioritize_mine: specs.prioritize_mine
        }));
        let jid = specs.jid;
        if (!jid) {
          if (global.jidhash[md5]) {
            jid = global.jidhash[md5];
          } else {
            let json = await api(
              "https://qepal.com/api/bridge/worker/findfreeresource",
              {
                app: specs.app,
                secret: process.env.EXPLORE_SECRET || process.env.SERVICE_SECRET,
                ownership: specs.ownership,
                resource: specs.resource
              }
            );
            if (json.code != 0) {
              return { code: -2e3, msg: "no free worker found." };
            }
            let jids = json["jids"];
            if (jids.length > 0) {
              jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
            }
          }
        }
        global.jidhash[md5] = jid;
        if (!jid) {
          console.error("nexus: no jid found.");
        }
        return new Promise(async (resolve) => {
          let mid = SerialGenerator(10);
          let msg = JSON.stringify({
            mid,
            api: specs.cmd,
            ...specs.body || {}
          });
          msg = deflateToBase64(msg);
          if (msg.length > 4096) {
            return "too large, max: 4Kbytes";
          }
          let c2 = setTimeout(() => {
            resolve({ error: "timeout" });
          }, 120 * 1e3);
          global.xmppapicb[mid] = {
            mid,
            cb: (ob) => {
              clearTimeout(c2);
              resolve(ob);
            }
          };
          await global.xmpp.send(global.xmppxml(
            "message",
            { to: jid, type: "chat" },
            // type: "chat" for one-to-one messages
            global.xmppxml(
              "body",
              {},
              msg
            )
          ));
        });
      },
      direct: async (specs) => {
        specs.body = JSON.stringify(specs.body);
        let md5 = MD5(JSON.stringify({
          app: specs.app,
          ownership: specs.ownership,
          resource: specs.resource,
          jid: specs.jid,
          prioritize_mine: specs.prioritize_mine
        }));
        let jid = specs.jid;
        if (!jid) {
          if (global.jidhash[md5]) {
            jid = global.jidhash[md5];
          } else {
            let json = await api(
              "https://qepal.com/api/bridge/worker/findfreeresource",
              {
                app: specs.app,
                secret: process.env.EXPLORE_SECRET || process.env.SERVICE_SECRET,
                ownership: specs.ownership,
                resource: specs.resource
              }
            );
            if (json.code != 0) {
              return { code: -2e3, msg: "no free worker found." };
            }
            let jids = json["jids"];
            if (jids.length > 0) {
              jid = specs.prioritize_mine ? jids[0] : jids.at(-1);
            }
          }
        }
        global.jidhash[md5] = jid;
        if (!jid) {
          console.error("nexus: no jid found.");
        }
        let bd = deflateToBase64(specs.body);
        if (bd.length > 4096) {
          return "too large, max: 4Kbytes";
        }
        await global.xmpp.send(global.xmppxml(
          "message",
          { to: jid, type: "chat" },
          // type: "chat" for one-to-one messages
          global.xmppxml(
            "body",
            {},
            bd
          )
        ));
      },
      sendtojid: async (jid, body) => {
        body = JSON.stringify(body);
        let bd = zlib.deflateSync(body).toString("base64");
        if (bd.length > 4096) {
          return "too large, max: 4Kbytes";
        }
        await global.xmpp.send(global.xmppxml(
          "message",
          { to: jid, type: "chat" },
          // type: "chat" for one-to-one messages
          global.xmppxml(
            "body",
            {},
            bd
          )
        ));
      },
      sendtochannel: async (channel, body) => {
        body = JSON.stringify(body);
        let bd = zlib.deflateSync(body).toString("base64");
        if (bd.length > 4096) {
          return "too large, max: 4Kbytes";
        }
        let subs = global.nexus.channels;
        if (!subs.has(channel)) {
          await global.nexus.subscribe(channel);
          await sleep(500);
        }
        await global.xmpp.send(global.xmppxml(
          "message",
          {
            to: `${channel}@conference.qepal.com`,
            from: `${global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource}@qepal.com/${c.resource}`,
            type: "groupchat"
          },
          global.xmppxml(
            "body",
            {},
            bd
          )
        ));
      }
    };
  };
  let Events = [];
  function on(api2, cb) {
    Events.push({ api: api2, cb });
  }
  App2.on = on;
  async function Init() {
    let envs = await getFilesInDirectory("./envs");
    for (let p of envs) {
      import_dotenv.default.config({ path: p });
    }
    (0, import_dynamic.Loopez)();
  }
  App2.Init = Init;
  async function initUDB() {
    if (!process.env.UMONGOURL && process.env.EXPLORE_SECRET) {
      let json = await api(
        "https://qepal.com/api/explore/getmongourl",
        { secret: process.env.EXPLORE_SECRET }
      );
      if (json.code == 0 && json.mongourl) {
        process.env.UMONGOURL = json.mongourl;
        process.env.UMONGODB_DB = json.mongourl.split(":")[1].replace("//", "");
      }
    }
    if (process.env.UMONGOURL && process.env.EXPLORE_SECRET) {
      try {
        var uclient = new import_mongodb.MongoClient(process.env.UMONGOURL);
        let umongo = await uclient.connect();
        global.udb = umongo.db(process.env.UMONGODB_DB);
        await uclient.db().command({ ping: 1 });
        console.log("udb-mongo successfully connected.");
      } catch {
        console.error("udb-mongo connection failed.");
      }
    }
    if (!process.env.XMONGOURL && process.env.SERVICE_SECRET) {
      let json = await api(
        "https://qepal.com/api/service/getmongourl",
        { secret: process.env.SERVICE_SECRET }
      );
      if (json.code == 0 && json.mongourl) {
        process.env.XMONGOURL = json.mongourl;
        process.env.XMONGODB_DB = json.mongourl.split(":")[1].replace("//", "");
      }
    }
    if (process.env.XMONGOURL && process.env.SERVICE_SECRET) {
      try {
        var xclient = new import_mongodb.MongoClient(process.env.XMONGOURL);
        let xmongo = await xclient.connect();
        global.xdb = xmongo.db(process.env.XMONGODB_DB);
        await xclient.db().command({ ping: 1 });
        console.log("xdb-mongo successfully connected.");
      } catch {
        console.error("xdb-mongo connection failed.");
      }
    }
  }
  App2.initUDB = initUDB;
  async function payg(specs) {
    if (!process.env.EXPLORE_SECRET) {
      throw "Explore secret is missing and its necessary when you call PAYG function.";
    }
    return await api("https://qepal.com/api/service/payg", {
      uid: specs.uid,
      amount: specs.amount,
      unit: specs.unit,
      exploresecret: process.env.EXPLORE_SECRET,
      details: specs.details
    });
  }
  App2.payg = payg;
  async function usequota(specs) {
    if (!process.env.EXPLORE_SECRET) {
      throw "Explore secret is missing and its necessary when you call PAYG function.";
    }
    return await api("https://qepal.com/api/service/usequota", {
      uid: specs.uid,
      amount: specs.amount,
      exploresecret: process.env.EXPLORE_SECRET,
      details: specs.details
    });
  }
  App2.usequota = usequota;
  async function Connect(config) {
    let appname = import_path.default.basename(import_path.default.join(__dirname, "../../"));
    let workername = import_path.default.basename(import_path.default.join(__dirname, "../"));
    global.resource = workername + "." + appname + ".dev";
    if (process.env.RESOURCE) {
      global.resource = process.env.RESOURCE;
    }
    let secret = null;
    if (process.env.EXPLORE_SECRET) {
      secret = process.env.EXPLORE_SECRET;
    }
    if (process.env.SERVICE_SECRET) {
      secret = process.env.SERVICE_SECRET;
    }
    if (!secret) {
      throw "No service or explore secret code found in envs.";
    }
    let json = await (await fetch("https://qepal.com/api/bridge/worker/service", {
      method: "POST",
      body: JSON.stringify({
        secret,
        image: config.image,
        resource: global.resource,
        public: config.public
      })
    })).json();
    if (json.code != 0) {
      throw "ERROR: ****WRONG SECRETKEY IN ENVS****";
    }
    global.app = json.app;
    global.xmrole = json.role;
    global.uid = import_mongodb.ObjectId.createFromHexString(json.uid);
    global.myjid = json.user + "@qepal.com/" + global.resource;
    c = { app: json.app, image: config.image, public: config.public, resource: global.resource };
    if (global.wsdebug) console.log("Connect function calling...");
    for (let i = 2; i < process.argv.length; i++) {
      const [key, value] = process.argv[i].split("=");
      if (c.hasOwnProperty(key)) {
        if (value === "null") {
          c[key] = null;
        } else if (!isNaN(Number(value))) {
          c[key] = Number(value);
        } else if (value === "true" || value === "false") {
          c[key] = value === "true";
        } else if (value.startsWith("[") && value.endsWith("]")) {
          c[key] = JSON.parse(value);
        } else {
          c[key] = value;
        }
      }
    }
    return await new Promise(async (r) => {
      const nicknameToJidMap = {};
      const xmpp = client({
        service: "wss://bridge.qepal.com/ws",
        domain: "qepal.com",
        resource: global.resource,
        username: json.user,
        password: json.password
      });
      global.xmpp = xmpp;
      global.xmppxml = xml;
      global.xmppclient = client;
      const users = {};
      Declareglobals();
      let isReconnecting = false;
      function reconnect() {
        if (isReconnecting) {
          if (global.wsdebug)
            console.log("Reconnection already in progress. Skipping...");
          return;
        }
        if (global.wsdebug)
          console.log("Attempting to reconnect...");
        isReconnecting = true;
        xmpp.stop().then(() => {
          xmpp.start().catch((err) => {
            if (global.wsdebug)
              console.error("Reconnection failed:", err.message);
            setTimeout(reconnect, 5e3);
          });
        }).catch((err) => {
          if (global.wsdebug)
            console.error("Failed to stop XMPP client:", err.message);
          setTimeout(reconnect, 5e3);
        }).finally(() => {
          isReconnecting = false;
        });
      }
      xmpp.on("error", (err) => {
        if (err.message.includes("network error") || err.message.includes("non-101 status code")) {
          reconnect();
        }
      });
      xmpp.on("offline", () => {
        reconnect();
      });
      xmpp.on("stanza", async (stanza) => {
        if (stanza.is("presence")) {
          const from = stanza.attrs.from;
          const x = stanza.getChild("x", "http://jabber.org/protocol/muc#user");
          if (x) {
            const item = x.getChild("item");
            if (item && item.attrs.jid) {
              nicknameToJidMap[from] = item.attrs.jid;
            }
          }
        }
        if (stanza.is("message")) {
          let bdd = stanza.getChildText("body");
          try {
            bdd = inflateFromBase64(bdd);
          } catch {
          }
          const body = bdd;
          let from = stanza.attrs.from;
          let itsme = from.includes(global.app + "-" + global.uid.toString() + "-" + global.xmrole + "-" + c.resource);
          let itsbro = !itsme && from.includes(global.app + "-" + global.uid.toString());
          if (body && !stanza.getChild("delay")) {
            let json2 = null;
            if (body.trim().startsWith("{") || body.trim().startsWith("[")) {
              try {
                json2 = JSON.parse(body);
                if (json2.api && !from.includes("@conference.qepal.com")) {
                  let found = false;
                  for (let ev of Events) {
                    if (ev.api == json2.api) {
                      let { api: api2, mid, ...data } = json2;
                      let uid = null;
                      let resource = null;
                      let head = from.split("@qepal.com/");
                      let heads = head[0].split("-");
                      let app = heads[0];
                      let ___useruid = heads[1];
                      let role = heads[2];
                      if (___useruid.length == 24 && import_mongodb.ObjectId.isValid(___useruid)) {
                        uid = ___useruid;
                      }
                      resource = head[1];
                      let res = { code: -500, msg: "not implemented." };
                      let servid = null;
                      let servsecret = null;
                      if (!users[uid] && process.env.SERVICE_SECRET) {
                        let json3 = await global.api("https://qepal.com/api/service/getbysecret", {
                          servicesecret: process.env.SERVICE_SECRET,
                          uid
                        });
                        if (json3.code != 0) {
                          if (app != global.app || role != "partner" && role != "owner") {
                            res = { code: -3e3, msg: "you dont have active service." };
                          }
                        } else {
                          servid = json3.servid;
                          servsecret = process.env.SERVICE_SECRET;
                          users[uid] = { servid, servsecret };
                        }
                      } else if (!users[uid] && process.env.EXPLORE_SECRET) {
                        let json3 = await global.api("https://qepal.com/api/service/hasaliveservice", {
                          exploresecret: process.env.EXPLORE_SECRET,
                          uid
                        });
                        if (json3.code != 0) {
                          if (app != global.app || role != "partner" && role != "owner") {
                            res = { code: -3e3, msg: "you dont have active service." };
                          }
                        } else {
                          servid = json3.servid;
                          servsecret = json3.secret;
                          users[uid] = { servid, servsecret };
                        }
                      } else if (users[uid]) {
                        servid = users[uid]["servid"];
                        servsecret = users[uid]["secret"];
                      }
                      if (res.code != -3e3)
                        res = await ev.cb({
                          uid,
                          role,
                          app,
                          resource,
                          servid,
                          servsecret,
                          body: data
                        });
                      await xmpp.send(xml(
                        "message",
                        { to: from, type: "chat" },
                        // type: "chat" for one-to-one messages
                        xml(
                          "body",
                          {},
                          deflateToBase64(JSON.stringify({ ...res, mid: json2.mid }))
                        )
                      ));
                      found = true;
                    }
                  }
                  if (found) {
                    return;
                  }
                } else if (json2.mid && global.xmppapicb[json2.mid]) {
                  let mid = json2.mid;
                  delete json2.mid;
                  global.xmppapicb[mid].cb(json2);
                  return;
                }
              } catch {
              }
            }
            {
              let channel = null;
              let uid = null;
              let resource = null;
              let role = null;
              let app = null;
              if (from.includes("@conference.qepal.com")) {
                channel = from.split("@")[0];
                let f = nicknameToJidMap[from];
                if (f)
                  from = f;
              }
              let ss = from.split("@qepal.com/");
              let head = ss[0];
              let tail = ss[1];
              let heads = head.split("-");
              app = heads[0];
              uid = heads[1];
              role = heads[2];
              resource = tail;
              if (uid == global.uid.toHexString()) {
                itsbro = true;
                if (global.resource == resource) {
                  itsme = true;
                }
              }
              if (heads.length == 3 || heads.length == 4) {
                if (uid.length == 24 && import_mongodb.ObjectId.isValid(uid)) {
                  global.nexus.msgreceiver({ fromjid: from, body: json2, role, channel, app, uid, resource, itsme, itsbro });
                  if (!itsme && json2) {
                    if (global.xmpp_on_pool && global.xmpp_on_pool.length > 0) {
                      for (let p of global.xmpp_on_pool) {
                        if (p.type == "direct" && !channel) {
                          p.cb({ fromjid: from, body: json2, role, channel, app, uid, resource, itsme: false, itsbro });
                        } else if (p.type == "channel" && channel == p.channelname) {
                          p.cb({ fromjid: from, body: json2, role, channel, app, uid, resource, itsme: false, itsbro });
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
      xmpp.on("online", async (address) => {
        xmpp.send(xml("presence"));
        console.log(`[nexus-${global.resource}] connected.`);
        r(c);
      });
      xmpp.start().catch((err) => {
        reconnect();
      });
      process.on("uncaughtException", (err) => {
      });
      process.on("unhandledRejection", (err) => {
      });
      process.on("exit", async () => {
        if (global.wsdebug)
          console.log("exiting...");
        xmpp.stop().catch((err) => {
        });
      });
      App2.on("ping", async (specs) => {
        return { code: 0, pong: true };
      });
    });
  }
  App2.Connect = Connect;
  App2.Figlet = (text) => {
    let data = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "./files/Big.flf"), "utf8");
    import_figlet.default.parseFont("Bigger", data);
    return import_figlet.default.textSync(text, "Bigger");
  };
  function generateRandomFileName(originalName) {
    const extension = import_path.default.extname(originalName);
    const hash = crypto.randomBytes(12).toString("hex");
    return `${hash}${extension}`;
  }
  const streamifier = require("streamifier");
  async function uploader(content, maxAgeSec, extension) {
    let onProgress = null;
    let uid = global.uid?.toString?.();
    if (!uid) {
      throw "UID Not found!";
    }
    if (extension && !extension.startsWith(".")) {
      extension = "." + extension;
    }
    let serverUrl = "https://cdn.qepal.com/qeupload/uploader.php";
    if (global.wsdebug) console.log("UID is:", uid);
    try {
      const newFileName = generateRandomFileName(extension ? `file${extension}` : "file.dat");
      const formData = new FormData();
      formData.append("uid", uid);
      formData.append("max_age_sec", maxAgeSec);
      formData.append("submit", "1");
      let bufferContent = Buffer.from("No data.", "utf8");
      if (Buffer.isBuffer(content)) {
        bufferContent = content;
      } else if (typeof content == "string") {
        bufferContent = Buffer.from(content, "utf-8");
      } else if (typeof content == "object") {
        bufferContent = Buffer.from(JSON.stringify(content, null, 2), "utf-8");
      }
      bufferContent = content;
      const bufferStream = streamifier.createReadStream(bufferContent);
      if (global.wsdebug) {
        console.log("Content type:", typeof content);
        console.log("Buffer Stream:", bufferStream);
        console.log("File to upload:", newFileName);
      }
      formData.append("filesToUpload[]", bufferStream, newFileName);
      const response = await axios.post(serverUrl, formData, {
        // headers: { ...formData.getHeaders() },
        // maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const total = progressEvent.total || bufferContent.length;
            if (!total) {
              console.error("No total size found in progress event.");
              return;
            }
            let percent = 0;
            if (total) {
              percent = Math.floor(progressEvent.loaded / total * 100);
            }
            onProgress(percent);
          }
        }
      });
      return `https://cdn.qepal.com/qeupload/${uid}/${newFileName}`;
    } catch (error) {
      console.error(`Upload failed for Buffer:`, error);
      if (error.response) {
        if (global.wsdebug) console.error("Response from server:", error.response.data);
      } else {
        if (global.wsdebug) console.error("Error message:", error.message);
      }
    }
  }
  App2.uploader = uploader;
  async function downloader(url, proxy2 = false) {
    if (proxy2) {
      let data = await (await fetch("https://irmapserver.ir/api.php", {
        method: "POST",
        body: JSON.stringify({
          url,
          headers: {}
        })
      })).json();
      return Buffer.from(data.body, "base64");
    } else {
      try {
        const response = await axios.get(url, {
          responseType: "arraybuffer"
          // Ensure response is treated as raw binary data
        });
        const dataBuffer = Buffer.from(response.data);
        console.log(`Downloaded ${dataBuffer.length} bytes`);
        return dataBuffer;
      } catch (error) {
        console.error(`Error downloading from URL: ${url}`, error);
        throw error;
      }
    }
  }
  App2.downloader = downloader;
  async function proxy(specs) {
    let data = await (await fetch("https://irmapserver.ir/api.php", {
      method: "POST",
      body: JSON.stringify({
        url: specs.url,
        body: specs.body,
        headers: specs.headers || {}
      })
    })).json();
    if (specs.bodytype == "binary") {
      return { body: Buffer.from(data.body, "base64"), responseHeaders: data.responseHeaders };
    } else if (specs.bodytype == "string") {
      return { body: Buffer.from(data.body, "base64").toString("utf8"), responseHeaders: data.responseHeaders };
    } else if (specs.bodytype == "json") {
      return { body: JSON.parse(Buffer.from(data.body, "base64").toString("utf8")), responseHeaders: data.responseHeaders };
    }
  }
  App2.proxy = proxy;
})(App || (App = {}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  App
});
