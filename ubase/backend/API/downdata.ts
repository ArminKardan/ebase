import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "downdata": (T: T) => R } var API: API }


export default async function F(T:null, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let p = udb.collection("data")

  let datalist = await p.find({}).sort({}).toArray()

  datalist.forEach(item => delete item._id)
  datalist.forEach(item => delete item.servid)

  return {code:0, datalist}
}
