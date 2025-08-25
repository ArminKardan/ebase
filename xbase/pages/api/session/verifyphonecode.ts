export default async (req: NextApiRequest, res: NextApiResponse) => {

  let body = JSON.parse(req.body)

  let json = await api("https://qepal.com/api/xuser/loginbyphoneverify",{
    ...body,
    servsecret:process.env.SERVICE_SECRET
  })

  res.send(json)
}
