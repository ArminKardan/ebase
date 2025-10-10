import { CSSProperties, useEffect } from "react"
import Img from "./Img"
import Component, { PageEl } from "./Component";
import { motion } from "framer-motion";

export type WindowFloatModalPropsType = {
  z?: number,
  zplus?: number,
  onclose?: () => void,
  darkness?: number,
  maxWidth?: number | string,
  padding?: number | string,
  wz?: number,
  titlebgcolor?: string,
  titletextcolor?: string,
  title?: string,
  children?: any,
  onhelp?: () => void,
  onsettings?: () => any,
  style?: CSSProperties,
  watermarkimg?: string,
  id?: string,
  maximizeHeight?: boolean,
  contentbgcolor?: string,
  contentStyle?: CSSProperties,
  className?: string,
  _refer?:any,
  smooth?:boolean
}

export default (p: WindowFloatModalPropsType) => Component(p, Page);
const Page: PageEl = (props: WindowFloatModalPropsType & { [key: string]: any },
  refresh, getProps, onLoad, onConnected, dies, isFront, z): React.JSX.Element => {


  let hash = props.id || MD5(props.title + props.children.innerText)

    if (props._refer) {
    props._refer.close = function close() {
        document.getElementById(hash)?.classList.remove("opacity-100");
        document.getElementById(hash)?.classList.add("opacity-0");
        document.getElementById(hash)?.classList.remove("scale-100");
        document.getElementById(hash)?.classList.add("scale-50");
        document.getElementById(hash + "-gray")?.classList.remove("opacity-100");
        document.getElementById(hash + "-gray")?.classList.add("opacity-0");
        document.getElementById(hash)?.classList.remove("modal-open");
    }
  }

  useEffect(() => {
    // if (!document.getElementById(hash).classList.contains("modal-open"))
    setTimeout(() => {
      document.getElementById(hash)?.classList.remove("opacity-0");
      document.getElementById(hash)?.classList.add("opacity-100");

      document.getElementById(hash)?.classList.remove("scale-50");
      document.getElementById(hash)?.classList.add("scale-100");

      document.getElementById(hash + "-gray")?.classList.remove("opacity-0");
      document.getElementById(hash + "-gray")?.classList.add("opacity-100");

    }, 20);


  }, [])


  return <>

    <div id={hash} 
    className={z.qestyles.dialogmodal + " p-0 scale-50 opacity-0 "+ "transition-all duration-500" + " " + props.className}
      style={{
        width: "95vw",
        maxWidth: props["maxw"] || props.maxWidth || "26rem",
        minHeight: props["minh"],
        zIndex: props.wz || (props.z ? props.z + 1 : (251 + (props.zplus || 0))), ...(props.style),
      }}>
        
      <motion.div className={z.qestyles.dialogmodalcontent} layout transition={{ duration: 0.1 }}  style={{
        direction: z.lang.dir,
        minHeight: props["minh"] ? `calc(${props["minh"]} - 30px)` : null,
        ...(props.contentStyle)
      }}>
        {props.children}

        {props.watermarkimg ? <f-cc style={{
          position: "absolute", width: "100%", height: "100%", zIndex: -1,
          opacity: 0.2, top: 0, left: 0,
        }}>
          <Img src={global.cdn(props.watermarkimg)} style={{ height: "60%", maxHeight: 200, marginTop: -30 }} />
        </f-cc> : null}
      </motion.div>
    </div>


    {props.style?.visibility != "hidden" ? <div className={z.qestyles.blackblurybg + " opacity-0 transition-all duration-500"} id={hash + "-gray"}
      style={{ zIndex: props.z || (250 + (props.zplus || 0)), opacity: props.darkness }}
      onMouseDown={() => {
        setTimeout(() => {
          props.onclose?.()
        }, 400);
        document.getElementById(hash)?.classList.remove("opacity-100");
        document.getElementById(hash)?.classList.add("opacity-0");
        document.getElementById(hash)?.classList.remove("scale-100");
        document.getElementById(hash)?.classList.add("scale-50");
        document.getElementById(hash + "-gray")?.classList.remove("opacity-100");
        document.getElementById(hash + "-gray")?.classList.add("opacity-0");
        document.getElementById(hash)?.classList.remove("modal-open");
      }}></div> : null}
  </>

}