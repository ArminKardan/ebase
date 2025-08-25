import { NextApiRequest, NextApiResponse } from "next"
import { ObjectId } from "mongodb"

import requestIp from 'request-ip'
import rolecheck from "@/common/rolecheck"
import { RoleName } from "@/global"
import { EndUserType, MiddleUserType } from "@/frontend/user"
import { UnitName } from "@/common/dynamic"
import { langType } from "@/common/SiteConfig"
import xmongodblib from '../backend/mobgolib/xmongo'


export default async (req: NextApiRequest, res: NextApiResponse): Promise<APISession> => {

  global.port = Number(process.env.PORT)
  if (global.Startup != "OK") {
    if (global.Startup == "PENDING") {
      let counter = 0
      await new Promise(r => setInterval(() => { if (global.Startup != "PENDING") r(null); else { if ((counter++) % 20 == 0) console.log("WAITING...") } }, 100))
    }
    else {
      global.Startup = "PENDING";
      await (await import("@/startup.ts")).Run()
      global.Startup = "OK";
    }
  }

  global.devmode = global.DEVMODE || process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test"
  const userip = (requestIp.getClientIp(req)?.replace("::ffff:", "")) || "::"
  var post = req.method?.toLowerCase() == "post"

  if (req.body && typeof req.body != "string") {
    req.body = JSON.stringify(req.body)
  }
  if (req.body && !(req.body.startsWith("{") || req.body.startsWith("["))) {
    return ({ userip, body }) as any
  }


  var body = null
  // if (req.body && typeof req.body != "string")
  body = req.body
  post ? JSON.parse(req.body) : null;
  if (!body)
    body = {}

  if (typeof body == "string") {
    try {
      body = JSON.parse(body)
    } catch { }
  }

  if (post) {
    if (body?.expid) {
      body.expid = ObjectId.createFromHexString(body.expid)
    }
    if (body?.servid) {
      body.servid = ObjectId.createFromHexString(body.servid)
    }
    if (body?.chatid) {
      body.chatid = ObjectId.createFromHexString(body.chatid)
    }
    if (body?.msgid) {
      body.msgid = ObjectId.createFromHexString(body.msgid)
    }
    if (body?.transid) {
      body.transid = ObjectId.createFromHexString(body.transid)
    }
    if (body?.uid) {
      body.uid = ObjectId.createFromHexString(body.uid)
    }
  }



  if (process.env.PASSCODE && (body?.passcode || body?.PASSCODE) == process.env.PASSCODE) {
    return {
      enduser: {
        name: "Service Bot",
        role: ["admin", "bot"],
        uid: ObjectId.createFromHexString("635111afff61db2b04928f45"),
        rolecheck: (check) => rolecheck(check, ["admin", "bot"]),
        lang: "fa",
      },
      body,
      userip: "0.0.0.0"
    } as APISession
  }


  let session = {
    lang: "fa",
    secret: process.env.EXPLORE_SECRET,
    cchar: "us"
  } as any



  if (!global.sessioner) {
    global.sessioner = {}
  }

  let sid = ""
  let cookies = await import("cookies-next")
  if (cookies.hasCookie("sid-" + port, { req, res })) {
    try {
      sid = cookies.getCookie("sid-" + port, { req, res })
      session = JSON.parse(JSON.stringify(global.sessioner?.[sid] || {}))
    } catch { }
  }

  let srv = {} as any


  let localenduser = null
  let topuser = null

  if (devmode)
    global._srvs = []

  if (body.secret && !session.secret) {
    session.secret = body.secret
    session.lang = "en"
    session.cchar = "us"
  }

  srv = global._srvs.find(s => s.secret == session.secret)

  // if (!session.secret && process.env.EXPLORE_SECRET) {
  //   session.secret = process.env.EXPLORE_SECRET
  // }
  if (global.devmode || !srv || (new Date().getTime() - srv.created) > 60000) {
    srv = await api("https://qepal.com/api/userv/servid", {
      secret: session.secret,
    })
    if (srv) {
      global._srvs.push({ ...srv, created: new Date().getTime(), servid: srv.servid, secret: session.secret })
    }
  }

  srv = JSON.parse(JSON.stringify(srv))

  if (srv && srv.topuser) {
    topuser = srv.topuser;
    topuser.uid = ObjectId.createFromHexString(topuser.uid.toString())
    delete srv.topuser
    srv.uid = ObjectId.createFromHexString((srv.uid || srv.servuid).toString())
    srv.servid = ObjectId.createFromHexString(srv.servid.toString())
    srv.expid = ObjectId.createFromHexString(srv.expid.toString())
  }

  if (!srv) {
    return { //fully illegal request
      code: -100,
      userip
    } as any
  }


  if (!global.xdb && srv.mongourl) {
    global.xmongo = await xmongodblib(srv.mongourl)
    let db = srv.mongourl.replace("mongodb://", "").split(":")[0]
    global.xdb = global.xmongo.db(db)
    console.log("Connection with X-Mongo DB was SUCCESSFULL , DB:", db)
  }
  else if (!global.xdb && !srv.mongourl) {
    throw "XSITE should have XMONGODB LINK (xdb), Please assign it from service."
  }



  let token = null
  if (cookies.hasCookie("session-token", { req, res })) {
    token = cookies.getCookie("session-token", { req, res })
  }


  delete srv?.created
  delete srv?.secret

  type XUserGet = {
    code: number,
    app: string,
    origin: string,
    uid: string,
    name: string,
    phone: string,
    email: string,
    image: string,
    cchar: string,
    ccode: string,
    unit: UnitName,
    lang: langType,
  }
  let json: XUserGet = await api("https://qepal.com/api/xuser/get", { token })


  let enduser: EndUserType = null;
  if (json.code == 0)
    enduser = json as any;
  let middleuser: MiddleUserType = srv;



  if (enduser) {
    let u = global.xdb.collection("endusers")
    localenduser = await u.findOne({ uid: ObjectId.createFromHexString(srv.uid.toString()) })
    if (!localenduser) {
      await xdb.collection("endusers").insertOne({
        uid: ObjectId.createFromHexString(enduser.uid.toString()),
        app: json.app,
        origin: json.origin,
        name: enduser.name,
        phone: enduser.phone,
        email: enduser.email,
        image: enduser.image,
        cchar: enduser.cchar,
        ccode: enduser.ccode,
        unit: enduser.unit || "toman",
        lang: enduser.lang,
        lastseen: new Date().getTime(),
        userip: userip,
        role: [],
      })
    }
    else {
      if (localenduser.lang != session.lang
        || Math.abs(localenduser.lastseen - new Date().getTime()) > 120000
        || localenduser.userip != userip
        || localenduser.name != enduser.name
        || localenduser.image != enduser.image
        || localenduser.unit != enduser.unit
        || localenduser.phone != enduser.phone
        || localenduser.email != enduser.email
        || localenduser.ccode != enduser.ccode
        || localenduser.cchar != enduser.cchar
      ) {
        await xdb.collection("endusers").updateOne({ uid: ObjectId.createFromHexString(json.uid) }, {
          $set: {
            lastseen: new Date().getTime(),
            userip: userip,
            lang: session.lang,
            name: enduser.name,
            phone: enduser.phone,
            email: enduser.email,
            image: enduser.image,
            unit: enduser.unit,
            ccode: enduser.ccode,
            cchar: enduser.cchar,
          }
        })
      }
    }
  }
  if (enduser && !enduser.role) {
    enduser.role = []
  }

  let middletempsecret = {
    generate: async () => {
      if (!session?.user) {
        return null
      }
      let json = await api("https://qepal.com/api/service/tempsecret/generate", {
        secret: session.secret
      })
      return json.token
    },
    verify: async (input: string) => {
      let json = await api("https://qepal.com/api/service/tempsecret/verify", {
        secret: session.secret
      })
      return json.code == 0
    }
  }

  let endtempsecret = {
    generate: async () => {
      if (!session?.user) {
        return null
      }
      let json = await api("https://qepal.com/api/xuser/tempsecret/generate", {
        token
      })
      return json.token
    },
    verify: async (input: string) => {
      let json = await api("https://qepal.com/api/xuser/tempsecret/verify", {
        token,
        input

      })
      return json.code == 0
    }
  }


  enduser = { ...(enduser || {}), ...(localenduser || {}) }
  let origin = null
  if (enduser) {
    origin = json.origin
    delete enduser["origin"]
    delete enduser["app"]
    delete enduser["_id"]
    delete enduser["code"]
    delete enduser["services"]
    enduser.token = token
    enduser.rolecheck = (check) => rolecheck(check, enduser?.role || []);
    enduser.tempsecret = endtempsecret
  }

  middleuser.tempsecret_backend = middletempsecret
  delete middleuser["code"]
  let cat = middleuser["cat"]
  let app = middleuser["app"]
  let expid = middleuser["expid"]
  delete middleuser["cat"]
  delete middleuser["expid"]
  delete middleuser["app"]
  delete session.cchar
  delete session.sid

  middleuser.servsecret_backend = session.secret;
  delete session.secret;

  VisitorUpdate(srv.uid, userip)


  let obj = {
    app,
    cat,
    expid,
    body,
    origin,
    topuser,
    middleuser,
    enduser,
    ...session,
    userip,
    req,
    res,
  }

  if (obj.servid) {
    obj.servid = ObjectId.createFromHexString(obj.servid.toString())
  }
  if (obj.servuid) {
    obj.servuid = ObjectId.createFromHexString(obj.servuid.toString())
  }
  if (obj.expid) {
    obj.expid = ObjectId.createFromHexString(obj.expid.toString())
  }

  return obj as APISession
}



const VisitorUpdate = (uid, userip) => {

  uid = (uid || "").toString()
  if (((!userip) && (!uid)) ||
    (typeof userip == "undefined" && !uid)
    || (typeof uid == "undefined" && !userip)) {
    return;
  }

  if (!uid) {
    if (!global.visitors[userip]) {
      global.visitors[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitors[userip].ssr) {
      global.visitors[userip].ssr = 1;
    }
    else {
      global.visitors[userip].ssr++;
    }
    if (!global.visitors[userip].lang)
      global.visitors[userip].lang = "fa"
    global.visitors[userip].ip = userip
    global.visitors[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsM1[userip]) {
      global.visitorsM1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsM1[userip].ssr) {
      global.visitorsM1[userip].ssr = 1;
    }
    else {
      global.visitorsM1[userip].ssr++;
    }
    if (!global.visitorsM1[userip].lang)
      global.visitorsM1[userip].lang = "fa"
    global.visitorsM1[userip].ip = userip
    global.visitorsM1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsH1[userip]) {
      global.visitorsH1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsH1[userip].ssr) {
      global.visitorsH1[userip].ssr = 1;
    }
    else {
      global.visitorsH1[userip].ssr++;
    }
    if (!global.visitorsH1[userip].lang)
      global.visitorsH1[userip].lang = "fa"
    global.visitorsH1[userip].ip = userip
    global.visitorsH1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)

    /**************************************** */
    if (!global.visitorsD1[userip]) {
      global.visitorsD1[userip] = { api: 0, ssr: 0 } as never
    }
    if (!global.visitorsD1[userip].ssr) {
      global.visitorsD1[userip].ssr = 1;
    }
    else {
      global.visitorsD1[userip].ssr++;
    }
    if (!global.visitorsD1[userip].lang)
      global.visitorsD1[userip].lang = "fa"
    global.visitorsD1[userip].ip = userip
    global.visitorsD1[userip].lastseen = new Date().getTime() + (global.timeoffset || 0)
    return;
  }


  if (!global.visitors[uid]) {
    global.visitors[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitors[uid].ssr) {
    global.visitors[uid].ssr = 1;
  }
  else {
    global.visitors[uid].ssr++;
  }
  if (!global.visitors[uid].lang)
    global.visitors[uid].lang = "fa"
  global.visitors[uid].ip = userip
  global.visitors[uid].uid = uid
  global.visitors[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsM1[uid]) {
    global.visitorsM1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsM1[uid].ssr) {
    global.visitorsM1[uid].ssr = 1;
  }
  else {
    global.visitorsM1[uid].ssr++;
  }
  if (!global.visitorsM1[uid].lang)
    global.visitorsM1[uid].lang = "fa"
  global.visitorsM1[uid].ip = userip
  global.visitorsM1[uid].uid = uid
  global.visitorsM1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsH1[uid]) {
    global.visitorsH1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsH1[uid].ssr) {
    global.visitorsH1[uid].ssr = 1;
  }
  else {
    global.visitorsH1[uid].ssr++;
  }
  if (!global.visitorsH1[uid].lang)
    global.visitorsH1[uid].lang = "fa"
  global.visitorsH1[uid].ip = userip
  global.visitorsH1[uid].uid = uid
  global.visitorsH1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

  /*********************************************** */
  if (!global.visitorsD1[uid]) {
    global.visitorsD1[uid] = { api: 0, ssr: 0 } as never
  }
  if (!global.visitorsD1[uid].ssr) {
    global.visitorsD1[uid].ssr = 1;
  }
  else {
    global.visitorsD1[uid].ssr++;
  }
  if (!global.visitorsD1[uid].lang)
    global.visitorsD1[uid].lang = "fa"
  global.visitorsD1[uid].ip = userip
  global.visitorsD1[uid].uid = uid
  global.visitorsD1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

}