import { CSSProperties } from "react";
import { SSRGlobal } from "./Context";

export default (props:
  {
    icon: string,
    text?: string,
    title?: string,
    on?: (e: MouseEvent) => any,
    onright?: (e: MouseEvent) => any,
    style?: CSSProperties,
    iconStyle?: CSSProperties,
    textStyle?: CSSProperties,
    className?: any,
    iconClassName?: any,
    textClassName?: any,
  }) => {
  const z = SSRGlobal();
  return <c-cc class={z.qestyles.ico + " w-24 h-[70px] rounded-[5px] p-3 pb-4 cursor-pointer "
    + props.className || ""}
    onClick={(e) => { props.on?.(e as any) }}
    onContextMenu={(e) => { e.preventDefault(); props.onright?.(e as any) }} style={{ ...props.style }}>
    <f-cc className={z.qestyles.title + " py-6 min-w-[32px] min-h-[32px] " + props.icon + " " + props.iconClassName || ""} style={{ ...props.iconStyle }} />
    {props.text || props.title ? <f-9 class={z.qestyles.icotxt + " " + z.qestyles.title} style={{ ...props.textStyle }}>{props.title || props.text}</f-9> : null}
    <br-xx />
  </c-cc>

}