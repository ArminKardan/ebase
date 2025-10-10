import DatePicker, { DatePickerRef } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import gregorian from "react-date-object/calendars/gregorian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian_en from "react-date-object/locales/gregorian_fa"

import { useEffect, useRef } from "react";
import { SSRGlobal } from "./Context";
import CalendarFA from "./CalendarFA";
import CalendarEN from "./CalendarEN";
// import styles from '../../Home.module.css'

declare global {
     function calendar():Promise<Date>
}

export default (props) => {
    const z = SSRGlobal()

    useEffect(() => {
        global.calendar = async () => {
            if (z.lang.code == "fa") {
                return await global.calendarfa()
            }
            return await global.calendaren()
        }
    }, [])
    if (z.lang.code == "fa") {
        return <CalendarFA />
    }
    return <CalendarEN />

}