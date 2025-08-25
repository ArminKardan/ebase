import { setCookie } from "cookies-next";
import Captcha from "../qecomps/Captcha";
import Component, { PageEl } from "../qecomps/Component";
import SerialGenerator from "../qecomps/SerialGenerator";
import TextBox from "../qecomps/TextBox";
import WindowFloat from "../qecomps/WindowFloat";
import { useEffect } from "react";

export default p => Component(p, Page);

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};


const Page: PageEl = (props, refresh, getProps, onLoad, onConnected, dies, isFront, z) => {

    getProps(async (isFront) => {
        if (isFront) {
            props.uuid = SerialGenerator(10)
        }
    })

    onLoad(async ()=>{
        console.log("loaded")
        props.phase = "enteremail";
        refresh()
    })

    return <WindowFloat title="ورود با ایمیل" onclose={() => { props.onclose?.() }}>

        {props.phase == 'enteremail' ? <>
            <TextBox dir="ltr" type="number" title={z.lang.plzenturemail}
                tight={props} tightkey='email'
                placeholder="example@host.domain" defaultValue={props.email} on={(e) => { props.email = e }} />

            <Captcha title={z.lang.hmverfy} uuid={props.uuid} on={(e) => { props.captcha = e }} reload={() => { props.uuid = SerialGenerator(10); refresh() }} />

            {props.error ? <span style={{ fontSize: 10, color: "maroon" }}>{z.lang[props.error]}</span> : null}

            <br-x />
            <br-x />

            <b-200 class={z.qestyles.btnaccept} style={{
                backgroundColor: "#ACD2A1", borderWidth: 0,
                height: 34,
                ...z.crossstyles.forms.button.confirmstyle
            }} onClick={async () => {
                if (!validateEmail(props.email || "")) {
                    alerter("لطفا ایمیل را به درستی وارد کنید.");
                    return
                }

                let obj = {
                    email: props.email,
                    lang: z.lang.code,
                    uuid: props.uuid,
                    captcha: props.captcha,
                }
                let json = await api("https://qepal.com/api/xuser/loginbyemail", obj)

                if (json.code == 0) {
                    props.uuid = SerialGenerator(10)
                    props.phase = 'emailverify'
                    props.error = (null)
                    refresh()
                }
                else {
                    alerter(JSON.stringify(json))
                }
            }}>

                {z.lang.confirm}
            </b-200><br-x />
        </> : null}

        {props.phase == 'emailverify' ? <>
            <TextBox title={z.lang.entercode} placeholder="xxxxx" type="number" defaultValue={props.vcode} on={(e) => { props.vcode = e }} />
            <Captcha title="" uuid={props.uuid} on={(e) => { props.captcha = (e); refresh() }} reload={() => { props.uuid = SerialGenerator(10); refresh() }} />
            {props.error ? <span style={{ fontSize: 10, color: "maroon" }}>{z.lang[props.error]}</span> : null}

            <br-x />
            <b-200 class={z.qestyles.btnaccept} style={z.crossstyles.forms.button.confirmstyle} onClick={async () => {
                if ((props.vcode || "").length != 5) {
                    alerter(z.lang.wrongcode);
                    return
                }

                let json = await api("/api/session/verifyemailcode", {
                    email: props.email,
                    code: props.vcode,
                    uuid: props.uuid,
                    origin: window.location.origin,
                    captcha: props.captcha,
                    lang: z.lang.code
                })


                if (json.code == 0) {
                    setCookie('session-token', json.token, { maxAge: 30 * 86400, sameSite:"none", secure:true});
                    success("ورود موفق بود")
                    window.location.reload();
                    props.error = (null)
                }
                else if (json.code == -2) {
                    props.error = ("wrongcaptcha")
                    refresh()
                    return;
                }
                else if (json.code == -10) {
                    alerter(z.lang.expiredcode);
                    return;
                }
                else {
                    alerter(JSON.stringify(json));
                    return;
                }



            }}>
                {z.lang.confirm}
            </b-200><br-x />
            {/* <f-cc><h5 onClick={() => {
    props.phase = (null)
  }}><a>{z.lang.backtopreviouspage}</a></h5></f-cc>
  <br-x /> */}
        </> : null}

    </WindowFloat>
}