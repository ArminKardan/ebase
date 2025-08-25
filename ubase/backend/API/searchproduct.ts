import { UnitName } from "@/common/dynamic";
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";
import { Collection, MongoClient } from "mongodb";

type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "searchproduct": (T: T) => R } var API: API }


export default async function F(T: {
  aid: string,
  bid: string,
  info: any,
  limitcount?: number,
  filter?: any,
  show?: Array<string>,
  sortparam?: string,
  ascending?: boolean,
  removefilter?: boolean
}, C: APISession,) {

  if (!C.middleuser?.uid) {
    return { code: -10, msg: "Not authorized." }
  }

  console.log("T IS:", T)
  let p = udb.collection("data")
  let a = udb.collection("admins")


  let admin: AdminType = await a.findOne({ aid: T.aid }) as any;

  let brain = admin.brains.find(b => b.bid == T.bid)

  let schemas = brain.schema


  let all = [] //await p.find({ servid: C.middleuser.servid }).toArray()
  // let filter = { ...T.filter, servid: C.middleuser.servid}
  let queryfilter = {}
  if (T.filter) {
    queryfilter = { ...T.filter }
  }

  console.log("QUERY FILTER:", queryfilter)

  let query = p.find(queryfilter);

  // if (T.limitcount)
  // query = query.limit(T.limitcount)
  // if (T.sortparam)
  // query = query.sort({ [T.sortparam]: T.ascending ? 1 : -1 })

  all = await query.toArray()

  console.log("ALL data length is:", all.length)



  for (let feature of Object.keys(T.info)) {
    for (let data of all) {
      data.score = 0;
      let schema = schemas.find(s => s.name == feature)
      if (!schema) {
        console.log("NO SCHEMA FOUND FOR:", feature)
        continue
      }

      if (feature == "هدف")
        continue

      if (data[feature]) {
        if (data[feature].type == "numeric") {

          if (typeof (T.info[feature]) == "string" && T.info[feature].startsWith("ABOVE")) {
            let num = Number(T.info[feature].replace("ABOVE", ""))
            if (data[feature].value >= num) {
              data.score += 3
            }
          }
          else if (typeof (T.info[feature]) == "string" && T.info[feature].startsWith("BELOW")) {
            let num = Number(T.info[feature].replace("BELOW", ""))
            if (data[feature].value <= num) {
              data.score += 3
            }
          }
          else if (data[feature].value == T.info[feature])
            data.score += 3
          else if (data[feature].tolerance[0] <= T.info[feature] && data[feature].tolerance[1] >= T.info[feature]) {
            data.score += 1
          }
          else if (schema.important)
            data.remove = true

        }
        else if (data[feature].type == "explanation") {
          if (textSimilarity(data[feature].value, T.info[feature]) > 0.5)
            data.score += 3
          else if (data[feature].tolerance.includes(T.info[feature])) {
            data.score += 1
          }
          else if (schema.important)
            data.remove = true
        }
        else if (data[feature].type == "limited") {
          if (textSimilarity(data[feature].value, T.info[feature]) > 0.5) {
            data.score += 3
          }
          else if (data[feature].tolerance.includes(T.info[feature]))
            data.score += 1
          else if (schema.important)
            data.remove = true
        }
      }
    }
  }
  if (T.sortparam) {
    if (T.ascending)
      all.sort((a, b) => a[T.sortparam] - b[T.sortparam])
    else
      all.sort((a, b) => b[T.sortparam] - a[T.sortparam])
  }

  all = all.filter(d => !d.remove)

  all.sort((a, b) => b.score - a.score)


  if (T.limitcount)
    all = all.filter((v, i) => i < T.limitcount)

  // if (T.removefilter)
  //   return { code: 0, data: all }

  return { code: 0, data: all.filter(pp => pp.score >= 0) }
}

function textSimilarity(text1, text2) {
  // Normalize and split into word sets
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  // Find intersection
  const intersection = new Set([...words1].filter(word => words2.has(word)));

  // Find union
  const union = new Set([...words1, ...words2]);

  // Jaccard similarity = intersection / union
  return union.size === 0 ? 0 : intersection.size / union.size;
}
