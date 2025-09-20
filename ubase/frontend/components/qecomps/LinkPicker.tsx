'use client';
import { useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
import { SSRGlobal } from './Context';
import TextBox from './TextBox';
import Copy from './Copy';
import Ico from './Ico';
export default (props: { defaultValue?: string, on: (url: string) => void }) => {
  const z = SSRGlobal()

  return (
    <WindowFloat title="انتخاب آیکون و فایل" onclose={() => { props.on(null) }}>
      <f-cse>

        <Ico icon="icon-[twemoji--file-folder] w-[37px] h-[37px]" text="فایل های من" on={async () => {
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


        <Ico icon="icon-[flat-color-icons--gallery] w-[40px] h-[40px]" text="آیکون تصویری" on={async () => {
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
        }} />


        <Ico icon="icon-[solar--notes-minimalistic-linear] w-[40px] h-[40px]" text="آیکون مینیمال" on={async () => {
          document.body.style.overflowY = "hidden"
          await customer((props, refresh, resolve) => {

            const update = async (query) => {
              if (!props.icons) {
                log({ text: "درحال دریافت..." })
                let json = await API["minicons"]({ query })
                if (json.code == 0) {
                  global.icon_icons = json.icons
                  global.icon_query = json.query
                  props.query = json.query
                  closelog()
                  if ((global.icon_icons || []).length > 50)
                    props.maxwidth = "95vw";
                  else
                    delete props.maxwidth
                  refresh()
                }
              }
            }
            if (!global.icon_icons) {
              update("bluetooth");
            }

            if ((global.icon_icons || []).length > 50)
              props.maxwidth = "95vw";
            else
              delete props.maxwidth

            return <WindowFloat title="انتخاب آیکون" maxWidth={props.maxwidth || 800} onclose={() => { resolve() }}>
              
              <TextBox selectonclick dir="ltr" title='جست و جو:' on={txt => { props.query = txt }}
               defaultValue={props.query || global.icon_query} onenter={async (e) => {
                global.icon_icons = null;
                await update(props.query);
              }} />
              <br-x />
              <br-x />
              <w-cse style={{ gap: 10, maxHeight: "80vh", overflowX: "scroll" }}>
                {
                  (global.icon_icons || []).map(icon => {

                    return <c-cc class={z.qestyles.ico + " w-20 h-[62px] rounded-[5px]  px-3 py-1 cursor-pointer"} onClick={async () => {

                      await customer((props, refresh, resolve) => {
                        return <WindowFloat contentStyle={{ direction: "rtl" }} title="چه نوع المنتی مد نظر شماست؟" onclose={() => resolve()} zplus={1}>
                          <w-cse>
                            <Ico icon="icon-[mynaui--letter-v-solid] w-[35px] h-[35px]" text={props.vtext || `<Ico>`} on={async () => {
                              let str = `<Ico on={async () => {}} icon="icon-[${icon.name}] w-[35px] h-[35px]" text={\`${icon.text || props.query || global.icon_query}\`} />`.trim();
                              Copy(str)
                              props.vtext = "کپی شد"
                              props.vcolor = "olivedrab"
                              setTimeout(() => {
                                props.vtext = null
                                props.vcolor = null
                                refresh()
                              }, 5000);
                              refresh()
                            }} iconStyle={{ color: props.vcolor }} textStyle={{ color: props.vcolor, direction: "ltr" }} />


                            <Ico icon="icon-[proicons--rectangle-wide] w-[35px] h-[35px]" text={props.itext || `<icon>`} on={async () => {
                              let str = `<icon class='w-[35px] h-[35px] icon-[${icon.name}]' />`
                              Copy(str)
                              props.itext = "کپی شد"
                              props.icolor = "olivedrab"
                              setTimeout(() => {
                                props.itext = null
                                props.icolor = null
                                refresh()
                              }, 5000);
                              refresh()
                            }} iconStyle={{ color: props.icolor }} textStyle={{ color: props.icolor, direction: "ltr" }} />

                            <Ico icon="icon-[fluent--classification-24-regular]" text={props.ctext || `class`} on={async () => {
                              let str = `icon-[${icon.name}]`
                              Copy(str)
                              props.ctext = "کپی شد"
                              props.ccolor = "olivedrab"
                              setTimeout(() => {
                                props.ctext = null
                                props.ccolor = null
                                refresh()
                              }, 5000);
                              refresh()
                            }} iconStyle={{ color: props.ccolor }} textStyle={{ color: props.ccolor, direction: "ltr" }} />


                            <Ico icon="icon-[carbon--svg]" text={props.stext || `class`} on={async () => {
                              let str = `
                                  <svg style={{ color: "white" }} width={35} height={35} viewBox="0 0 ${Math.ceil(icon.height * 1.1)} ${icon.width}"> ${icon.path.replaceAll("\n", "")}</svg>
                              `.trim()

                              Copy(str)
                              props.stext = "کپی شد"
                              props.scolor = "olivedrab"
                              setTimeout(() => {
                                props.stext = null
                                props.scolor = null
                                refresh()
                              }, 5000);
                              refresh()
                            }} iconStyle={{ color: props.scolor }} textStyle={{ color: props.scolor, direction: "ltr" }} />

                          </w-cse>


                        </WindowFloat>
                      }, {})



                      // success("کپی شد")
                    }}>
                      <svg className={z.qestyles.icoimg}
                        width={35} height={35} viewBox={`0 0 ${Math.ceil(icon.height * 1.1)} ${icon.width}`}
                        dangerouslySetInnerHTML={{ __html: icon.path }}>
                      </svg>
                      <br-xx />
                      <f-9 className={z.qestyles.icotxt}>{icon.text || props.query || global.icon_query}</f-9>
                    </c-cc>
                  })
                }

              </w-cse>
            </WindowFloat>
          }, {})
           document.body.style.overflowY = "scroll"
        }} />



      </f-cse>
    </WindowFloat>
  );
};
