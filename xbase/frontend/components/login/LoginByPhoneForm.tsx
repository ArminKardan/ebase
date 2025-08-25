import { setCookie } from "cookies-next";
import Captcha from "../qecomps/Captcha";
import Component, { PageEl } from "../qecomps/Component";
import SerialGenerator from "../qecomps/SerialGenerator";
import TextBox from "../qecomps/TextBox";
import WindowFloat from "../qecomps/WindowFloat";

export default p => Component(p, Page);

const Page: PageEl = (props, refresh, getProps, onLoad, onConnected, dies, isFront, z) => {

    getProps(async (isFront) => {
        if (isFront) {
            props.uuid = SerialGenerator(10)
            props.phase = "enterphone"
        }
    })

    return <WindowFloat title="ورود" onclose={()=>{props.onclose?.()}}>

        {props.phase == 'enterphone' ? <>
            <TextBox dir="ltr" type="number" title={"لطفا شماره همراه خود را وارد کنید:"}
                tight={props} tightkey='phone'
                placeholder="091xxxxxxxx" defaultValue={props.phone} on={(e) => { props.phone = e }} />

            <Captcha title={z.lang.hmverfy} uuid={props.uuid} on={(e) => { props.captcha = e }} reload={() => { props.uuid = SerialGenerator(10); refresh() }} />

            {props.error ? <span style={{ fontSize: 10, color: "maroon" }}>{z.lang[props.error]}</span> : null}

            <br-x />
            <br-x />

            <b-200 class={z.qestyles.btnaccept} style={{
                backgroundColor: "#ACD2A1", borderWidth: 0,
                height: 34,
                ...z.crossstyles.forms.button.confirmstyle
            }} onClick={async () => {
                if ((props.phone || "").length != 11) {
                    alerter("لطفا شماره تماس را به درستی وارد کنید.");
                    return
                }
                if (!(props.phone.startsWith("09"))) {
                    alerter("شماره تماس وارد شده صحیح نیست.")
                    return;
                }

                let obj = {
                    phone: props.phone,
                    lang: z.lang.code,
                    uuid: props.uuid,
                    captcha: props.captcha,
                }
                await alerter(obj)
                let json = await api("https://qepal.com/api/xuser/loginbyphone", obj)


                if (json.code == 0) {
                    props.uuid = SerialGenerator(10)
                    props.phase = ('phoneverify')
                    props.error = (null)
                    refresh()
                }
                else if (json.code == -2) {
                    props.error = ('wrongcaptcha')
                    refresh()
                }
                else {
                    alerter(JSON.stringify(json))
                }
            }}>

                {z.lang.confirm}
            </b-200><br-x />
        </> : null}

        {props.phase == 'phoneverify' ? <>
            <TextBox title={z.lang.entercode} placeholder="xxxxx" type="number" defaultValue={props.vcode} on={(e) => { props.vcode = e }} />
            <Captcha title="" uuid={props.uuid} on={(e) => { props.captcha = (e); refresh() }} reload={() => { props.uuid = SerialGenerator(10); refresh() }} />
            {props.error ? <span style={{ fontSize: 10, color: "maroon" }}>{z.lang[props.error]}</span> : null}

            <br-x />
            <b-200 class={z.qestyles.btnaccept} style={z.crossstyles.forms.button.confirmstyle} onClick={async () => {
                if ((props.vcode || "").length != 5) {
                    alerter(z.lang.wrongcode);
                    return
                }

                let json = await api("/api/session/verifyphonecode", {
                    phone: props.phone,
                    code: props.vcode,
                    uuid: props.uuid,
                    origin: window.location.origin,
                    captcha: props.captcha,
                    lang: z.lang.code
                })


                if (json.code == 0) {
                    setCookie('session-token', json.token, { maxAge: 30 * 86400,sameSite:"none", secure:true });
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