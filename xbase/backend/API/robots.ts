type T = Parameters<typeof F>[0]; type R = ReturnType<typeof F>
declare global { interface API { "robots": (T: T) => R } var API: API }

export default async function F(T: {text: string}, C: APISession,) {
  
  C.res.send(`
User-agent: *

Disallow: /api/
Disallow: /api/*


# Disallow: /_next/
# Disallow: /_next/*
# Disallow: /static/
# Disallow: /static/*
Disallow: /node_modules/
Disallow: /node_modules/*

Disallow: /login
Disallow: /admin
Disallow: /admin/*


Disallow: /s/


Disallow: /cache/
Disallow: /tmp/
Disallow: /uploads/temp/



Disallow: /en/*
Disallow: /es/*
Disallow: /fr/*
Disallow: /pt/*
Disallow: /ko/*
Disallow: /ar/*
Disallow: /zh/*
Disallow: /ur/*
Disallow: /id/*
Disallow: /tr/*


Allow: /fa/

Sitemap: https://qepal.com/api/sitemaps/fa.xml
# Sitemap: https://qepal.com/api/sitemaps/en.xml
# Sitemap: https://qepal.com/api/sitemaps/es.xml
# Sitemap: https://qepal.com/api/sitemaps/pt.xml
# Sitemap: https://qepal.com/api/sitemaps/ko.xml
# Sitemap: https://qepal.com/api/sitemaps/ar.xml
# Sitemap: https://qepal.com/api/sitemaps/zh.xml
# Sitemap: https://qepal.com/api/sitemaps/fr.xml
# Sitemap: https://qepal.com/api/sitemaps/ur.xml
# Sitemap: https://qepal.com/api/sitemaps/de.xml
# Sitemap: https://qepal.com/api/sitemaps/ru.xml
# Sitemap: https://qepal.com/api/sitemaps/id.xml
# Sitemap: https://qepal.com/api/sitemaps/tr.xml
# Sitemap: https://qepal.com/api/sitemaps/fa.xml

  `)
}
