import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "getdefaultschema": (T: T) => R } var API: API }


export default async function F(T: null, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  let c = udb.collection("configs")

  let schema = await c.findOne({ type: "schematemplate", })

  if (schema) {
    schema = schema.schema
    return { code: 0, schema }
  }

  return { code: -8, msg: "no default schema found" }
}
