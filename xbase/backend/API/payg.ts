import { UnitName } from "@/common/dynamic";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "payg": (T: T) => R } var API: API }


export default async function F(T:
  { uid: string, amount: number, unit: UnitName, details:string }, C: APISession,) {
  if (!C.middleuser.rolecheck(["admin", "bot"])) {
    return { code: -10 }
  }

  if (!process.env.EXPLORE_SECRET) {
    throw "Explore secret is missing and its necessary when you call PAYG function."
  }
  return await api("https://qepal.com/api/service/payg", {
    uid: T.uid,
    amount: T.amount,
    unit: T.unit,
    exploresecret: process.env.EXPLORE_SECRET,
    details: T.details,
  })

}
