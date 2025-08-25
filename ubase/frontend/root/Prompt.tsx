import WindowFloat from '@/frontend/components/qecomps/WindowFloat'
import { CSSProperties, useEffect, useState } from 'react'
import TextAreaEditFloat from '@/frontend/components/qecomps/TextAreaEditFloat'
import ReplacePro from '@/frontend/components/qecomps/ReplacePro'
import LogFloat from '@/frontend/components/qecomps/LogFloat'
// import LoginFloat from '@/frontend/components/menu/LoginFloat.tsx';
import UniqueInterval from '@/frontend/components/qecomps/UniqueInterval'
import { SSRGlobal } from '../components/qecomps/Context'
import Upload from '../components/qecomps/Upload'
import Icon2Titles from '../components/qecomps/Icon2Titles'
import UserAvatar from '../components/qecomps/UserAvatar'
import Signature from '../components/qecomps/Signature'
import { CrossStyles } from '@/styles/crossstyles'
import _crossstyles from '@/styles/crossstyles'
import Img from '../components/qecomps/Img'
import FileExplorer from '../components/qecomps/FileExplorer'
import IconExplorer from '../components/qecomps/IconExplorer'
import LinkPicker from '../components/qecomps/LinkPicker'
import Calendar from '../components/qecomps/CalendarFA'
import { FAtoENRatio } from '../components/qecomps/Cap'
import React from 'react'
import TextBox from '../components/qecomps/TextBox'

declare global {
    var crossstyles: CrossStyles
    function fileexplorer(): Promise<string>;
    function closeform(): void;
    function removefile(filename: string): Promise<void>;
    function iconexplorer(): Promise<string>;
    function linkpicker(defaultValue?: string): Promise<string>;
    function alerter(title: string | any, text?: any, style?: any, watermark?: string): Promise<void>;
    function picker(items: Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>): Promise<string>;
    function selector(sync: () => Array<{ key: any, title1?: any, title2?: any, image?: any, imageprop?: any, righticon?: any, highlight?: boolean }>,
        on: (key: any) => Promise<void>
    ): Promise<void>;
    function success(text: string, fast?: boolean): void
    function decryptor(text: string, key: string): Promise<string>
    function encryptor(text: string, key: string): Promise<string>
    function error(text: string): void
    function login(): void
    function serialgenerator(length: number): string;
    function uploader(specs: { title: string, text: string, style?: any, maxmb?: number, max_age_sec?: number, }): Promise<string>;
    function prompter(title: any, text?: any, maxlen?: number, small?: boolean, defaulttext?: string, style?: any,
        selectonclick?: boolean,
        type?: "text" | "number" | "url" | "email" | "tel"): Promise<string>
    function confirmer(title: any, text?: any, oktext?: string, canceltext?: string): Promise<boolean>
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


    window.removefile = async (link: string) => {
        if (!link)
            return
        let filename = link.split("/").at(-1)
        const token = await z.middleuser.tempsecret.generate();
        let lnk = 'https://cdn.ituring.ir/qeupload/' + z.middleuser.uid + "/remove.php/?token=" + token
        let json = await (await fetch(lnk, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ filepath: filename })
        })).text()
    }

    window.closeform = () => {
        setState({ show: null, })
    }

    window.closelog = () => {
        setTimeout(() => {
            setState({ show: null, })
        }, 1000);
    }

    window.closelog = () => {
        setTimeout(() => {
            setState({ show: null, })
        }, 1000);
    }

    window.success = (text: string, fast: boolean = false) => {
        setState({ show: "toast", text, color: "#4CAF50", fast })
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

        const joinBase64 = (buf: Uint8Array) => btoaFn(String.fromCharCode(...buf));

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
        setState({ show: "toast", text, color: "maroon" })
    }

    window.confirmer = (title: string, text: string | Element, oktext: string, canceltext: string): Promise<boolean> => {
        if (text) {
            setState({ show: "confirm", title, text, oktext, canceltext })
        }
        else {
            setState({ show: "confirm", title: null, text: title })
        }

        return new Promise(r => {
            window["confirmresolve"] = (x) => { r(x) }
        })
    }

    window.alerter = (title: string | any, text: string | Element, style?: any, watermark?: string): Promise<void> => {

        if (text) { //multiple arg mode
            setState({ show: "alert", title, text, style, watermark })
        }
        else //single mode
        {
            setState({ show: "alert", title: null, text: title, style: null, watermark: null })
        }

        return new Promise(r => {
            window["alertresolve"] = (x) => { r(x) }
        })
    }


    window.linkpicker = (defaultValue): Promise<string> => {

        setState({ show: "linkpicker", defaultValue })

        return new Promise(r => {
            window["linkpickerresolve"] = (x) => { r(x) }
        })
    }

    window.fileexplorer = (): Promise<string> => {

        setState({ show: "fileexplorer" })

        return new Promise(r => {
            window["fileexresolve"] = (x) => { r(x) }
        })
    }

    window.iconexplorer = (): Promise<string> => {

        setState({ show: "iconexplorer" })

        return new Promise(r => {
            window["iconexresolve"] = (x) => { r(x) }
        })
    }

    window.prompter = (title: string, text: string, maxlen: number = null,
        small: boolean = false, defaulttext: string = "", style?: any, selectonclick: boolean = false,
        type: ("text" | "number" | "url" | "email" | "tel") = "text"): Promise<string> => {
        if (text) {
            setState({ show: "prompt", title, text, maxlen, small, defaulttext, style, selectonclick, type })
        }
        else {
            setState({ show: "prompt", title: null, text: title, maxlen: null, small, defaulttext, selectonclick, type })
        }

        return new Promise(r => {
            window["promptresolve"] = (x) => { r(x) }
        })
    }



    window.picker = (items): Promise<string> => {
        setState({ show: "picker", items })
        return new Promise(r => {
            window["pickerresolve"] = (x) => { r(x) }
        })
    }

    window.selector = (sync, on): Promise<void> => {
        setState({ show: "selector", sync, on })
        return new Promise(r => {
            window["selectorresolve"] = (x) => { r(x) }
        })
    }




    window.uploader = (specs): Promise<string> => {

        localStorage.removeItem("uploader-propmpt-upload")
        setState({ show: "upload", title: specs.title, text: specs.text, maxmb: specs.maxmb, max_age_sec: specs.max_age_sec, style: specs.style })

        return new Promise(r => {
            window["uploadresolve"] = (x) => { r(x) }
        })
    }


    window["logonstop"] = (cb: () => void) => {
        window["loggeronstop"] = () => { cb() };
    }

    window.log = (obj: { text: string, type?: "ok" | "error" | "warning", date?: Date }) => {
        if (state.show != "log") {
            window["loglist"].push(obj)
            window["logger"] = {};
            setState({ show: "log" })
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

    window.login = () => {
        setState({ show: "login" })
    }

    const logchecker = () => {
        setTimeout(() => {
            if (state.show == "log") {
                logchecker();
            }
        }, 1000);
    }

    if (!state.show) {
        return null
    }
    // else if (state.show == "login") {
    //   return <LoginFloat onclose={() => { setState({ show: false }) }} />
    // }
    else if (state.show == "toast") {
        return <Toast message={state.text} color={state.color} fast={state.fast}
            onfinish={() => { setState({ show: false }) }} />
    }
    else if (state.show == "linkpicker") {
        return <LinkPicker defaultValue={state.defaultValue} on={(url) => {
            setState({ show: false, defaultValue: null })
            window["linkpickerresolve"](url)
        }} />
    }
    else if (state.show == "fileexplorer") {
        return <FileExplorer on={(url) => {
            setState({ show: false })
            window["fileexresolve"](url)
        }} />
    }
    else if (state.show == "iconexplorer") {
        return <IconExplorer on={(url) => {
            setState({ show: false })
            window["iconexresolve"](url)
        }} />
    }
    else if (state.show == "prompt") {
        let width = state.style?.width;
        delete state.style?.width
        // let zIndex = state.style?.zIndex
        delete state.style?.zIndex
        return <TextAreaEditFloat title={state.title || z.lang.sysmsg} title2={state.text} maxlen={state.maxlen}
            style={{ ...state.style || {}, direction: z.lang.dir }} width={width} z={99999} selectonclick={state.selectonclick}
            small={state.small} value={state.defaulttext} onclose={() => {
                setState({})
                window["promptresolve"](null)
            }} on={(txt) => { window["promptresolve"](txt); setState({ show: false }) }} />
    }

    else if (state.show == "picker") {
        let width = state.style?.width;
        delete state.style?.width
        // let zIndex = state.style?.zIndex
        delete state.style?.zIndex


        return <WindowFloat
            title={z.lang.choose}
            z={99999}
            style={{ direction: z.lang.dir, ...z.crossstyles?.forms?.style }}
            contentStyle={z.crossstyles?.forms?.contentStyle}
            contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
            titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
            titletextcolor={z.crossstyles?.forms?.titletextcolor}
            wz={z.crossstyles?.forms?.wz}

            onclose={() => {
                setState({})
                window["pickerresolve"](null)
            }}>
            <TextBox defaultValue={state.search} on={txt => {
                clearTimeout(global.cpickerprompt)
                global.cpickerprompt = setTimeout(() => {
                    setState({ ...state, search: txt })
                }, 100);
            }} />
            <br-x />
            <div style={{ maxHeight: 400, overflowX: "scroll" }}>
                {(state.items).filter(st => (!state.search) || (st.title1 || "").includes(state.search) || (st.title2 || "").includes(state.search)).map(st => {


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
                            window["pickerresolve"](st.key); setState({ show: false })
                        }}
                    />
                })}
            </div>
        </WindowFloat>
    }


    else if (state.show == "selector") {
        let width = state.style?.width;
        delete state.style?.width
        // let zIndex = state.style?.zIndex
        delete state.style?.zIndex
        let items = state.sync()

        return <WindowFloat
            title={z.lang.choose}
            z={99999}
            style={{ direction: z.lang.dir, ...z.crossstyles?.forms?.style }}
            contentStyle={z.crossstyles?.forms?.contentStyle}
            contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
            titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
            titletextcolor={z.crossstyles?.forms?.titletextcolor}
            wz={z.crossstyles?.forms?.wz}
            onclose={() => {
                setState({ show: false })
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
                            await state.on(st.key)
                            items = state.sync()
                            setState({ ...state })
                        }}
                    />
                })}
            </div>
        </WindowFloat>
    }



    else if (state.show == "upload") {


        return <WindowFloat
            title={state.title || z.lang.sysmsg}
            maxWidth={z.crossstyles?.forms?.maxWidth ? z.crossstyles?.forms?.maxWidth : 300}
            onclose={() => {
                setState({ show: false }); window["uploadresolve"]?.(null);
            }}
            style={{ direction: z.lang.dir, ...z.crossstyles?.forms?.style }}
            z={99999}
            contentStyle={z.crossstyles?.forms?.contentStyle}
            contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
            titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
            titletextcolor={z.crossstyles?.forms?.titletextcolor}
            wz={z.crossstyles?.forms?.wz}
        >
            <f-12>{state.text}</f-12>
            <br-x />

            {state.percent > 0 ? <br-x /> : <f-cc>
                <Img src={global.cdn("/files/upload2.svg")} style={{ width: 50, height: 50, cursor: "pointer" }} on={() => {
                    uploaders["propmpt-upload"].clear(); uploaders["propmpt-upload"].open()
                }} />
            </f-cc>}
            <br-xx />

            <f-cc class={!state.percent ? z.qestyles.none : z.qestyles.op1}>
                <Upload
                    id={"propmpt-upload"}
                    // extensionfilter={[".jpg", ".png", '.jpeg', '.svg', '.webp']}
                    max_age_sec={state.max_age_sec}
                    maxsize={state.maxmb * 1024 * 1024 || 10 * 1024 * 1024} //10MB!
                    singlefile
                    // hidefileicons
                    onclear={() => setState({ ...state, percent: null, url: null })}
                    on={(url) => {

                        if (url.length > 0) {
                            setState({ ...state, percent: url[0].percent, url: url[0].url })
                        }
                        else {
                            setState({ ...state })
                        }
                    }}
                // id={"himage"}
                />
            </f-cc>
            {state.percent > 0 ? <br-x /> : null}
            <br-x />
            {
                state.percent == 100 && state.url ? <b-200 class={z.qestyles.btnaccept} style={z.crossstyles.forms.button.confirmstyle}
                    onClick={() => { let url = state.url; setState({ show: false }); window["uploadresolve"]?.(url); }}>{z.lang.confirm}</b-200> :
                    <b-100 onClick={() => { uploaders["propmpt-upload"].clear(); uploaders["propmpt-upload"].open() }}
                        class={z.qestyles.btnaccept} style={z.crossstyles.forms.button.confirmstyle}>
                        <sp-2 />
                        <f-12>
                            {z.lang.upload}
                        </f-12>
                    </b-100>
            }
            <br-xx />

        </WindowFloat>
    }
    else if (state.show == "log") {
        return <LogFloat function={window["logger"]} onclose={() => { setState({}) }} z={1000} />
    }
    else if (state.show == "confirm") {
        return <WindowFloat
            title={state.title || z.lang.sysmsg}
            onclose={() => { window["confirmresolve"](false); setState({ show: false }) }}
            maxWidth={z.crossstyles?.forms?.maxWidth ? z.crossstyles?.forms?.maxWidth : 350}
            z={9999}
            style={{ direction: z.lang.dir, ...z.crossstyles?.forms?.style }}
            contentStyle={z.crossstyles?.forms?.contentStyle}
            contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
            titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
            titletextcolor={z.crossstyles?.forms?.titletextcolor}
            wz={z.crossstyles?.forms?.wz}
        >

            {typeof state.text == "string" ? <p>{ReplacePro(state.text, "\n", <br key={"alert_" + uniquekey++} />)}</p> : state.text}
            <br-x />
            <b-200 class={z.qestyles.btnaccept} style={z.crossstyles.forms.button.confirmstyle} onClick={() => { window["confirmresolve"](true); setState({ show: false }) }}>{state.oktext ? state.oktext : z.lang.imsure}</b-200>
            <br-xx />
            <b-200 class={z.qestyles.btncancel} style={z.crossstyles.forms.button.cancelstyle} onClick={() => { window["confirmresolve"](false); setState({ show: false }) }}>{state.canceltext ? state.canceltext : z.lang.cancel}</b-200>
        </WindowFloat>
    }
    else if (state.show == "alert") {
        let direction = z.lang.dir
        if (z.lang.code == "fa" && FAtoENRatio(state.text.toString()) < 0.2) {
            direction = "ltr"
        }

        let textType: "string" | "object" | "element" = "string"
        if (React.isValidElement(state.text))
            textType = "element"
        else if (typeof state.text == "string")
            textType = "string"
        else
            textType = "object"

        let textToShow = state.text
        if (textType == "object" || (textType == "string" && (state.text.startsWith("[") || state.text.startsWith("{")))) {
            textToShow = <pre style={{ fontSize: 11, direction: "ltr", maxHeight: "70vh", overflowY: "scroll" }}>
                {JSON.stringify(state.text, null, 2)}
            </pre>
        }

        return <WindowFloat
            title={state.title || z.lang.sysmsg}
            style={{ direction, ...z.crossstyles?.forms?.style }}
            onclose={() => { window["alertresolve"]?.(); setState({ show: false }) }}
            maxWidth={z.crossstyles?.forms?.maxWidth ? z.crossstyles?.forms?.maxWidth : (textType == "object" ? "calc(min(100vw,650px))" : 400)}
            z={10000}
            contentStyle={z.crossstyles?.forms?.contentStyle}
            contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
            titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
            titletextcolor={z.crossstyles?.forms?.titletextcolor}
            wz={z.crossstyles?.forms?.wz}
        >

            <f-cc style={{ position: "relative", }}>

                {state.watermark ? <img style={{
                    position: "absolute", left: "50%", transform: "translateX(-50%)",
                    objectFit: "fill", top: 0, height: "70%", opacity: 0.1
                }} src={state.watermark} /> : null}

                <div style={{ zIndex: 200, width: "100%" }}>
                    {typeof state.text == "string" ?
                        <p style={{ ...state.style, zIndex: 452, }}>
                            {ReplacePro(textToShow, "\n", <br key={"alert_" + uniquekey++} />)}
                        </p>
                        :
                        <div style={{ minHeight: state.watermark ? 100 : null }}>{textToShow}</div>
                    }
                    <br-x />
                    <br-xx />
                    <b-200 class={z.qestyles.btnaccept}
                        style={z.crossstyles.forms.button.confirmstyle}
                        onClick={() => { window["alertresolve"]?.(); setState({ show: false }) }}>{z.lang.confirm}
                    </b-200>
                </div>



            </f-cc>
        </WindowFloat>
    }



}