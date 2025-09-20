

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let cookies = await import("cookies-next")
  let token = cookies.getCookie("session-token", { req: req, res: res })
  await api("https://qepal.com/api/xuser/delete", { token })
  res.send({ code: 0 })
}




