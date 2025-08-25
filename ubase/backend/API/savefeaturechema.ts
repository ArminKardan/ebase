import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "savefeaturechema": (T: T) => R } var API: API }


export default async function F(T: Array<{ text: string, desc: string,
   type: "explanation" | "description" | "numeric" | "boolean" | "limited", icon:string,
  options:Array<string> }>, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let fscol = udb.collection("featureschema")

  await fscol.updateOne({ servid: C.middleuser.servid }, {
    $set: {
      servid: C.middleuser.servid,
      schema: T,
    }
  }, { upsert: true })
  return { code: 0 }
}
