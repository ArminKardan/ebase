import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "editproduct": (T: T) => R } var API: API }


export default async function F(T: { pid: string, item: any }, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  T.item.servid = C.middleuser.servid
  let fscol = udb.collection("data")
  await fscol.replaceOne({ pid: T.pid }, T.item)

  return { code: 0 }
}
