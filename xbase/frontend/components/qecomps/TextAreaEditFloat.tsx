import TextArea from './TextArea';
import WindowFloat from './WindowFloat'
import Bold from './Bold';
import { CSSProperties } from 'react';
import { SSRGlobal } from './Context';

export default (props: {
  value?: string,
  defaultValue?: string,
  body?: string,
  maxlen?: number,
  title?: string,
  onclose?: () => void,
  width?: number | string,
  maxWidth?: number | string,
  title2?: any,
  small?: boolean,
  z?: number,
  style?: CSSProperties,
  onchange?: (string) => void,
  selectonclick?: boolean,
  on?: (string) => void,
  onrighticon?: () => void,
  onlefticon?: () => void,
  explain?: string,
}) => {

  let z = SSRGlobal()
  var value = ""
  if (props.value) {
    value = props.value.toString();
  }
  if (props.defaultValue) {
    value = props.defaultValue.toString();
  }
  if (props.body) {
    value = props.body.toString();
  }
  var txt = value.toString();
  let charsleft = (props.maxlen || 1000) - (value || "").length
  return <WindowFloat
    title={props.title}
    onclose={() => { props.onclose ? props.onclose() : null }}
    maxWidth={props.maxWidth || props.width}
    z={props.z}
    style={{ direction: z.lang.dir, ...z.crossstyles?.forms?.style }}
    contentStyle={z.crossstyles?.forms?.contentStyle}
    contentbgcolor={z.crossstyles?.forms?.contentbgcolor}
    titlebgcolor={z.crossstyles?.forms?.titlebgcolor}
    titletextcolor={z.crossstyles?.forms?.titletextcolor}
    wz={z.crossstyles?.forms?.wz}


  >

    <TextArea title={props.title2} defaultValue={value} style={props.style} selectonclick={props.selectonclick}
      minHeight={props.small ? 0 : "12rem"} on={(t) => {
        txt = t; props.onchange?.(txt);
        if (props.small && txt.endsWith('\n')) {
          props.on(txt.trim())
        }
        charsleft = (props.maxlen || 1000) - txt.length
        let el = document.getElementById("txtareafloatchleft")
        el.innerHTML = z.lang.xxcharsleft.replace(/XX/, (charsleft).toLocaleString(z.lang.region))
        el.style.color = charsleft > 0 ? "darkgreen" : "maroon"
      }}
    // onrighticon={() => props.onrighticon?.()}
    // onlefticon={() => props.onlefticon?.()}
    />
    <br-x/>
    <f-c style={{ margin: "-3px 3px 0 3px", color: charsleft > 0 ? "darkgreen" : "maroon" }}>
      <f-11 id="txtareafloatchleft">{z.lang.xxcharsleft.replace(/XX/,
        ((props.maxlen || 1000) - (value || "").length).toLocaleString(z.lang.region))}</f-11>
    </f-c>
    <br-xx />
    <span style={{ fontSize: 11 }}>{props.explain}</span>

    <div style={{ textAlign: "center", marginTop: 5, display: "flex", justifyContent: "center" }}>
      <b-200 class={z.styles.btnaccept} style={z.crossstyles.forms.button.confirmstyle} onClick={() => {
        if (charsleft > 0) {
          props.on(txt)
        }

      }} ><Bold>{z.lang.done}</Bold></b-200> &nbsp;
    </div>
  </WindowFloat>
}