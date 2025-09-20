import { NextApiRequest, NextApiResponse } from "next"
import { ObjectId } from "mongodb"

import requestIp from 'request-ip'
import rolecheck from "@/common/rolecheck"
import { RoleName } from "@/global"
import { MiddleUserType } from "@/frontend/user"

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

      middleuser: {
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


  let session = JSON.parse(`{}`)


  let sid = ""
  let cookies = await import("cookies-next")
  if (cookies.hasCookie("sid-" + global.port, { req, res })) {
    try {
      sid = cookies.getCookie("sid-" + global.port, { req, res })
      session = JSON.parse(JSON.stringify(global.sessioner?.[sid] || {}))
    } catch { }
  }


  let srv = {} as any
  let middleuser: MiddleUserType = null;

  let localmiddleuser = null
  let topuser = null


  if (devmode)
    global._srvs = []

  if (body.secret && !session.secret) {
    session.secret = body.secret
    session.lang = "en"
    session.cchar = "us"
  }

  // if (!session.secret && process.env.SERVICE_SECRET) {
  //   session.secret = process.env.SERVICE_SECRET
  // }


  srv = global._srvs.find(s => s.secret == session.secret)

  if (global.devmode || !srv || (new Date().getTime() - srv.created) > 60000) {
    srv = await api("https://qepal.com/api/userv/servid", {
      secret: session.secret,
    })
    if (srv) {
      global._srvs.push({ ...srv, created: new Date().getTime(), servid: srv.servid, secret: session.secret })
    }
  }

  srv = JSON.parse(JSON.stringify(srv))


  if (srv) {
    if (!srv.topuser) {
      console.error("TOP USER NOT FOUND SRV:", srv)
      console.error("TOP USER NOT FOUND SESSION:", session)
    }

    topuser = srv.topuser;
    topuser.uid = ObjectId.createFromHexString(topuser.uid)
    delete srv.topuser

    srv.uid = ObjectId.createFromHexString(srv.uid.toString())
    srv.servid = ObjectId.createFromHexString(srv.servid.toString())
    srv.expid = ObjectId.createFromHexString(srv.expid.toString())
  }

  if (!srv) {
    return { //fully illegal request
      code: -100,
      userip
    } as any
  }

  delete srv?.created
  // delete srv?.secret


  if (srv.code == 0) {
    middleuser = srv;

    let u = global.udb.collection("middleusers")
    localmiddleuser = await u.findOne({ uid: ObjectId.createFromHexString(srv.uid.toString()) })
    if (!localmiddleuser) {
      await udb.collection("middleusers").insertOne({
        uid: ObjectId.createFromHexString(middleuser.uid.toString()),
        app: srv.app,
        name: middleuser.name,
        phone: middleuser.phone,
        email: middleuser.email,
        image: middleuser.image,
        cchar: middleuser.cchar,
        ccode: middleuser.ccode,
        unit: middleuser.unit || "toman",
        lang: middleuser.lang,
        lastseen: new Date().getTime(),
        userip: userip,
        role: [],
      })
    }
    else {

      if (localmiddleuser.lang != session.lang
        || Math.abs(localmiddleuser.lastseen - new Date().getTime()) > 120000
        || localmiddleuser.userip != userip
        || localmiddleuser.name != middleuser.name
        || localmiddleuser.image != middleuser.image
        || localmiddleuser.unit != middleuser.unit
        || localmiddleuser.phone != middleuser.phone
        || localmiddleuser.email != middleuser.email
        || localmiddleuser.ccode != middleuser.ccode
        || localmiddleuser.cchar != middleuser.cchar
      ) {
        await udb.collection("middleusers").updateOne({ uid: ObjectId.createFromHexString(srv.uid.toString()) }, {
          $set: {
            lastseen: new Date().getTime(),
            userip: userip,
            name: middleuser.name,
            phone: middleuser.phone,
            email: middleuser.email,
            image: middleuser.image,
            unit: middleuser.unit,
            ccode: middleuser.ccode,
            cchar: middleuser.cchar,
            lang: session.lang,
          }
        })
      }
    }
  }
  if (middleuser && !middleuser.role) {
    middleuser.role = []
  }

  middleuser.tempsecret = {
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
        secret: session.secret,
        token: input
      })
      return json.code == 0
    }
  }


  VisitorUpdate(srv.uid, userip)

  middleuser.servsecret = session.secret
  delete session.secret;
  delete session.cchar
  delete session.sid;

  let app = srv.app
  let cat = srv.cat
  let expid = srv.expid
  delete middleuser["code"]
  delete middleuser["cat"]
  delete middleuser["app"]
  delete middleuser["expid"]
  delete session.cchar
  delete session.sid
  delete session.secret;

  let obj = {
    app,
    cat,
    expid,
    body,
    topuser,
    middleuser,
    ...session,
    userip,
    nodeenv: global.nodeenv,
    devmode: devmode,
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