import DatePicker, { DatePickerRef } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import gregorian from "react-date-object/calendars/gregorian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian_en from "react-date-object/locales/gregorian_en"
import gregorian_fa from "react-date-object/locales/gregorian_fa"

import { useEffect, useRef } from "react";
import { SSRGlobal } from "./Context";
// import styles from '../../Home.module.css'

declare global {
    function calendaren():Promise<Date>
}

export default (props) => {

    const z = SSRGlobal()

    let locale = gregorian_en
    if(z.lang.code == "fa")
    {
        locale = gregorian_fa
    }

    const datepickerRef = useRef<DatePickerRef>(null);
    global.calendaren = async (): Promise<Date | null> => {
        (document.getElementById("calendarbgen") as any).className = z.styles.blackblurybg;
        datepickerRef.current?.openCalendar();
        let isostring = await new Promise(r => {
            global.dateresolve = (isostring) => r(isostring)
        }) as any
        datepickerRef.current?.closeCalendar();
        (document.getElementById("calendarbgen") as any).className = z.qestyles.none;

        return isostring
    }

    return <>
        <div id="calendarbgen" className={z.qestyles.none}
            style={{ zIndex: 10000, }}
            onMouseDown={() => {
                (document.getElementById("calendarbgen") as any).className = z.qestyles.blackblurybg;
                global.dateresolve(null)
            }}></div>
        <f-cc style={{
            position: "fixed", left: "calc(50vw - 110px)",
            top: "calc(50vh - 170px)", zIndex: 10001, fontFamily: "vr"
        }}>
            <DatePicker
                ref={datepickerRef}

                style={{
                    fontFamily: "vr", borderRadius: 2, fontSize: 15,
                    height: 30, display: "none", zIndex: 10002
                }}
                calendar={gregorian}
                locale={locale}
                value={new Date()}
                arrow={false}
                onChange={(e) => {
                    if (!e) return;
                    global.dateresolve(new Date(e.valueOf()))

                    // setState({ ...state, birthdaynumber: e.valueOf() as number, birthday: e.toString() })
                }} />
        </f-cc>

    </>

}