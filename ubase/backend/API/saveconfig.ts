import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "saveconfig": (T: T) => R } var API: API }


export default async function F(T: any, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let fscol = udb.collection("configs")

  await fscol.updateOne({ servid: C.middleuser.servid }, {
    $set: {
      servid: C.middleuser.servid,
      config: T,
    }
  }, { upsert: true })
  return { code: 0 }
}
