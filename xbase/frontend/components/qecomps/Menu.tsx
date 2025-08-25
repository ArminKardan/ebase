import { useEffect, useState } from "react"

export default (props: { options: any, children: any }) => {

    let [state, setState] = useState(false)
    useEffect(() => {
        let f = () => {
            setState(true)
        }
        document.addEventListener("click", f)
        return () => {
            document.removeEventListener("click", f)
        }
    })

    return <><div className="dropdown dropdown-start">
        <div tabIndex={0} role="button" className="btn m-1  font-normal" style={{ fontWeight: 100 }} >دراپ داون ⬇️</div>
        {state ? <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            {(props.options || []).map(el => {
                return <li onClick={async () => {
                    setTimeout(() => {
                        setState(false)
                    }, 100);
                }}><a>{el}</a></li>
            })}
        </ul> : null}
    </div>
    </>

}