import '../styles/globals.css'
import styles from '../styles/styles.module.css'
import qestyles from '../styles/qe.module.css'
import { useEffect } from "react";
import dynamic from 'next/dynamic';
const Prompt = dynamic(() => import("@/frontend/root/Prompt.tsx").then(x => x.default), { ssr: false })
const QELoader = dynamic(() => import("@/frontend/root/QELoader.tsx").then(x => x.default), { ssr: false })

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
import pako from 'pako'

const CalendarFA = dynamic(() => import("@/frontend/components/qecomps/CalendarFA.tsx").then(x => x.default), { ssr: false })
const CalendarEN = dynamic(() => import("@/frontend/components/qecomps/CalendarEN.tsx").then(x => x.default), { ssr: false })
const Calendar = dynamic(() => import("@/frontend/components/qecomps/Calendar.tsx").then(x => x.default), { ssr: false })

const version = "1.1"

export default function App({ Component, pageProps }) {

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

  if (props?.session?.code) {
    return null
  }

  let z = SSRGlobal(props.pageid)

  z.root = "/" + props.langcode;
  z.styles = styles
  z.qestyles = qestyles

  if (props.nlangs) {
    z.lang = props.nlangs
  }


  if (typeof window != "undefined") {
    let ver = localStorage.getItem("version");
    if (ver != version) {
      localStorage.clear()
      localStorage.setItem("version", version)
      // window.location.reload()
    }
    Scroller();
    DeclarationsBefore(props, z)
    APILister(props)

    let lng = localStorage.getItem("lang-" + props.langcode);
    if (lng && !z.lang?.langfulldone) {
      z.lang = JSON.parse(lng)
      z.lang.langfulldone = true
    }
  }

  let sessionreloader: any = {};

  useEffect(() => {

    if (!pageProps.data) {
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


  if (typeof window != "undefined") {
    global.theme = document.body.getAttribute("data-theme")
  }

  props["isPage"] = true

  if (!pageProps.data && process && process.env.BUILDMODE) {
    return null
  }


  return (
    <Context.Provider value={props.pageid}>
      {pageProps.data ? <Script src="/xmpp.min.js" strategy="lazyOnload" onLoad={() => { Nexus(z) }} /> : null}
      {pageProps.data ? <Calendar /> : null}
      {pageProps.data ? <CalendarEN /> : null}
      {pageProps.data ? <CalendarFA /> : null}
      {pageProps.data ? <Prompt /> : null}
      <Component {...props} />
      {pageProps.data ? <QELoader /> : null}
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