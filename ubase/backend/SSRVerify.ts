
import { ObjectId } from 'mongodb'
import rolecheck from "@/common/rolecheck"
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { getCookie } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Cacher from "./Cacher";
import requestIp from 'request-ip'
import { URL } from 'url'
import SiteConfig, { langType } from '@/common/SiteConfig';
import { RoleName } from '@/global';
import authenticator from 'authenticator'
import { MiddleUserType, TopUserType } from '@/frontend/user';
import pako from 'pako'


declare global {
  var port: number;
  // function SSRVerify(context: GetServerSidePropsContext, cached?: boolean, nlangkeys?: Array<string>): Promise<SSRSession>;
  function Prosper(obj: any, context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{ [key: string]: any; }>>;
}
export type SSRSession = {
  app: string,
  cat: string,
  expid: ObjectId,
  topuser: TopUserType,
  middleuser: MiddleUserType,
  lang: langType,
  path: string,
  sid: string,
  userip: string,
  pageid: string,
  nodeenv: string,
  devmode: boolean,
  nlangs: any
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
  delete obj.props?.session?.middleuser?.servsecret_backend
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


  let session = {} as any
  if (context?.query?.session) {
    let inflated = inflateFromBase64(context?.query?.session)
    session = JSON.parse((inflated as string) || `{}`)
  }

  if (!global.sessioner) {
    global.sessioner = {}
  }




  let sid = ""
  let cookies = await import("cookies-next")
  if (!session?.secret) {

    let ccc = cookies.getCookies();

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
      req: context.req, res: context.res, sameSite: "none", secure: true
    })
    let resc = cookies.getCookie("sid-" + port, { req: context.req, res: context.res })
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
  let topuser: TopUserType = null
  let middleuser: MiddleUserType = null;
  let localmiddleuser = null

  if (devmode)
    global._srvs = []




  srv = global._srvs.find(s => s.secret == session.secret)

  if (!(srv?.topuser) || (global.devmode || !srv || (new Date().getTime() - srv.created) > 60000)) {
    srv = await api("https://qepal.com/api/userv/servid", {
      secret: session.secret,
    })
    if (srv) {
      global._srvs.push({ ...srv, created: new Date().getTime(), servid: srv.servid, secret: session.secret })
    }
  }

  srv = JSON.parse(JSON.stringify(srv))

  if (!srv?.topuser) {
    // console.log("RESOLVED URL:", context.resolvedUrl)
    // console.log("REQUEST:", context.req.url)
    // console.log("USER IP:", userip)
    return { //fully illegal request
      code: -100,
      userip
    } as any
  }

  if (srv) {
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

  delete srv?.created
  // delete srv?.secret

  if (srv.code == 0) {

    if (srv.code == 0) {
      middleuser = srv;
      let u = global.udb.collection("middleusers")
      localmiddleuser = await u.findOne({ uid: ObjectId.createFromHexString(srv.uid.toString()) })

      if (!localmiddleuser) {
        await udb.collection("middleusers").insertOne({
          uid: ObjectId.createFromHexString(srv.uid.toString()),
          lastseen: new Date().toISOString(),
          userip: userip,
          role: [],
          services: [
            {
              servid: srv.servid,
              secret: session.secret,
            }
          ]
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
              lastseen: new Date().toISOString(),
              userip: userip,
              lang: session.lang,
              name: middleuser.name,
              phone: middleuser.phone,
              email: middleuser.email,
              image: middleuser.image,
              unit: middleuser.unit,
              ccode: middleuser.ccode,
              cchar: middleuser.cchar,
            }
          })
        }
      }
    }
  }

  if (middleuser && !middleuser.role) {
    middleuser.role = []
  }



  let pageid = getCookie("pageid", { req: context.req }) || SerialGenerator(10)

  let path = new URL(SiteConfig.address + context.resolvedUrl).pathname

  VisitorUpdate(srv.uid, userip, lang)

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

  middleuser.servsecret = session.secret
  let app = srv.app
  let cat = srv.cat
  let expid = srv.expid
  delete middleuser["code"]
  delete middleuser["cat"]
  delete middleuser["app"]
  delete middleuser["expid"]
  delete session.secret;
  delete session.cchar
  delete session.sid;
  middleuser.rolecheck = (check) => rolecheck(check, middleuser?.role || []);


  (nlangkeys || []).push(...["region", "dir", "ff", "ffb", "support", "code", "textw", "txtmt"])

  let nlangs = {}
  for (let l of Object.keys(global.langs[lang])) {
    if ((nlangkeys || []).includes(l))
      nlangs[l] = global.langs[lang][l]
  }

  let obj = {
    app,
    cat,
    expid,
    topuser,
    middleuser,
    ...session,
    sid,
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