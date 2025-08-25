
import { ObjectId } from 'mongodb'
import rolecheck from "@/common/rolecheck"
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { getCookie } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import requestIp from 'request-ip'
import { URL } from 'url'
import SiteConfig, { langType } from '@/common/SiteConfig';
import { UnitName } from '@/common/dynamic';
import { EndUserType, MiddleUserType, ServiceStatus, TopUserType } from '@/frontend/user';
import xmongodblib from '../backend/mobgolib/xmongo'
import pako from 'pako'

declare global {
  var port: number;
  // function SSRVerify(context: GetServerSidePropsContext, cached?: boolean): Promise<SSRSession>;
  function Prosper(obj: any, context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ [key: string]: any; }>>;
}

export type SSRSession = {
  app: string,
  origin: string,
  cat: string,
  expid: ObjectId,
  topuser: TopUserType,
  middleuser: MiddleUserType,
  enduser: EndUserType,
  lang: langType,
  path: string,
  userip: string,
  pageid: string,
  nodeenv: string,
  devmode: boolean
}


export const Prosper = async (obj, context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> => {

  // let sprops = getServerSidePropsX
  let langcode = context.query.lang

  let cookies = await import("cookies-next")

  let apilist = getAllFiles("./backend/API", '')

  let noapi = false;
  if (
    !global.devmode &&
    cookies.hasCookie("apihash", { req: context.req, res: context.res })) {
    try {
      let apihash = cookies.getCookie("apihash", { req: context.req, res: context.res })
      if (apihash == MD5(JSON.stringify(apilist))) {
        noapi = true
      }
    } catch { }
  }

  if (noapi) {
    apilist = null
  }

  if (!obj.props) {
    obj.props = {} as any
  }

  if (obj.props) {
    obj.props["href"] = context.req.url
    obj.props["langcode"] = langcode
    obj.props["apilist"] = apilist
    obj.props["pageid"] = obj.props["session"].pageid
    obj.props["query"] = context.query
    obj.props["path"] = obj.props["session"].path
    obj.props["lang"] = obj.props["session"].lang
    obj.props["nlangs"] = obj.props["session"].nlangs
    obj.props["date"] = new Date().toISOString()
  }

  delete obj.props.session.middleuser.servsecret_backend
  delete obj.props.session.middleuser.mongourl

  let str = QSON.stringify(obj.props)
  let deflated = deflateToBase64(str)
  obj.props = { data: deflated }

  obj.notFound = obj.notFound
  obj.redirect = obj.redirect
  return obj
}
export const SSRVerify = async (context: GetServerSidePropsContext, cached: boolean = false, nlangkeys?: Array<string>): Promise<SSRSession> => {

  global.port = Number(process.env.PORT)

  if (global.Startup != "OK") (await (await import('@/startup.ts')).Starter())

  if (!global.langs["fa"]) {
    await new Promise(r => setInterval(() => global.langs["fa"] ? r(null) : null, 200))
  }

  global.devmode = global.DEVMODE || process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test"

  let session = {
    lang: "fa",
    secret: process.env.SERVICE_SECRET,
    cchar: "us"
  } as any


  if (!global.sessioner) {
    global.sessioner = {}
  }

  let cookies = await import("cookies-next")

  if (context.query["token"]) {
    cookies.setCookie("session-token", context.query["token"], { req: context.req, res: context.res, maxAge: 365 * 86400 })
  }

  let sid = ""
  if (!session?.secret) {
    if (cookies.hasCookie("sid-" + port, { req: context.req, res: context.res })) {
      try {
        sid = cookies.getCookie("sid-" + port, { req: context.req, res: context.res })
        session = JSON.parse(JSON.stringify(global.sessioner?.[sid] || {}))
      } catch { }
    }
  }
  else {
    sid = MD5(context?.query?.session as string || "")
    if (!global.sessioner) {
      global.sessioner = {}
    }
    cookies.setCookie("sid-" + port, sid, {
      req: context.req, res: context.res,
    })
    global.sessioner[sid] = JSON.parse(JSON.stringify(session))
  }



  if (session) {
    session.sid = sid
  }

  let userip = (requestIp.getClientIp(context.req)?.replace("::ffff:", "")) || "::"
  var lang = context.resolvedUrl.substr(1, 3)
  lang = lang.replace(/\?/g, "");

  if (lang[2] == "/" || !lang[2]) {
    lang = lang.substr(0, 2);
  }
  else {
    lang = "fa"
  }


  let srv = {} as any
  let localenduser = null
  let topuser: TopUserType = null
  if (global.devmode)
    global._srvs = []

  srv = global._srvs.find(s => s.secret == session.secret)

  if (!session.secret && process.env.SERVICE_SECRET) {
    session.secret = process.env.SERVICE_SECRET
  }

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
  if (cookies.hasCookie("session-token", { req: context.req, res: context.res })) {
    token = cookies.getCookie("session-token", { req: context.req, res: context.res })
  }


  delete srv?.created

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
    localenduser = await u.findOne({ uid: ObjectId.createFromHexString(json.uid) })

    if (!localenduser) {
      await xdb.collection("endusers").insertOne({
        uid: ObjectId.createFromHexString(json.uid),
        app: json.app,
        origin: json.origin,
        name: enduser.name,
        phone: enduser.phone,
        email: enduser.email,
        image: enduser.image,
        cchar: enduser.cchar,
        ccode: enduser.ccode,
        unit: json.unit || "toman",
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





  let pageid = getCookie("pageid", { req: context.req }) || SerialGenerator(10)

  let path = new URL(SiteConfig.address + context.resolvedUrl).pathname

  VisitorUpdate(srv.uid, userip, lang)

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
      if (!enduser) {
        return null
      }
      let json = await api("https://qepal.com/api/xuser/tempsecret/generate", {
        token
      })
      return json.token
    },
    verify: async (input: string) => {
      if (!enduser) {
        return null
      }
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
    enduser.rolecheck = (check) => rolecheck(check, enduser?.role || []);
    enduser.token = token
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

  delete topuser.phone
  delete middleuser.phone;

  if (!nlangkeys) {
    nlangkeys = []
  }
  nlangkeys.push(...["region", "dir", "ff", "ffb", "support", "code", "textw", "txtmt"])

  let nlangs = {}
  for (let l of Object.keys(global.langs[lang])) {
    if (nlangkeys.includes(l))
      nlangs[l] = global.langs[lang][l]
  }

  let obj = {
    app,
    cat,
    expid,
    origin,
    topuser,
    middleuser,
    enduser,
    ...session,
    path,
    lang,
    userip,
    pageid,
    nodeenv: global.nodeenv,
    devmode: global.devmode,
    nlangs
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

  return obj as SSRSession

}


const VisitorUpdate = (uid: string, userip: string, lang: string) => {
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
    global.visitors[userip].lang = lang
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
    global.visitorsM1[userip].lang = lang
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
    global.visitorsH1[userip].lang = lang
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
    global.visitorsD1[userip].lang = lang
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
  global.visitors[uid].lang = lang
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
  global.visitorsM1[uid].lang = lang
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
  global.visitorsH1[uid].lang = lang
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
  global.visitorsD1[uid].lang = lang
  global.visitorsD1[uid].ip = userip
  global.visitorsD1[uid].uid = uid
  global.visitorsD1[uid].lastseen = new Date().getTime() + (global.timeoffset || 0)

}
function getAllFiles(dirPath, rootPath) {

  let path = require("path")
  let results = [];
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = fullPath.replace(rootPath, '');
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllFiles(fullPath, rootPath));
    } else {
      results.push(relativePath.replace(/\\/g, '/').slice(7).slice(0, -3).replace("/API/", "/api/"));
    }
  });
  return results;
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
