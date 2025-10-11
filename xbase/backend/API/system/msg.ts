type T = Parameters<typeof F>[0];
type R = ReturnType<typeof F>;
declare global { interface API { "system/msg": (T: T) => R } var API: API }

export default async function F(
  T: { Name: any; Email: any; msg: any },
  C: APISession
) {
  const db = udb.collection("messages");
  const mesg = {
    ID: serialgenerator(8),
    Name: T.Name,
    Email: T.Email,
    msg: T.msg,
    Date: Date(),
  };
  try {
    const msg = `Name: ${T.Name}\nEmail: ${T.Email}\nMessage: ${T.msg}`;
    let res = await nexus.agent.sms.modem("+989114030386", msg);
    let res1 = await nexus.agent.email.send("samanes0011@gmail.com", "Portfolio Message", msg)
    await db.insertOne(mesg);
    if (res.code == 0) {
      return { success: true, msg: "Message sent!" };
    } else {
      return {
        success: false,
        msg: "errooor msg" + (res.msg || "wtf errorrrrrrr"),
      };
    }
  } catch (e) {
    return { success: false, msg: "errorrrrrrrrrr:" + e };
  }
  // return { pong: true };
}
