type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "sitemap": (T: T) => R } var API: API }

export default async function F(T: {text: string}, C: APISession,) {
  
  C.res.setHeader("Content-Type", "application/xml");
  C.res.send(`
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://exirnex.ir/api/sitemaps/fa.xml</loc>
        </sitemap>
      </sitemapindex>
    `)
}
