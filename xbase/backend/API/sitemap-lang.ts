type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "sitemap-lang": (T: T) => R } var API: API }

export default async function F(T: { text: string }, C: APISession,) {

  C.res.setHeader("Content-Type", "application/xml");

  C.res.send(`
      <urlset
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <url>
      <loc>https://exirnex.ir</loc>
      <changefreq>daily</changefreq>
      <priority>1</priority>
    </url>
  
    </urlset>
  `)
}
