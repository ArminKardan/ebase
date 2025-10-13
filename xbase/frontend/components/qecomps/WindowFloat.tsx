import { CSSProperties, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropFreeIcon from "@mui/icons-material/CropFree";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Component, { PageEl } from "@/frontend/components/qecomps/Component";
import Img from "@/frontend/components/qecomps/Img";

export type WindowFloatPropsType = {
  z?: number;
  zplus?: number;
  onclose?: () => void;
  onminimize?: () => void;
  showMinimize?: boolean;
  darkness?: number;
  maxWidth?: number | string;
  padding?: number | string;
  wz?: number;
  titlebgcolor?: string;
  titletextcolor?: string;
  title?: string;
  children?: any;
  onhelp?: () => void;
  onsettings?: () => any;
  style?: CSSProperties;
  watermarkimg?: string;
  id?: string;
  maximizeHeight?: boolean;
  contentbgcolor?: string;
  contentStyle?: CSSProperties;
  className?: string;
  _refer?: any;
};

export default (p: WindowFloatPropsType) => Component(p, Page);
const Page: PageEl = (
  props: WindowFloatPropsType & { [key: string]: any },
  refresh,
  getProps,
  onLoad,
  onConnected,
  dies,
  isFront,
  z
): React.JSX.Element => {
  if (props._refer) {
    props._refer.close = function close() {
      document.getElementById(hash)?.classList.remove("opacity-100");
      document.getElementById(hash)?.classList.add("opacity-0");
      document.getElementById(hash)?.classList.remove("scale-100");
      document.getElementById(hash)?.classList.add("scale-50");
      document.getElementById(hash + "-gray")?.classList.remove("opacity-100");
      document.getElementById(hash + "-gray")?.classList.add("opacity-0");
      document.getElementById(hash)?.classList.remove("modal-open");
    };
  }

  let hash = MD5(props.title + props.children.innerText);

  useEffect(() => {
    // if (!document.getElementById(hash).classList.contains("modal-open"))
    setTimeout(() => {
      document.getElementById(hash)?.classList.remove("opacity-0");
      document.getElementById(hash)?.classList.add("opacity-100");

      document.getElementById(hash)?.classList.remove("scale-50");
      document.getElementById(hash)?.classList.add("scale-100");

      document.getElementById(hash + "-gray")?.classList.remove("opacity-0");
      document.getElementById(hash + "-gray")?.classList.add("opacity-100");
    }, 20);
  }, []);

  return (
    <>
      <div
        id={hash}
        className={
          z.qestyles.dialog +
          " p-0 scale-50 opacity-0 transition-all duration-500"
        }
        style={{
          width: "95vw",
          maxWidth: props["maxw"] || props.maxWidth || "26rem",
          minHeight: props["minh"],

          // overflowY:"scroll",
          direction: "ltr",
          zIndex:
            props.wz || (props.z ? props.z + 1 : 251 + (props.zplus || 0)),
          ...props.style,
        }}
      >
        <f-csb
          class={z.qestyles.dialogtitle + " " + z.qestyles.title}
          style={{ height: 30, fontSize: 12 }}
        >
          <f-cc>
            <f-cc
              className={
                z.qestyles.dialogbtn +
                (z.lang.dir == "rtl" ? " rounded-tr-md" : " rounded-tl-md") +
                " cursor-pointer"
              }
              style={{ width: 40, height: 30 }}
              onClick={() => props.onhelp?.()}
            >
              <InfoOutlineIcon style={{ color: "white", fontSize: 15 }} />
            </f-cc>
            {props.onsettings ? (
              <f-cc
                className={z.qestyles.dialogbtn + " cursor-pointer"}
                style={{ width: 50, height: 30 }}
                onClick={() => props.onsettings?.()}
              >
                <SettingsIcon style={{ color: "white", fontSize: 15 }} />
              </f-cc>
            ) : null}
          </f-cc>

          <f-c style={{ direction: z.lang.dir, width: "100%", flex: 1 }}>
            <span style={{ color: "white" }}>
              <sp-3 />
              {props.title}
              <sp-2 />
            </span>
          </f-c>

          <f-cc>
            {props.showMinimize ? (
              <f-cc
                className={z.qestyles.dialogbtn + " cursor-pointer"}
                style={{ width: 40, height: 30 }}
                onClick={() => props.onminimize?.()}
              >
                <MinimizeIcon style={{ color: "white", fontSize: 15 }} />
              </f-cc>
            ) : null}

            <f-cc
              className={z.qestyles.dialogbtn + " cursor-pointer"}
              style={{ width: 40, height: 30 }}
              onClick={() => {
                if (props["maxw"] == "95vw") {
                  props["maxw"] = null;
                  props["minh"] = null;
                } else {
                  props["maxw"] = "95vw";
                  if (props.maximizeHeight) props["minh"] = "70vh";
                }
                refresh();
              }}
            >
              {props["maxw"] == "95vw" ? (
                <ContentCopyIcon
                  style={{
                    color: "white",
                    fontSize: 13,
                    transform: "scaleX(-1)",
                  }}
                />
              ) : (
                <CropFreeIcon style={{ color: "white", fontSize: 15 }} />
              )}
            </f-cc>

            <f-cc
              className={
                z.qestyles.dialogbtn +
                (z.lang.dir == "rtl" ? " rounded-tl-md" : " rounded-tr-md") +
                " cursor-pointer"
              }
              style={{ width: 50, height: 30 }}
              onClick={async () => {
                setTimeout(() => {
                  props.onclose?.();
                }, 400);
                document.getElementById(hash)?.classList.remove("opacity-100");
                document.getElementById(hash)?.classList.add("opacity-0");
                document.getElementById(hash)?.classList.remove("scale-100");
                document.getElementById(hash)?.classList.add("scale-50");
                document
                  .getElementById(hash + "-gray")
                  ?.classList.remove("opacity-100");
                document
                  .getElementById(hash + "-gray")
                  ?.classList.add("opacity-0");
              }}
            >
              <CloseIcon style={{ color: "white", fontSize: 15 }} />
            </f-cc>
          </f-cc>
        </f-csb>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            width: "100%",
            textAlign: "justify",
            minHeight: props["minh"] ? `calc(${props["minh"]} - 30px)` : null,
            padding: props.padding || "0.5rem 0.5rem 0.5rem 0.5rem",
            lineHeight: 1.5,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            direction: z.lang.dir,
            maxHeight: "80vh",
            overflowY: "scroll",
            ...props.contentStyle,
          }}
        >
          {props.children}

          {props.watermarkimg ? (
            <f-cc
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: -1,
                opacity: 0.2,
                top: 0,
                left: 0,
              }}
            >
              <Img
                src={global.cdn(props.watermarkimg)}
                style={{ height: "60%", maxHeight: 200, marginTop: -30 }}
              />
            </f-cc>
          ) : null}
        </div>
      </div>

      {props.style?.visibility != "hidden" ? (
        <div
          className={
            z.qestyles.blackblurybg + " opacity-0 transition-all duration-500"
          }
          id={hash + "-gray"}
          style={{
            zIndex: props.z || 250 + (props.zplus || 0),
            opacity: props.darkness,
          }}
          onMouseDown={() => {
            setTimeout(() => {
              props.onclose?.();
            }, 400);
            document.getElementById(hash)?.classList.remove("opacity-100");
            document.getElementById(hash)?.classList.add("opacity-0");
            document.getElementById(hash)?.classList.remove("scale-100");
            document.getElementById(hash)?.classList.add("scale-50");
            document
              .getElementById(hash + "-gray")
              ?.classList.remove("opacity-100");
            document.getElementById(hash + "-gray")?.classList.add("opacity-0");
            document.getElementById(hash)?.classList.remove("modal-open");
          }}
        ></div>
      ) : null}
    </>
  );
};
