import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "deleteproduct": (T: T) => R } var API: API }


export default async function F(T: { pid: string }, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let fscol = udb.collection("data")

  let res = await fscol.deleteOne({ pid: T.pid })
  return { code: 0, res }
}
