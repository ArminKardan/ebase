import { UnitName } from "@/common/dynamic";
import rolecheck from "@/common/rolecheck";
import { langType } from "@/common/SiteConfig";
import { RoleName } from "@/global";
import authenticator from 'authenticator'

export const EndUserFront = (enduser: EndUserType): EndUserType => //server session from SSR
{
  if (!enduser)
    return null
  enduser.tempsecret = {
    generate: async () => {
      if (!enduser) {
        return null
      }
      let json = await api("https://qepal.com/api/xuser/tempsecret/generate", {
        token: enduser.token
      })
      return json.token
    },
    verify: async (input: string) => {
      let json = await api("https://qepal.com/api/xuser/tempsecret/verify", {
        token: enduser.token,
        input
      })
      return json.code == 0
    }
  }
  enduser.rolecheck = check => rolecheck(check, enduser.role)
  return enduser;
}


export type ServiceStatus = "approved" | "rejected" | "waiting" | "freezed"

import { ObjectId } from 'mongodb'

export type EndUserType = {
  uid: ObjectId,
  name: string,
  phone: string,
  email: string,
  image: string,
  cchar: string,
  ccode: string,
  unit: UnitName,
  lang: langType,
  lastseen: string,
  userip: string,
  role: Array<RoleName>,
  rolecheck: (check: Array<RoleName>) => boolean,
  tempsecret: { generate: () => Promise<string>, verify: (input: string) => Promise<boolean> },
  token: string
}

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
  servsecret_backend: string,
  role: Array<RoleName>,
  rolecheck: (check: Array<RoleName>) => boolean,
  tempsecret_backend: { generate: () => Promise<string>, verify: (input: string) => Promise<boolean> },
}
