'use client';
import { useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
import VItem from './VItem';
export default (props: { defaultValue?: string, on: (url: string) => void }) => {
  return (
    <WindowFloat title="انتخاب لینک"
      z={9999}
      onclose={() => { props.on(null) }}>
      <f-cse>

        <VItem image={cdn("/files/myfiles.png")}
          text='فایل‌های من' on={async () => {
            let url = await fileexplorer()
            if (url != null) {
              props.on?.(url)
            }
            else {
              let url = await linkpicker(props.defaultValue)
              if (url != null) {
                props.on?.(url)
              }
            }
          }} />
        <VItem image={cdn("/files/icons.png")} text='آیکون‌ها'
          on={async () => {
            let url = await iconexplorer()
            if (url != null) {
              props.on?.(url)
            }
            else {
              let url = await linkpicker(props.defaultValue)
              if (url != null) {
                props.on?.(url)
              }
            }
          }}  />
        <VItem image={cdn("/files/link.png")} text='لینک' on={async () => {
          let link = await prompter("ورود لینک",
            "لینک مورد نظر را وارد کنید؟", 1000, false, props.defaultValue);
          if (link != null) {
            props.on?.(link)
          }
          else {
            let url = await linkpicker(props.defaultValue)
            if (url != null) {
              props.on?.(url)
            }
          }
        }} />

      </f-cse>
    </WindowFloat>
  );
};
