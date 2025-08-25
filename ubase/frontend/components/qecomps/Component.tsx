import { useEffect, useState } from 'react';
import { MiddleUserFront, MiddleUserType, TopUserType } from '../../user';
import Head from 'next/head'
import { SSRGlobal } from './Context';
import ComponentSSR from './Componentd';
import dynamic from 'next/dynamic';
import { CrossStyles } from '@/styles/crossstyles.ts';
const ComponentCSR = dynamic(() => import('./Componentd.tsx').then(x => x.default), { ssr: false })




export type ZType = {
    pageProps: any, root: string,
    lang: { [key in string]: any },
    topuser: TopUserType
    middleuser: MiddleUserType,
    crossstyles: CrossStyles,
    styles: any,
    qestyles: any,
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


    let die = {} as any
    let onload = {} as any
    let prop = { ...props }
    let noheader = props.session.noheader
    let full = props.session.full
    props = prop

    delete props.query?.session
    delete props.query?.lang
    delete props.nlangs
    delete props.session
    delete props.pageid
    delete props.href
    delete props.apilist


    useEffect(() => {
        onload.func?.()?.then?.(_ => { })

        return () => {
            die.func?.()?.then?.(_ => { })
        }
    }, [])

    let [state, setState] = useState({
        content: {
            loaded: false, ...props,
        },
    })

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
                }
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

    return <Parent>
        {isPage && props.title ? <Head>
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta property="og:image" content={props.mainimage} />
            <meta property="og:image:alt" content={props.title} />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": props.title,
                        "image": props.mainimage,
                        "description": props.description
                    })
                }}
            />

            <link rel="icon" href="/favicon.ico" />
        </Head> : null}


        {!full ? <main className={z.qestyles.main}>
            <div className={z.qestyles.graybox} style={{ paddingTop: noheader ? 0 : 37 }} >
                {Page(state.content, refr, async (func) => {
                    if (!state["loaded"]) {
                        await func(typeof window != "undefined");
                        state["loaded"] = true
                        setState({ ...state })
                    }
                },
                    async (func) => {
                        onload.func = func;
                    },
                    async (func) => {
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

                    async (func) => {
                        die.func = func;
                    },

                    typeof window != "undefined", z)}

            </div>
        </main> : null}

        {!noheader ? <br-x style={{ height: 38 }} /> : null}

        {full ? Page(state.content, refr, async (func) => {
            if (!state["loaded"]) {
                await func(typeof window != "undefined");
                // console.log("running async...")
                state["loaded"] = true
                setState({ ...state })
            }
        },
            async (func) => {
                onload.func = func;
            },
            async (func) => {
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

            async (func) => {
                die.func = func;
            }, typeof window != "undefined", z) : null}

    </Parent>
}



export default (props: any, Page: PageEl, ssr: boolean = false) => {

    let isPage = !!props.pageid
    let z = SSRGlobal(props.pageid)

    if (isPage) {
        z.topuser = props.session.topuser
        z.middleuser = MiddleUserFront(props.session.middleuser);
        z.path = props.path
    }
    else {
        ssr = true
    }
    if (typeof props.session?.devmode != "undefined") global.devmode = props.session?.devmode
    return convertor(props, Page, isPage, z, ssr)
}
