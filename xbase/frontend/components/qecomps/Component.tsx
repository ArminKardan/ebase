import { useEffect, useState } from 'react';
// import User, { UserType } from '../../user';
import Head from 'next/head'
import { SSRGlobal } from './Context';
import ComponentSSR from './Componentd';
import dynamic from 'next/dynamic';
import { EndUserFront, EndUserType, MiddleUserType, TopUserType } from '@/frontend/user';
import { Meta } from '@/common/seo';
const ComponentCSR = dynamic(() => import('./Componentd.tsx').then(x => x.default), { ssr: false })



export type ZType = {
    pageProps: any, root: string,
    lang: { [key in string]: any },
    topuser: TopUserType
    middleuser: MiddleUserType,
    enduser: EndUserType,
    qestyles: any,
    styles: any,
    path: string,
}

export type PageEl = (props: { [key in any]: any },
    refresh: (object?: { [key in any]: any }) => void,
    getProps: (callback: (isFront?: boolean) => Promise<void>) => void,
    onLoad: (callback: () => Promise<void>) => void,
    onConnected: (callback: () => Promise<void>) => void,
    dies: (callback: () => Promise<void>) => void,
    isFront: boolean,
    z: ZType) => React.JSX.Element

const convertor = (props: any, Page: PageEl, isPage: boolean, z: ZType, ssr) => {


    let prop = { ...props }
    let noheader = props.session?.noheader
    let full = props.session?.full
    props = prop

    delete props.query?.session
    delete props.query?.lang
    delete props.nlangs
    delete props.session
    delete props.pageid
    delete props.href
    delete props.apilist

    let [state, setState] = useState({
        content: {
            loaded: false, ...props,
        },
        onload: { func: async () => { } },
        die: { func: async () => { } },
    })

    useEffect(() => {
        state.onload.func?.()?.then?.(_ => { })

        return () => {
            state.die.func?.()?.then?.(_ => { })
        }
    }, [])


    if (props.dataMD5 != state.content.dataMD5) {
        for (let pr of Object.keys(props)) {
            state.content[pr] = props[pr]
        }
        setState({ ...state })
    }



    if (isPage) {
        if (z["pagepath"] && z["pagepath"] != props.href) {
            state = {
                content: {
                    loaded: false, ...props,
                },
                onload: { func: async () => { } },
                die: { func: async () => { } },
            }
        }
        z["pagepath"] = props.href
    }

    const refr = (obj) => {
        if (obj) {
            Object.keys(obj).forEach(k => {
                state.content[k] = obj[k]
            })
        }
        setState({ ...state })
    }

    if (isPage) {
        z.pageProps = state.content
    }
    else {
        for (let k of Object.keys(props)) {
            state.content[k] = props[k]
        }
    }

    let Parent = ComponentCSR;
    if (ssr) {
        Parent = ComponentSSR
    }

    let meta = props.meta as Meta


    return <Parent>
        {isPage && meta ? <Head>
            <title>{meta.title}</title>

            <meta charSet="UTF-8" />
            <meta name="description" content={meta.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <meta property="og:type" content={meta.og.type} />
            <meta property="og:title" content={meta.og.title || meta.title} />
            <meta property="og:description" content={meta.og.description || meta.description} />
            <meta property="og:url" content={meta.og.url} />
            <meta property="og:image" content={meta.og.image} />
            <meta property="og:image:alt" content={meta.og.alt || meta.title} />
            <meta property="og:locale" content={meta.og.locale} />
            <meta name="robots" content={`${meta.index ? "index" : "noindex"}, ${meta.follow ? "follow" : "nofollow"}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} />

            <link rel="canonical" href={meta.canonical} />
            {
                (meta.hrefLangs || []).map(hr => {
                    return <link rel="alternate" hrefLang={hr.code} href={hr.url} />
                })
            }

            <meta name="twitter:card" content={meta.twitter.card} />
            <meta name="twitter:title" content={meta.twitter.title} />
            <meta name="twitter:description" content={meta.twitter.description} />
            <meta name="twitter:image" content={meta.twitter.image} />
            <meta name="twitter:site" content={meta.twitter.site} />

            <link rel="icon" href="/favicon.ico" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "کیو ای",
                        logo: "https://cdn.qepal.com/qepal/qecircabs.webp",
                        contactPoint: { "@type": "ContactPoint", telephone: "+98-21-74391640", areaServed: { "@type": "Country", "name": "IR" } },
                        url: "https://qepal.com/",
                        sameAs: ["https://www.instagram.com/qenews", "https://x.com/armincdn", "https://www.linkedin.com/in/armin-kardan"]
                    })
                }}
            />


            {meta.ldjsons.map(ldjson => {
                return <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(ldjson)
                    }}
                />
            })}



        </Head> : null}


        {Page(state.content, refr, async (func) => {
            if (!state["loaded"]) {
                await func(typeof window != "undefined");
                // console.log("running async...")
                state["loaded"] = true
                setState({ ...state })
            }
        },
            (funcload) => {
                state.onload.func = funcload;
            },
            (func) => {
                if (!global.xmpppageloaded) {
                    global.xmpppageloaded = true
                    if (!state["loaded"] && global.nexus?.connected) {
                        func?.().then(() => { })
                    }
                    else {
                        global.nexusconnected = { func };
                    }
                }
            },

            (func) => {
                state.die.func = func;
            }, typeof window != "undefined", z)}

    </Parent>
}



export default (props: any, Page: PageEl, ssr: boolean = false) => {


    let isPage = !!props.pageid
    let z = SSRGlobal(props.pageid)

    if (isPage) {
        z.topuser = props.session.topuser
        z.middleuser = props.session.middleuser;
        z.enduser = (props.session.enduser?.token) ? EndUserFront(props.session.enduser) : null
        z.path = props.path
    }
    else {
        ssr = true
    }
    if (typeof props.session?.devmode != "undefined") global.devmode = props.session?.devmode
    return convertor(props, Page, isPage, z, ssr)
}
