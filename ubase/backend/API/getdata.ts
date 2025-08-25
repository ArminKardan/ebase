import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "getdata": (T: T) => R } var API: API }


export default async function F(T: { aid: string, bid: string }, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let p = udb.collection("data")

  let items = await p.find({aid:T.aid, bid:T.bid}).sort({ _id: -1 }).toArray()

  items.forEach(item => delete item._id)

  let datalist = []

  for (let item of items) {
    let data = { pid: item.pid, aid: item.aid, bid: item.bid, name: item.name, desc: item.desc, aidesc: item.aidesc, images: item.images }
    for (let spec of Object.keys(item)) {
      if (["pid", "servid", "aid", "bid", "name", "desc", "images"].includes(spec)) {
        continue
      }
      data[spec] = item[spec]
    }
    datalist.push(data)
  }

  return {code:0, datalist}
}
