
export default () => {
  return null
}

export async function getServerSideProps(context) {

  let cookies = await import("cookies-next")
  if (context.query["token"]) {
    cookies.setCookie("session-token", context.query["token"], { req: context.req, res: context.res, maxAge: 365 * 86400 })
  }

  return {
    redirect: {
      permanent: false,
      destination: "/fa",
    },
    props: {}
  }
}
