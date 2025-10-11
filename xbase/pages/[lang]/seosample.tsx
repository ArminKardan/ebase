
import { LDJSONArticle, LDJSONOrganization, LDJSONWebPage, LDJSONWebSite, Meta, toLocalISO } from '@/common/seo';
import Component, { PageEl } from '@/frontend/components/qecomps/Component'
import Window from '@/frontend/components/qecomps/Window';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Router from 'next/router'

export default p => Component(p, Page);
const Page: PageEl = (props: {} & { [key: string]: any }, refresh, getProps, onLoad, onConnected, dies, isFront, z) => {


  onConnected(async () => {
    console.log("connected.")
  })
  return <div style={{ direction: z.lang.dir, padding: 10 }}>

    <Window title='hi' contentStyle={{ padding: 10 }}>

    </Window>

  </div>
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  var session = await ((await import('@/backend/SSRVerify.ts')).SSRVerify)(context, false, [])


  let meta: Meta = {} as any;


  meta.title = "آرمین کاردان - وب سایت شخصی";
  meta.description = "بنیانگذار و استراتژیست تیم پژوهشی تورینگ";
  meta.canonical = "https://exirnex.ir/fa"
  meta.hrefLangs = [
    { code: "fa", url: `https://exirnex.ir/fa` },// same as canonical
    { code: "en", url: `https://exirnex.ir/en` },
    { code: "de", url: `https://exirnex.ir/de` },
    { code: "fr", url: `https://exirnex.ir/fr` },
    { code: "es", url: `https://exirnex.ir/es` },
    { code: "id", url: `https://exirnex.ir/id` },
    { code: "ko", url: `https://exirnex.ir/ko` },
    { code: "ja", url: `https://exirnex.ir/ja` },
    { code: "zh", url: `https://exirnex.ir/zh` },
    { code: "tr", url: `https://exirnex.ir/tr` },
    { code: "ur", url: `https://exirnex.ir/ur` },
    { code: "pt", url: `https://exirnex.ir/pt` },
    { code: "ar", url: `https://exirnex.ir/ar` },
    { code: "ru", url: `https://exirnex.ir/ru` },
    { code: "x-default", url: `https://exirnex.ir/fa` },
  ]
  meta.index = true;
  meta.follow = true;
  meta.og = {
    title: meta.title,
    description: meta.description,
    image: "https://cdn.qepal.com/qepal/qecircabs.webp",
    alt: meta.title,
    locale: "fa_IR",
    type: "website",
    url: "https://exirnex.ir"
  }

  meta.twitter = {
    card: "https://cdn.qepal.com/qepal/qecircabs.webp",
    description: meta.description,
    image: "https://cdn.qepal.com/qepal/qecircabs.webp",
    site: "@qepalcom",
    title: meta.title
  }

  meta.ldjsons = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "آرمین کاردان - وب سایت شخصی",
      "url": "https://exirnex.ir",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://exirnex.ir/fa/s/{search_term_string}",
        "query-input": "required name=search_term_string"
      }
    } as LDJSONWebSite,

    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "آرمین کاردان - وب سایت شخصی",
      "image": "https://cdn.qepal.com/qepal/posters/p9.webp",
      "url": "https://exirnex.ir/seosample",
      inLanguage: "fa",
      isPartOf: {
        "@type": "WebSite", //don't change
        "name": "کیو ای", //don't change
        "url": "https://qepal.com/" //don't change
      },
      mainEntity: {
        "@type": "Article",
        headline: "آرمین کاردان - وب سایت شخصی",
        image: ["https://cdn.qepal.com/qepal/posters/p9.webp"],
        author: { "@type": "Person", "name": "Ethan Cardan", url: "https://qepal.com" },
        dateModified: toLocalISO(new Date()),
        datePublished: toLocalISO(new Date()),
        description: meta.description,
        publisher: {
          "@type": "Organization", //don't change
          "name": "کیو ای", //don't change
          "logo": { "@type": "ImageObject", url: "https://cdn.qepal.com/qepal/qecircabs.webp" } //don't change
        }
      } as LDJSONArticle,

      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://exirnex.ir/seosample"
      }

    } as LDJSONWebPage,

  ]


  let obj = await Prosper({
    props: {
      session,
      meta,
    },
  }, context)
  return obj
}
