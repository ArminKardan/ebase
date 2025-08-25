import { CSSProperties } from 'react'
import Bold from './Bold'
import { SSRGlobal } from './Context'
import Img from './Img'

export default (props: {
  title1?: any, title2?: any, title3?: any, price1?: any, unbold?: boolean, nobold?: boolean,
  icon?: any, image?: any, bgtransparent?: boolean, mb?: number, style?: CSSProperties,
  on?: () => void, onclose?: () => void, special?: any, specialcolor?: string, specialtextcolor?: string, image2?: string,
  roundicon?: boolean, unit1?: any, righticon?: any, lineHeight?: string | number,

}) => {
  let z = SSRGlobal()
  var alt = "icon"
  if (props.title1) {
    alt = typeof props.title1 == "string" ? (props.title1.toLowerCase() + "'s icon") : "object's icon"
  }
  else if (props.price1) {
    alt = "price " + props.price1 + "'s icon"
  }

  let unbold = props.nobold || props.unbold;

  let title1 = null
  let title2 = null
  let title3 = null

  if (typeof props.title1 == "string") {
    title1 = <h1>{unbold ? props.title1 : <Bold>{props.title1}</Bold>}</h1>
    // title1 = <f-13>{unbold ? props.title1 : <Bold>{props.title1}</Bold>}</f-13>
  }
  else {
    title1 = props.title1
  }

  if (typeof props.title2 == "string") {
    title2 = <h2>{props.title2}</h2>
  }
  else {
    title2 = props.title2
  }

  if (typeof props.title3 == "string") {
    title3 = <h3>{props.title3}</h3>
  }
  else {
    title3 = props.title3
  }


  let icon = props.icon || props.image


  return <f-csb class={props.bgtransparent ? z.qestyles.ic3t : z.qestyles.ic3} 
  onClick={() => { props.on?.() }}
    style={{ marginBottom: props.mb, width: "100%", minHeight:70, ...props.style}} >

    <f-c style={{ width: "100%" }} >

      <c-cc style={{position:"relative"}}>
        {props.image2 ? <f-c style={{ position: "absolute", bottom: 0, left: 32, borderRadius: 3, padding: "2px 2px" }}>
          <Img src={global.cdn(props.image2)} style={{ width: 18, height: 18}} />
        </f-c> : null}
        {typeof icon == "string" ? <Img src={global.cdn(icon)} style={{
          borderRadius: props.roundicon ? "50%" : 5,
          backgroundSize:"cover" , height:50, width:50,
          minWidth: 50, minHeight: 50,maxWidth: 50, maxHeight: 50,
        }} /> : icon}
        {props.special ? <div className={z.qestyles["ic3-sp"]} style={{ backgroundColor: props.specialcolor, color: props.specialtextcolor, zIndex:1 }}>
          <Bold>{props.special}</Bold></div> : null}
      </c-cc>
      <sp-4 />
      <sp-3 />

      <c-xsb style={{ margin: props.unit1 ? "2px 0" : null, minHeight: 55, width: "100%", }}>
        {!props.unit1 && props.title1 ? title1 : null}

        {props.unit1 != undefined ? <h1><Bold>
          <span style={{ fontSize: 14, lineHeight: props.lineHeight || 0, }}>
            <span>{props.title1 == "0" ? "0.00" : props.title1}</span>
            &nbsp;{props.unit1}</span></Bold></h1> : null}

        {props.unit1 ? <f-10>{props.title2}</f-10> : null}
        {!props.unit1 && props.title2 ? <f-12 style={{marginTop:3,}}>{title2}</f-12> : null}
        {props.title3 ?  <f-11 style={{marginTop:2}}>{title3}</f-11> : null}
      </c-xsb>

      

    </f-c>
    {props.righticon || props.onclose ? <f-cse style={{
      borderTopRightRadius: 5, borderBottomRightRadius: 5,
      paddingLeft: z.lang.dir == "rtl" ? 20 : null,
      paddingRight: z.lang.dir == "ltr" ? 20 : null,
      height: 40
    }} >
      {props.righticon}

      {props.onclose ? <Img className={z.qestyles.menubtn} src={global.cdn("/files/close.svg")} style={{ width: 20, height: 20 }}
        on={() => { props.onclose?.() }} /> : null}
    </f-cse> : null}

  </f-csb>
}