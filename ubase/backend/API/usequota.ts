import { UnitName } from "@/common/dynamic";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "usequota": (T: T) => R } var API: API }


export default async function F(T:
  { uid: string, amount: number, details: string }, C: APISession,) {
  if (!C.rolecheck(["admin", "bot"])) {
    return { code: -10 }
  }

  if (!process.env.EXPLORE_SECRET) {
    throw "Explore secret is missing and its necessary when you call PAYG function."
  }
  return await api("https://qepal.com/api/service/usequota", {
    uid: T.uid,
    amount: T.amount,
    exploresecret: process.env.EXPLORE_SECRET,
    details: T.details,
  })

}
