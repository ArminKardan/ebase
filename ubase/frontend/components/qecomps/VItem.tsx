import { CSSProperties } from "react";
import { SSRGlobal } from "./Context";
import Img from "./Img";

export default (props: {
  icon?: string,
  image?: string,
  image2?: string,
  title?: any,
  text?: string,
  value?: string,
  icon2?: string,
  selected?: boolean, style?: CSSProperties,
  pt?: number,
  h?: number,
  w?: number,
  s?: number,
  s2?: number,
  on?: () => void,
  bold?: boolean,
  ml?: number,
  txtmt?: number,
  imgstyle?: CSSProperties,
}) => {
  let z = SSRGlobal()
  var image = props.icon || props.image;
  var image2 = props.icon2 || props.image2;
  var title = props.title || props.text || props.value;
  return <c-cc class={z.qestyles.imgtxtitem + " " + z.qestyles.hover}
    style={{
      position: "relative",
      backgroundColor: props.selected ? "#d1af85" : null, width:props.style?.transform?80:100,
      ...props.style, paddingTop: props.pt || (props.h ? (50 - props.h) : null),
      //  paddingTop:props.h?(50 - props.h):null 
    }} onClick={() => props.on?.()}>
    <f-cc style={{position:"relative"}}>

      {image2 ? <Img src={image2}
        style={{
          position: "absolute",
          minHeight: props.s2 || 30,
          maxHeight: props.s2 || 30,
          minWidth: props.s2 || 30,
          maxWidth: props.s2 || 30,
          marginLeft: z.lang.dir == "ltr" ? -15 : 0,
          marginRight: z.lang.dir == "rtl" ? -50 : 0,
          bottom:0,
          zoom:props.style?.zoom || props.imgstyle?.zoom,
        }} /> : null}

      <Img src={image}
        style={{ height: props.s || props.h || 50, width: props.s || props.w || 50, borderRadius: 5,...props.imgstyle}} />

    </f-cc>
    <br-xxx />
    {typeof title == "string" ? <f-11 style={{
      fontWeight: props.bold ? 600 : 0, marginLeft: props.ml,
      textAlign: "center", marginTop: props.txtmt
    }}>
      {title}</f-11> : title}

  </c-cc>

}