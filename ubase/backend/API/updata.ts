import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "updata": (T: T) => R } var API: API }


export default async function F(T: { datalist: Array<any> }, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let p = udb.collection("data")


  for (let data of T.datalist) {
    data.servid = C.middleuser.servid
  }

  await p.deleteMany({servid: C.middleuser.servid})
  await p.insertMany(T.datalist)

  return { code: 0 }
}
