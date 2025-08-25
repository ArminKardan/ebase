import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "saveadmins": (T: T) => R } var API: API }


export default async function F(T: Array<any>, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let fscol = udb.collection("admins")


  for (let admin of T) {
    delete admin._id
    admin.servid = C.middleuser.servid
    let r = await fscol.replaceOne({ aid: admin.aid, servid: C.middleuser.servid }, admin, { upsert: true })
    console.log(r)
  }


  return { code: 0 }
}
