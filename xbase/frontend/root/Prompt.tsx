import WindowFloat, { WindowFloatPropsType } from '@/frontend/components/qecomps/WindowFloat'
import { CSSProperties, useEffect, useState } from 'react'
import TextAreaEditFloat from '@/frontend/components/qecomps/TextAreaEditFloat'
import ReplacePro from '@/frontend/components/qecomps/ReplacePro'
import LogFloat from '@/frontend/components/qecomps/LogFloat'
import UniqueInterval from '@/frontend/components/qecomps/UniqueInterval'
import { SSRGlobal } from '../components/qecomps/Context'
import Upload from '../components/qecomps/Upload'
import Icon2Titles from '../components/qecomps/Icon2Titles'
import UserAvatar from '../components/qecomps/UserAvatar'
import Img from '../components/qecomps/Img'
import FileExplorer from '../components/qecomps/FileExplorer'
import IconExplorer from '../components/qecomps/IconExplorer'
import LinkPicker from '../components/qecomps/LinkPicker'
import { FAtoENRatio } from '../components/qecomps/Cap'
import LoginByPhone from '../components/login/LoginByPhoneForm'
import { deleteCookie, setCookie } from 'cookies-next'
import LoginByEmailForm from '../components/login/LoginByEmailForm'
import { UnitName } from '@/common/dynamic'
import { langType } from '@/common/SiteConfig'
import ProfileImage from '../components/qecomps/ProfileImage'
import TextBox from '../components/qecomps/TextBox'
import pako from 'pako';
import WindowFloatModal, { WindowFloatModalPropsType } from '../components/qecomps/WindowFloatModal'
import SerialGenerator from '../components/qecomps/SerialGenerator'
import Ico from '../components/qecomps/Ico'


declare global {
  function fileexplorer(): Promise<string>;
  function removefile(filename: string): Promise<void>;
  function iconexplorer(): Promise<string>;
  function linkpicker(defaultValue?: string): Promise<string>;
  function alerter(title: string | any, text?: string | Element, style?: any, watermark?: string): Promise<void>;
  function picker(items: Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>): Promise<string>;
  function selector(sync: () => Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>,
    on: (key: any) => Promise<void>
  ): Promise<void>;
  function success(text: string, fast?: boolean): void
  function decryptor(text: string, key: string): Promise<string>
  function encryptor(text: string, key: string): Promise<string>
  function error(text: string): void
  function loginbyphone(): void
  function loginbyemail(): void
  function localuploader(accept?: string): Promise<Buffer>
  function loginbyQE(): Promise<void>
  function loginbyGoogle(): Promise<void>
  function loginbyLinkedIn(): Promise<void>
  function loginbyGitHub(): Promise<void>
  var changeenduser: {
    name: (name: string) => Promise<{ code: number }>,
    image: (url: string) => Promise<{ code: number }>,
    unit: (unit: UnitName) => Promise<{ code: number }>,
    lang: (langcode: langType) => Promise<{ code: number }>,
  }

  function profileimage(): void
  function signout(): Promise<void>
  function uploader(specs: { title: string, text: string, style?: any, maxmb?: number, max_age_sec?: number, }): Promise<string>;
  function prompter(title: string, text?: string, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
    selectonclick?: boolean,
    type?: "text" | "number" | "url" | "email" | "tel"): Promise<string>
  function confirmer(title: any, text?: string | Element, oktext?: string, canceltext?: string): Promise<boolean>

  function serialgenerator(length: number): string;
  function customer(callback: (props: any, refresh: (props?: { [key: string]: any }) => void, resolve: any) => any, props: any): Promise<any>
  function modaler(callback: (props: any, refresh: (props?: { [key: string]: any }, smooth?: boolean) => void, resolve: any, attributes?: WindowFloatModalPropsType) => any, props?: any): Promise<any>
  function former(callback: (props: any, refresh: (props?: { [key: string]: any }) => void, resolve: any, attributes?: WindowFloatPropsType) => any, props?: any): Promise<any>
  function compress(data: string): string
  function decompress(data: string): string
  function closewinfloat(id: string)
  function closelogfast(): void;

}

function Toast(props) {
  let z = SSRGlobal()
  useEffect(() => {
    let to = 3000;
    if (props.fast) {
      to = 700
    }
    setTimeout(() => {
      if (document.getElementById("notifer"))
        document.getElementById("notifer").className = `${z.qestyles.notification} ${z.qestyles.show}`
    }, 200);
    const timeout = setTimeout(() => {
      if (document.getElementById("notifer"))
        document.getElementById("notifer").className = `${z.qestyles.notification} ${z.qestyles.hide}`
      setTimeout(() => {
        props.onfinish?.()
      }, to);
    }, to);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div id="notifer" className={`${z.qestyles.notification} ${z.qestyles.hide}`} style={{ backgroundColor: props.color }}>
      {props.message}
    </div>
  );
}

export default (props) => {
  let z = SSRGlobal()
  let [state, setState] = useState<any>({ show: null, title: null, text: null, oktext: null, canceltext: null })
  global.promptstate = state;
  let uniquekey = new Date().getTime();
  window["logger"] = {}

  if (!window["loglist"]) {
    window["loglist"] = [];
  }

  if (typeof window != "undefined") {
    UniqueInterval("M1", async () => {
      // console.log("sending cache...")
      let c = localStorage.getItem("cache")
      if (c) {
        await API["cache/cache"](JSON.parse(c))
        localStorage.removeItem("cache")
      }
    }, 60000)
  }


  window.compress = (data) => {
    return btoa(String.fromCharCode(...pako.deflate(data)))
  }

  window.decompress = (data) => {
    const binaryString = window.atob(data);
    const arr = new Uint8Array(
      [...binaryString].map(c => c.charCodeAt(0))
    );
    return pako.inflate(arr, { to: 'string' });
  }

  window.changeenduser = {
    name: async (name: string) => {
      return await api("https://qepal.com/api/xuser/change", { token: z.enduser.token, key: "name", value: name })
    },
    image: async (url: string) => {
      return await api("https://qepal.com/api/xuser/change", { token: z.enduser.token, key: "image", value: url })
    },
    unit: async (unit: UnitName) => {
      return await api("https://qepal.com/api/xuser/change", { token: z.enduser.token, key: "unit", value: unit })
    },
    lang: async (langcode: langType) => {
      return await api("https://qepal.com/api/xuser/change", { token: z.enduser.token, key: "lang", value: langcode })
    },
  }

  window.localuploader = async (accept = '.cfg') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    document.body.appendChild(input);

    return new Promise((resolve) => {
      input.onchange = async () => {
        const file = input.files?.[0];
        document.body.removeChild(input); // cleanup

        if (!file) {
          resolve(undefined);
          return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        resolve(buffer);
      };

      input.click();
    });

  }

  window.removefile = async (link: string) => {
    if (!link)
      return
    let filename = link.split("/").at(-1)
    const token = await z.enduser.tempsecret.generate();
    let lnk = 'https://cdn.ituring.ir/qeupload/' + z.enduser.uid + "/remove.php/?token=" + token
    let json = await (await fetch(lnk, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ filepath: filename })
    })).text()
  }


  window.closelog = () => {
    setTimeout(() => {
      setState({ ...global.promptstate, show: null, })
    }, 1000);
  }

  window.closelogfast = () => {
    setState({ ...global.promptstate, show: null })
  }

  if (!global.customresolve) {
    global.customresolve = () => { }
  }


  window.profileimage = () => {
    setState({ ...global.promptstate, show: "profileimage" })
  }



  window.success = (text: string, fast: boolean = false) => {
    setState({ ...global.promptstate, show: "toast", text, color: "#4CAF50", fast })
  }


  window.encryptor = async function (text: string, password: string): Promise<string> {
    const isBrowser = typeof window !== 'undefined' && typeof window.crypto?.subtle !== 'undefined';
    const enc = new TextEncoder();
    const encodedPassword = enc.encode(password);

    const keyMaterial = isBrowser
      ? await window.crypto.subtle.digest('SHA-256', encodedPassword)
      : require('crypto').createHash('sha256').update(password).digest();

    const iv = isBrowser
      ? window.crypto.getRandomValues(new Uint8Array(12))
      : require('crypto').randomBytes(12);

    const key = isBrowser
      ? await window.crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['encrypt'])
      : null;

    const encrypted = isBrowser
      ? await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
      : (() => {
        const crypto = require('crypto');
        const cipher = crypto.createCipheriv('aes-256-gcm', keyMaterial, iv);
        const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([ciphertext, authTag]);
      })();

    const buffer = isBrowser ? new Uint8Array(encrypted) : encrypted;
    const authTag = buffer.slice(-16);
    const ciphertext = buffer.slice(0, -16);

    const btoaFn = typeof btoa !== 'undefined'
      ? btoa
      : (str: string) => Buffer.from(str, 'binary').toString('base64');

    const joinBase64 = (buf: Uint8Array) => {
      const chunkSize = 8192; // Safe chunk size
      let result = '';
      for (let i = 0; i < buf.length; i += chunkSize) {
        const chunk = buf.subarray(i, i + chunkSize);
        result += String.fromCharCode(...chunk);
      }
      return btoaFn(result)
    };

    return [
      joinBase64(iv),
      joinBase64(ciphertext as any),
      joinBase64(authTag as any)
    ].join(':');
  };

  window.decryptor = async function (encryptedBase64: string, password: string): Promise<string> {
    const [ivB64, ciphertextB64, tagB64] = encryptedBase64.split(':');
    const isBrowser = typeof window !== 'undefined' && typeof window.crypto?.subtle !== 'undefined';
    const enc = new TextEncoder();
    const dec = new TextDecoder();

    const atobFn = typeof atob !== 'undefined'
      ? atob
      : (b64: string) => Buffer.from(b64, 'base64').toString('binary');

    const toUint8Array = (b64: string) =>
      Uint8Array.from(atobFn(b64), c => c.charCodeAt(0));

    const iv = toUint8Array(ivB64);
    const ciphertext = toUint8Array(ciphertextB64);
    const authTag = toUint8Array(tagB64);
    const data = new Uint8Array([...ciphertext, ...authTag]);

    const encodedPassword = enc.encode(password);
    const keyMaterial = isBrowser
      ? await window.crypto.subtle.digest('SHA-256', encodedPassword)
      : require('crypto').createHash('sha256').update(password).digest();

    const key = isBrowser
      ? await window.crypto.subtle.importKey('raw', keyMaterial, 'AES-GCM', false, ['decrypt'])
      : null;

    if (isBrowser) {
      const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      return dec.decode(decrypted);
    } else {
      const crypto = require('crypto');
      const decipher = crypto.createDecipheriv('aes-256-gcm', keyMaterial, iv);
      decipher.setAuthTag(Buffer.from(authTag));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(ciphertext)),
        decipher.final()
      ]);
      return decrypted.toString('utf8');
    }
  };

  window.serialgenerator = (len: number): string => {
    var chars = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < len; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }

  window.error = (text: string) => {
    setState({ ...global.promptstate, show: "toast", text, color: "maroon" })
  }

  window.confirmer = (title: string, text: string | Element, oktext: string, canceltext: string): Promise<boolean> => {
    if (text) {
      setState({ ...global.promptstate, show: "confirm", title, text, oktext, canceltext })
    }
    else {
      setState({ ...global.promptstate, show: "confirm", title: null, text: title })
    }

    return new Promise(r => {
      window["confirmresolve"] = (x) => { r(x) }
    })
  }

  window.alerter = (title: string | any, text: string | Element, style?: any, watermark?: string): Promise<void> => {

    if (text) {
      setState({ ...global.promptstate, show: "alert", title, text, style, watermark })
    }
    else {
      if (typeof title == "string") {
        setState({ ...global.promptstate, show: "alert", title: null, text: title, style, watermark })
      }
      else {
        title = JSON.stringify(title, null, 2)
        setState({ ...global.promptstate, show: "alert", title: null, text: title, style, watermark, json: true })

      }
    }

    return new Promise(r => {
      window["alertresolve"] = (x) => { r(x) }
    })
  }


  window.linkpicker = (defaultValue): Promise<string> => {

    setState({ ...global.promptstate, show: "linkpicker", defaultValue })

    return new Promise(r => {
      window["linkpickerresolve"] = (x) => { r(x) }
    })
  }

  window.fileexplorer = (): Promise<string> => {

    setState({ ...global.promptstate, show: "fileexplorer" })

    return new Promise(r => {
      window["fileexresolve"] = (x) => { r(x) }
    })
  }

  window.iconexplorer = (): Promise<string> => {

    setState({ ...global.promptstate, show: "iconexplorer" })

    return new Promise(r => {
      window["iconexresolve"] = (x) => { r(x) }
    })
  }

  window.prompter = (title: string, text: string, maxlen: number = null,
    small: boolean = false, defaulttext: string = "", style?: any, selectonclick: boolean = false,
    type: ("text" | "number" | "url" | "email" | "tel") = "text"): Promise<string> => {
    if (text) {
      setState({ ...global.promptstate, show: "prompt", title, text, maxlen, small, defaulttext, style, selectonclick, type })
    }
    else {
      setState({ ...global.promptstate, show: "prompt", title: null, text: title, maxlen: null, small, defaulttext, selectonclick, type })
    }

    return new Promise(r => {
      window["promptresolve"] = (x) => { r(x) }
    })
  }



  window.picker = (items): Promise<string> => {
    setState({ ...global.promptstate, show: "picker", items })
    return new Promise(r => {
      window["pickerresolve"] = (x) => { r(x) }
    })
  }

  window.selector = (sync, on): Promise<void> => {
    setState({ ...global.promptstate, show: "selector", sync, on })
    return new Promise(r => {
      window["selectorresolve"] = (x) => { r(x) }
    })
  }




  window.uploader = (specs): Promise<string> => {

    localStorage.removeItem("uploader-propmpt-upload")
    setState({ ...global.promptstate, show: "upload", title: specs.title, text: specs.text, maxmb: specs.maxmb, max_age_sec: specs.max_age_sec, style: specs.style })

    return new Promise(r => {
      window["uploadresolve"] = (x) => { r(x) }
    })
  }


  window["logonstop"] = (cb: () => void) => {
    window["loggeronstop"] = () => { cb() };
  }

  window.log = (obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }) => {
    if (global.promptstate.show != "log") {
      window["loglist"].push(obj)
      window["logger"] = {};
      setState({ ...global.promptstate, show: "log" })
      setTimeout(() => {
        for (let it of window["loglist"]) {
          window["logger"]?.add?.(it)
        }
        window["loglist"] = [];
      }, 500);
    }
    else {
      if (window["loglist"].length == 0) {
        window["logger"]?.add?.(obj)
      }
      else {
        window["loglist"]?.push(obj)
      }
    }
  }

  window.loginbyphone = () => {
    setState({ ...global.promptstate, show: "loginbyphone" })
  }

  window.loginbyemail = () => {
    setState({ ...global.promptstate, show: "loginbyemail" })
  }

  window.signout = async () => {
    try {
      let json = await api("/api/session/signout", {})
      if (json.code == 0) {
        deleteCookie("session-token")
        window.location.reload()
      }
    } catch { }

  }


  window.loginbyQE = async () => {
    let json = await api("/api/session/getservsecretkey", {})
    if (json.code == 0) {
      const data = encodeURIComponent(JSON.stringify({
        origin: window.location.origin,
        servsecretkey: json.key
      }));
      const popup = window.open(`https://qepal.com/fa/auth?data=${data}`, "authWindow", "width=500,height=600");
      window.addEventListener("message", (event) => {
        if (event.origin === "https://qepal.com") {
          if (event.data.token) {
            setCookie("session-token", event.data.token, { maxAge: 30 * 86400 })
            window.location.reload()
          }
          popup.close();
        }
      });
    }
    else {
      console.log(json)
    }
  }

  window.loginbyGitHub = async () => {
    let json = await api("/api/session/getservsecretkey", {})
    if (json.code == 0) {
      const data = encodeURIComponent(JSON.stringify({
        origin: window.location.origin,
        servsecretkey: json.key,
        method: "github",
      }));
      const popup = window.open(`https://qepal.com/fa/auth?data=${data}`, "authWindow", "width=500,height=600");
      window.addEventListener("message", (event) => {
        if (event.origin === "https://qepal.com") {
          if (event.data.token) {
            setCookie("session-token", event.data.token, { maxAge: 30 * 86400 })
            window.location.reload()
          }
          popup.close();
        }
      });
    }
    else {
      console.log(json)
    }
  }


  window.loginbyLinkedIn = async () => {
    let json = await api("/api/session/getservsecretkey", {})
    if (json.code == 0) {
      const data = encodeURIComponent(JSON.stringify({
        origin: window.location.origin,
        servsecretkey: json.key,
        method: "linkedin",
      }));
      const popup = window.open(`https://qepal.com/fa/auth?data=${data}`, "authWindow", "width=500,height=600");
      window.addEventListener("message", (event) => {
        if (event.origin === "https://qepal.com") {
          if (event.data.token) {
            setCookie("session-token", event.data.token, { maxAge: 30 * 86400 })
            window.location.reload()
          }
          popup.close();
        }
      });
    }
    else {
      console.log(json)
    }
  }


  window.loginbyGoogle = async () => {
    let json = await api("/api/session/getservsecretkey", {})
    if (json.code == 0) {
      const data = encodeURIComponent(JSON.stringify({
        origin: window.location.origin,
        servsecretkey: json.key,
        method: "google",
      }));
      const popup = window.open(`https://qepal.com/fa/auth?data=${data}`, "authWindow", "width=500,height=600");
      window.addEventListener("message", (event) => {
        if (event.origin === "https://qepal.com") {
          if (event.data.token) {
            setCookie("session-token", event.data.token, { maxAge: 30 * 86400 })
          }
          popup.close();
        }
      });
    }
    else {
      console.log(json)
    }
  }



  window.customer = (cb, props): Promise<any> => {
    let id = SerialGenerator(5)
    const FinalComponent = () => {
      let [st, setst] = useState<any>({ content: props })
      if (st.resolved)
        return null
      let el = cb(st.content, (prop?) => {
        Object.keys(prop || {}).forEach(k => st.content[k] = prop[k])
        setst({ ...st })
      }, (x) => {
        setst({ ...st, resolved: true }); window["customresolve" + id](x)
      })
      return el
    }
    setState({ ...global.promptstate, [`customer${id}`]: <FinalComponent /> })
    return new Promise(r => {
      window["customresolve" + id] = (x) => { setState({ ...global.promptstate, [`customer${id}`]: null }); r(x); }
    })
  }

  window.modaler = (cb, props = {}): Promise<any> => {
    let id = SerialGenerator(5)
    const FinalComponent = () => {
      let [st, setst] = useState<any>({ content: props, attributes: { style: { top: "50%" } } })

      let refer: any = {};
      if (st.resolved)
        return null

      let el = cb(st.content, (prop?, smooth?) => {
        Object.keys(prop || {}).forEach(k => st.content[k] = prop[k])
        if (smooth) {
          document.getElementById(id)?.classList.add("opacity-0")
          document.getElementById(id)?.classList.add("scale-10")
          setTimeout(() => {
            document.getElementById(id)?.classList.remove("opacity-0")
            document.getElementById(id)?.classList.remove("scale-10")
          }, 650);
          setTimeout(() => {
            setst({ ...st })
          }, 150);
        }
        else {
          setst({ ...st })
        }
      }, (x) => {
        refer.close()
        setTimeout(() => { setst({ ...st, resolved: true }); window["customresolve" + id](x) }, 400)
      }, st.attributes)

      if (!st.attributes.style.top && !st.attributes.style.bottom) {
        st.attributes.style.top = "50%"
      }
      if (!st.attributes.style.left) {
        st.attributes.style.left = "50%"
      }
      if (!st.attributes.style.transform) {
        st.attributes.style.transform = "translate(-50%, -50%)"
      }

      if (!st.attributes["zplus"])
        st.attributes["zplus"] = (st.attributes["zplus"] || 0) + Object.keys(global.promptstate).filter(k => k.startsWith("customer") && global.promptstate[k]).length


      return <WindowFloatModal {...st.attributes} _refer={refer} onclose={() => {
        setst({ ...st, resolved: true }); window["customresolve" + id](null)
      }}>
        <div id={id} className={'transition-all duration-200'}>
          {el}
        </div>
      </WindowFloatModal>
    }
    setState({ ...global.promptstate, [`customer${id}`]: <FinalComponent /> })
    return new Promise(r => {
      window["customresolve" + id] = (x) => { setState({ ...global.promptstate, [`customer${id}`]: null }); r(x); }
    })
  }

  window.former = (cb, props = {}): Promise<any> => {
    let id = SerialGenerator(5)
    const FinalComponent = () => {
      let [st, setst] = useState<any>({ content: props })
      let refer: any = {};
      if (st.resolved)
        return null
      let attributes = { style: {} }
      let el = cb(st.content, (prop?) => {
        Object.keys(prop || {}).forEach(k => st.content[k] = prop[k])
        setst({ ...st })
      }, (x) => {
        refer.close()
        setTimeout(() => { setst({ ...st, resolved: true }); window["customresolve" + id](x) }, 400)
      }, attributes)

      if (!attributes["zplus"])
        attributes["zplus"] = (attributes["zplus"] || 0) + Object.keys(global.promptstate).filter(k => k.startsWith("customer") && global.promptstate[k]).length

      return <WindowFloat {...attributes} _refer={refer} onclose={() => {
        setst({ ...st, resolved: true }); window["customresolve" + id](null)
      }}>
        {el}
      </WindowFloat>
    }
    setState({ ...global.promptstate, [`customer${id}`]: <FinalComponent /> })
    return new Promise(r => {
      window["customresolve" + id] = (x) => { setState({ ...global.promptstate, [`customer${id}`]: null }); r(x); }
    })
  }



  const logchecker = () => {
    setTimeout(() => {
      if (global.promptstate.show == "log") {
        logchecker();
      }
    }, 1000);
  }

  let dialog = null;

  if (!global.promptstate.show) {
    dialog = null
  }
  else if (global.promptstate.show == "profileimage") {
    dialog = <ProfileImage onclose={() => { setState({ ...global.promptstate, show: false }) }} />
  }
  else if (global.promptstate.show == "loginbyphone") {
    dialog = <LoginByPhone onclose={() => { setState({ ...global.promptstate, show: false }) }} />
  }
  else if (global.promptstate.show == "loginbyemail") {
    dialog = <LoginByEmailForm onclose={() => { setState({ ...global.promptstate, show: false }) }} />
  }
  else if (global.promptstate.show == "toast") {
    dialog = <Toast message={global.promptstate.text} color={global.promptstate.color} fast={global.promptstate.fast}
      onfinish={() => { setState({ ...global.promptstate, show: false }) }} />
  }
  else if (global.promptstate.show == "linkpicker") {
    dialog = <LinkPicker defaultValue={global.promptstate.defaultValue} on={(url) => {
      setState({ ...global.promptstate, show: false, defaultValue: null })
      window["linkpickerresolve"](url)
    }} />
  }
  else if (global.promptstate.show == "fileexplorer") {
    dialog = <FileExplorer on={(url) => {
      setState({ ...global.promptstate, show: false })
      window["fileexresolve"](url)
    }} />
  }
  else if (global.promptstate.show == "iconexplorer") {
    dialog = <IconExplorer on={(url) => {
      setState({ ...global.promptstate, show: false })
      window["iconexresolve"](url)
    }} />
  }
  else if (global.promptstate.show == "prompt") {
    let width = global.promptstate.style?.width;
    delete global.promptstate.style?.width
    // let zIndex = state.style?.zIndex
    delete global.promptstate.style?.zIndex
    dialog = <TextAreaEditFloat title={global.promptstate.title || z.lang.sysmsg} title2={global.promptstate.text} maxlen={global.promptstate.maxlen}
      style={{ ...global.promptstate.style || {}, direction: z.lang.dir }} width={width} z={99999} selectonclick={global.promptstate.selectonclick}
      small={global.promptstate.small} value={global.promptstate.defaulttext} onclose={() => {
        setState({ ...global.promptstate, show: false })
        window["promptresolve"](null)
      }} on={(txt) => { window["promptresolve"](txt); setState({ show: false }) }} />
  }

  else if (global.promptstate.show == "picker") {
    let width = global.promptstate.style?.width;
    delete global.promptstate.style?.width
    // let zIndex = state.style?.zIndex
    delete global.promptstate.style?.zIndex


    dialog = <WindowFloat
      title={z.lang.choose}
      z={99999}
      style={{ direction: z.lang.dir }}
      onclose={() => {
        setState({ ...global.promptstate, show: false })
        window["pickerresolve"](null)
      }}>
      <TextBox defaultValue={global.promptstate.search} on={txt => {
        clearTimeout(global.cpickerprompt)
        global.cpickerprompt = setTimeout(() => {
          setState({ ...global.promptstate, search: txt })
        }, 100);
      }} />
      <br-x />
      <div style={{ maxHeight: 400, overflowX: "scroll" }}>
        {(global.promptstate.items).filter(st => (!global.promptstate.search) || (st.title1 || "").includes(global.promptstate.search) || (st.title2 || "").includes(global.promptstate.search)).map(st => {

          let rightic = null
          if (typeof st.righticon != "string" && st.righticon) {
            rightic = st.righticon
          }
          else if (typeof st.righticon == "string") {
            if (!st.righticon.startsWith("http") && !st.righticon.startsWith("/")) {
              rightic = <Img src={cdn("/files/" + st.righticon)} style={{ width: 25 }} />
            }
            else {
              rightic = <Img src={st.righticon} style={{ width: 25 }} />
            }
          }

          let image = null;
          if (st.image) {
            let addr = !st.image.includes("/") ? cdn("/files/" + st.image) : cdn(st.image)
            image = <Img src={addr} style={{ height: 28, width: 28, objectFit: "contain", borderRadius: 5 }} />
            if (st.imageprop) {
              image = <UserAvatar image={addr} imageprop={st.imageprop} w={30} />
            }
          }

          return <Icon2Titles title1={st.title1} style={{ backgroundColor: st.highlight ? (st.highlightcolor || "#61A75A") : "#B6C8B4", marginBottom: 1 }}
            icon={image}
            title2={<f-10 style={{ marginTop: 5 }}>{st.title2}</f-10>}
            righticon={rightic}
            on={async () => {
              window["pickerresolve"](st.key); setState({ ...global.promptstate, show: false })
            }}
          />
        })}
      </div>
    </WindowFloat>
  }


  else if (global.promptstate.show == "selector") {
    delete global.promptstate.style?.width
    delete global.promptstate.style?.zIndex
    let items = global.promptstate.sync()

    dialog = <WindowFloat
      title={z.lang.choose}
      z={99999}
      style={{ direction: z.lang.dir }}
      onclose={() => {
        setState({ ...global.promptstate, show: false })
        window["selectorresolve"](null)
      }}>
      <div style={{ maxHeight: 400, overflowX: "scroll" }}>
        {(items).map(st => {

          let image = null;
          if (st.image) {
            let addr = !st.image.includes("/") ? cdn("/files/" + st.image) : cdn(st.image)
            image = <Img src={addr} style={{ height: 28, width: 28, objectFit: "contain", borderRadius: 5 }} />
            if (st.imageprop) {
              image = <UserAvatar image={addr} imageprop={st.imageprop} w={30} />
            }
          }
          return <Icon2Titles
            title1={st.title1}
            style={{ backgroundColor: st.highlight ? (st.highlightcolor || "#61A75A") : "#B6C8B4", marginBottom: 1 }}
            icon={image}
            title2={<f-10 style={{ marginTop: 5 }}>{st.title2}</f-10>}
            righticon={st.righticon ? <Img src={cdn("/files/" + st.righticon)} style={{ width: 25 }} /> : null}
            on={async () => {
              await global.promptstate.on(st.key)
              items = global.promptstate.sync()
              setState({ ...global.promptstate })
            }}
          />
        })}
      </div>
    </WindowFloat>
  }



  else if (global.promptstate.show == "upload") {


    dialog = <WindowFloat
      title={global.promptstate.title || z.lang.sysmsg}
      maxWidth={global.promptstate.maxWidth || 300}
      onclose={() => {
        setState({ ...global.promptstate, show: false }); window["uploadresolve"]?.(null);
      }}
      style={{ direction: z.lang.dir }}
      z={99999}>

      <br-x />

      {global.promptstate.percent > 0 ? <br-x /> : <f-cc>
        <Ico on={async () => {
          uploaders["propmpt-upload"].clear(); uploaders["propmpt-upload"].open()
        }} icon="icon-[icomoon-free--files-empty] w-[35px] h-[35px]" text={"انتخاب فایل"} />
      </f-cc>}
      <br-xx />

      <f-cc class={!global.promptstate.percent ? z.qestyles.none : z.qestyles.op1}>
        <Upload
          id={"propmpt-upload"}
          // extensionfilter={[".jpg", ".png", '.jpeg', '.svg', '.webp']}
          max_age_sec={global.promptstate.max_age_sec}
          maxsize={global.promptstate.maxmb * 1024 * 1024 || 10 * 1024 * 1024} //10MB!
          singlefile
          // hidefileicons
          onclear={() => setState({ ...global.promptstate, percent: null, url: null })}
          on={(url) => {
            if (url.length > 0) {
              setState({ ...global.promptstate, percent: url[0].percent, url: url[0].url, maxWidth: url[0].percent == 100 ? "calc(min(600px, 80vw))" : null })
            }
            else {
              setState({ ...global.promptstate, maxWidth: null })
            }
          }}
        />
      </f-cc>
      {global.promptstate.percent > 0 ? <br-x /> : null}
      <br-x />
      {
        global.promptstate.percent == 100 && global.promptstate.url ? <b-200 class={"btn btn-active max-h-[35px]"}
          style={{ maxHeight: 32, flex: 1, display: "flex", width: "100%", fontSize: 11 }}
          onClick={() => {
            let url = global.promptstate.url;
            setState({ ...global.promptstate, show: false });
            window["uploadresolve"]?.(url);
          }}>{z.lang.confirm}</b-200> : null
      }
      <br-xx />

    </WindowFloat>
  }
  else if (global.promptstate.show == "log") {
    return <LogFloat function={window["logger"]} onclose={() => { setState({ ...global.promptstate, show: false }) }} z={1000} />
  }
  else if (global.promptstate.show == "confirm") {
    return <WindowFloat
      title={global.promptstate.title || z.lang.sysmsg}
      onclose={() => { window["confirmresolve"](false); setState({ ...global.promptstate, show: false }) }}
      maxWidth={400}
      z={9999}
      style={{ direction: z.lang.dir }}
    >

      {typeof global.promptstate.text == "string" ? <p>{ReplacePro(global.promptstate.text, "\n", <br key={"alert_" + uniquekey++} />)}</p> : global.promptstate.text}
      <br-x />
      <b-200 class={z.qestyles.btnaccept} onClick={() => { window["confirmresolve"](true); setState({ ...global.promptstate, show: false }) }}>{global.promptstate.oktext ? global.promptstate.oktext : z.lang.imsure}</b-200>
      <br-xx />
      <b-200 class={z.qestyles.btncancel} onClick={() => { window["confirmresolve"](false); setState({ ...global.promptstate, show: false }) }}>{global.promptstate.canceltext ? global.promptstate.canceltext : z.lang.cancel}</b-200>
    </WindowFloat>
  }
  else if (global.promptstate.show == "alert") {
    let direction = z.lang.dir
    if (!global.promptstate.text) {
      global.promptstate.text = "null"
    }
    if (z.lang.code == "fa" && FAtoENRatio(global.promptstate.text.toString()) < 0.2) {
      direction = "ltr"
    }
    return <WindowFloat
      title={global.promptstate.title || z.lang.sysmsg}
      style={{ direction }}
      onclose={() => { window["alertresolve"]?.(); setState({ ...global.promptstate, show: false }) }}
      maxWidth={(global.promptstate.json ? "calc(min(100vw,650px))" : 400)}
      z={10000}
    >
      {global.promptstate.json ? <pre style={{ fontSize: 11, direction: "ltr", maxHeight: "70vh", overflowY: "scroll" }}>
        {global.promptstate.text}
      </pre> : <f-cc style={{
        position: "relative",
        direction: global.promptstate.text.startsWith("[") || global.promptstate.text.startsWith("{") ? "ltr" : "inherit"
      }}>

        {global.promptstate.watermark ? <img style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          objectFit: "fill", top: "10%", height: "70%", opacity: 0.1
        }} src={state.watermark} /> : null}



        <div style={{ zIndex: 200, width: "100%" }}>
          {typeof global.promptstate.text == "string" ? <p style={{ ...global.promptstate.style, zIndex: 452 }}>
            {ReplacePro(global.promptstate.text, "\n", <br key={"alert_" + uniquekey++} />)}
          </p> : global.promptstate.text}
          <br-x />
          <br-xx />
          <b-200 class={z.qestyles.btnaccept}
            onClick={() => { window["alertresolve"]?.(); setState({ ...global.promptstate, show: false }) }}>{z.lang.confirm}
          </b-200>
        </div>
      </f-cc>}
    </WindowFloat>
  }
  return <>
    {dialog}
    {Object.keys(global.promptstate || {}).map((k, i) => {
      if (k.startsWith("customer")) {
        return global.promptstate[k]
      }
    })}
  </>


}