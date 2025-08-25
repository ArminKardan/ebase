import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  let json = await api("https://qepal.com/api/xuser/setservsecretkey", { servsecret: process.env.SERVICE_SECRET })
  if (json.code == 0) {
    res.send({ code: 0, key: json.key })
  }
  res.send({ code: -1 })
}
