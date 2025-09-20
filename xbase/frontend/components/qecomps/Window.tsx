import { CSSProperties } from "react"
import { SSRGlobal } from "./Context"

export default (props?: {
  title?: string,
  contentbgcolor?: string,
  titlebgcolor?: string,
  titlecolor?: string,
  children?: any,
  contentStyle?: CSSProperties,
  style?: CSSProperties,
}) => {
  let z = SSRGlobal();
  return <>
    <c-x className={z.qestyles.bg1} style={{
      width: "100%",
      paddingBottom: 5, marginBottom: 0, backgroundColor: props.contentbgcolor,
      borderRadius: "0.5rem ", fontSize: 13, zIndex: 100, boxShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.5)",
      ...(props.style)
    }}>
      {props.title ? <f-cc className={z.qestyles.window_title_bg + " " + z.qestyles.title} style={{
        height: 25, backgroundColor: props.titlebgcolor,
        borderRadius: "0.5rem 0.5rem 0 0",
      }}>
        <f-12 style={{ color: props.titlecolor }}>{props.title}</f-12>
      </f-cc> : null}

      <div style={{ ...(props.contentStyle) }}>{props.children}</div>

    </c-x>
  </>

}