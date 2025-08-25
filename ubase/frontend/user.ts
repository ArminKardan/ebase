import { UnitName } from "@/common/dynamic";
import rolecheck from "@/common/rolecheck";
import { langType } from "@/common/SiteConfig";
import { RoleName } from "@/global";
import { ObjectId } from 'mongodb'

export const MiddleUserFront = (middleuser: MiddleUserType): MiddleUserType => //server session from SSR
{
  if (!middleuser)
    return null
  middleuser.tempsecret = {
    generate: async () => {
      if (!middleuser?.servsecret) {
        return null
      }
      let json = await api("https://qepal.com/api/service/tempsecret/generate", {
        secret: middleuser?.servsecret
      })
      return json.token
    },

    verify: async (input: string) => {
      let json = await api("https://qepal.com/api/service/tempsecret/verify", {
        secret: middleuser?.servsecret,
        token: input
      })
      return json.code == 0
    }
  }
  
  middleuser.rolecheck = check => rolecheck(check, middleuser.role)
  return middleuser;
}


export type ServiceStatus = "approved" | "rejected" | "waiting" | "freezed"


export type TopUserType = {
  uid: ObjectId,
  name: string,
  image: string,
  ccode: string,
  cchar: string,
  phone: string,
  email: string,
  lang: langType,
  unit: UnitName
}

export type MiddleUserType = {
  name: string,
  image: string,
  cchar: string,
  unit: string,
  phone: string,
  email: string,
  ccode: string,
  lang: string,
  servid: ObjectId,
  mongourl:string,
  uid: ObjectId,
  usedquota: number,
  quota: number,
  quotaunit: string,
  status: "approved" | "rejected" | "waiting",
  regdate: number,
  servsecret: string,
  role: Array<RoleName>,
  rolecheck: (check: Array<RoleName>) => boolean,
  tempsecret: { generate: () => Promise<string>, verify: (input: string) => Promise<boolean> },
}
