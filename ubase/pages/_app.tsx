import '../styles/globals.css'
import styles from '../styles/styles.module.css'
import qestyles from '../styles/qe.module.css'
import { useEffect } from "react";
import dynamic from 'next/dynamic';
const Prompt = dynamic(() => import("@/frontend/root/Prompt.tsx").then(x => x.default), { ssr: false })
const QELoader = dynamic(() => import("@/frontend/root/QELoader.tsx").then(x => x.default), { ssr: false })

import _crossstyles from "@/styles/crossstyles";
import pako from 'pako'
import QSON from '@/common/QSON'
import Scroller from '@/frontend/root/Scroller'
import Context from "@/frontend/components/qecomps/Context";
import { SSRGlobal } from "@/frontend/components/qecomps/Context";
import { DeclarationsBefore, DeclarationsAfter, LangRestore, APILister } from "@/frontend/root/Declarations";
import Router from 'next/router';
import { init, send } from '@/frontend/bridge';
import Script from 'next/script';
import Nexus from '@/frontend/nexus/Nexus';
import { Loopez } from '@/common/dynamic';
import md5 from 'crypto-js/md5';

const CalendarFA = dynamic(() => import("@/frontend/components/qecomps/CalendarFA.tsx").then(x => x.default), { ssr: false })
const CalendarEN = dynamic(() => import("@/frontend/components/qecomps/CalendarEN.tsx").then(x => x.default), { ssr: false })
const Calendar = dynamic(() => import("@/frontend/components/qecomps/Calendar.tsx").then(x => x.default), { ssr: false })

const version = "1.1"

export default function App({ Component, pageProps }) {

  if (!pageProps.data) {
    if (typeof window != "undefined")
      Router.push('/');
    return null
  }

  if (typeof window != "undefined") {
    QSON();
  }
  let props = {} as any
  try {
    if (pageProps.data) {
      let dataMD5 = md5(pageProps.data).toString();
      props = global.QSON.parse(inflateFromBase64(pageProps.data))
      props.dataMD5 = dataMD5
    }
  } catch { }

  let z = SSRGlobal(props.pageid)

  z.root = "/" + props.langcode;
  z.styles = styles
  z.qestyles = qestyles
  z.crossstyles = _crossstyles

  // if ((z["pagepath"] && z["pagepath"] != props.href) || (!global.pageid && !z.lang)) {
  //   z.lang = props.nlangs
  // }

  if (props.nlangs) {
    z.lang = props.nlangs
  }


  if (typeof window != "undefined") {
    let ver = localStorage.getItem("version");
    if (ver != version) {
      localStorage.clear()
      localStorage.setItem("version", version)
      window.location.reload()
    }
    Scroller();
    DeclarationsBefore(props, z)
    APILister(props)

    let lng = localStorage.getItem("lang-" + props.langcode);
    if (lng && !z.lang.langfulldone) {
      z.lang = JSON.parse(lng)
      z.lang.langfulldone = true
    }
  }

  let sessionreloader: any = {};

  useEffect(() => {

    // Router.events.on("routeChangeStart", async () => {
    //   // let subs = Array.from(await global.nexus?.channels() || [])
    //   // for (let channel of subs) {
    //   //   await global.nexus?.unsubscribe?.(channel)
    //   // }
    //   // global.nexus.msgreceiver = () => { }
    //   // global.xmpppageloaded = false
    // })

    if (!pageProps.data) {
      Router.push('/');
      return
    }

    window.reloadsession = () => {
      global.noloading = true;
      window.winscrollers = {}
      window.onunloader?.()
      sessionreloader?.run?.();
    }
    global.pageProps = props
    DeclarationsAfter(props, z)
    LangRestore(props, z)

    init();
    global.bridge = {
      send: send
    }
    Loopez()
    setTimeout(() => {
      if (!z.lang.code) {
        alerter("System Fatala Error: Language not found", "دیتابیس متصل شده دارای زبان کاربر نسیت لطفا دیتابیس را با داده های اساسی پر کنی." +
          "Your connected database doesnt have essential language data, please fix it.")
      }
    }, 4000);
    document.documentElement.setAttribute('data-theme', 'light')


  }, [])


  props["isPage"] = true

  return (
    <Context.Provider value={props.pageid}>
      <Script src="/xmpp.min.js" strategy="lazyOnload" onLoad={() => { Nexus(z) }} />
      <Calendar />
      <CalendarEN />
      <CalendarFA />
      <div id="wind" style={{ overflowY: "auto", height: "100vh" }} >
        <Prompt />
        <Component {...props} />
      </div>
      <QELoader />
    </Context.Provider>
  )
}

/**
* Decompress (inflate) a Base64-encoded string and return the original string.
* @param {string} base64String - The Base64-encoded compressed string.
* @returns {string} - The decompressed string.
*/
function inflateFromBase64(base64String) {
  // Convert the Base64 string to a Uint8Array
  const compressedData = Buffer
    ? Uint8Array.from(Buffer.from(base64String, 'base64')) // Node.js
    : Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)); // Browser

  // Decompress the data using pako
  const decompressedData = pako.inflate(compressedData, { to: 'string' });

  return decompressedData;
}