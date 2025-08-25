import { CSSProperties, useEffect, useRef } from 'react'
import Bold from './Bold'
import { SSRGlobal } from './Context'
export default (props: {
    bold?: boolean,
    title?: string,
    tight?: any,
    tightkey?: string,
    defaultValue?: string,
    placeholder?: string,
    readonly?: boolean,
    readOnly?: boolean,
    minHeight?: number | string,
    style?: CSSProperties
    on?: (string) => void,
    selectonclick?: boolean,
}) => {
    let z = SSRGlobal()
    var uniqekey = Math.random() * 100
    let ref = useRef(null)
    let defaultValue = null;

    if (typeof props.defaultValue != "undefined") {
        defaultValue = props.defaultValue
    }

    if (props.tight && props.tightkey) {
        useEffect(() => {
            let c = setInterval(() => {
                if (ref.current && props.tight[props.tightkey] != ref.current.value) {
                    ref.current.value = props.tight[props.tightkey] || ""
                }
            }, 100);
            return () => {
                clearInterval(c)
            }
        }, [])
    }

    useEffect(() => {
        if (typeof window != "undefined") {
            if (ref.current) {
                ref.current.value = defaultValue
            }
        }
    });

    return <div style={{ width: "100%" }}>
        <div style={{ fontSize: 12, }}>{props.bold ? <Bold>{props.title}</Bold> : props.title}</div>
        <textarea dir="auto" key={uniqekey++} defaultValue={props.defaultValue} spellCheck={false} placeholder={props.placeholder}
            ref={ref}
            rows={1}
            readOnly={props.readonly || props.readOnly}
            style={{
                width: "100%", minHeight: (typeof props.minHeight == "undefined" ? "8rem" : props.minHeight), marginTop: 4,
                resize: "none", padding: "6px 5px 5px 5px",
                borderRadius: 2,
                fontFamily: "inherit", direction: z.lang.dir as any, ...props.style
            }}
            onChange={(e) => {
                props.on?.(e.target.value);
                if (props.tight && props.tightkey) {
                    props.tight[props.tightkey] = e.target.value
                }
            }}
            onClick={(e) => {
                setTimeout(() => { e.target.scrollIntoView({ behavior: 'smooth', block: "center" }); }, 300);
                if (props.selectonclick) {
                    e.target.select();
                }
            }} /></div>
}