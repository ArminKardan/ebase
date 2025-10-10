import { CSSProperties, useEffect } from "react"
import { SSRGlobal } from "./Context"

export default (props: {
    id?: string, onTouchStart?: (e) => void,
    onMouseDown?: (e) => void, src?: string, style?: CSSProperties, on?: (e) => void, className?: string
}) => {

    if (props.style && props.style.height && !props.style.width)
        props.style.width = props.style.height
    if (props.style && props.style.width && !props.style.height)
        props.style.height = props.style.width

    if (props.id) {
        return <f-cc style={{ padding: 2 }}><f-cc
            id={props.id}
            onMouseDown={e => { props.onMouseDown?.(e) }}
            onTouchStart={e => { props.onTouchStart?.(e) }}
            className={props.className}
            style={{
                backgroundImage: `url('${props.src || cdn("/files/plus.svg")}')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: 13, height: 14, ...props.style
            }}
            onClick={(e) => props.on?.(e)} /></f-cc>
    }
    return <f-cc
        className={props.className}
        onMouseDown={e => { props.onMouseDown?.(e) }}
        onTouchStart={e => { props.onTouchStart?.(e) }}
        style={{
            backgroundImage: `url('${props.src || cdn("/files/plus.svg")}')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            width: 13, height: 14, ...props.style
        }}
        onClick={(e) => props.on?.(e)} />
}