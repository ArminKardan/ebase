import DatePicker, { DatePickerRef } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import gregorian from "react-date-object/calendars/gregorian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian_en from "react-date-object/locales/gregorian_fa"

import qestyles from '@/styles/qe.module.css'

import { useEffect, useRef } from "react";
import { SSRGlobal } from "./Context";
// import styles from '../../Home.module.css'

declare global {
    function calendarfa():Promise<Date>
}

export default (props) => {

    const z = SSRGlobal()

    const datepickerRef = useRef<DatePickerRef>(null);
    global.calendarfa = async (): Promise<Date | null> => {
        (document.getElementById("calendarbgfa") as any).className = z.qestyles.blackblurybg;
        datepickerRef.current?.openCalendar();
        let isostring = await new Promise(r => {
            global.dateresolve = (isostring) => r(isostring)
        }) as any
        datepickerRef.current?.closeCalendar();
        (document.getElementById("calendarbgfa") as any).className = z.qestyles.none;

        return isostring
    }

    return <>
        <div id="calendarbgfa" 
        className={z.qestyles.none}
            style={{ zIndex: 10000}}
            onMouseDown={() => {
                (document.getElementById("calendarbgfa") as any).className = z.qestyles.blackblurybg;
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
                calendar={persian}
                locale={persian_fa}
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