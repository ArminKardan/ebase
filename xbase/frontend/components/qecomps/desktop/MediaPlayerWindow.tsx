import WindowFloat from "@/frontend/components/qecomps/WindowFloat";

export default function MediaPlayerWindow(props: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <WindowFloat
      onclose={props.onClose}
      onminimize={props.onMinimize}
      showMinimize={true}
      padding={20}
      maxWidth={"100vh"}
      contentStyle={{
        background:
          "linear-gradient(135deg, rgba(212 219 241 / 0.82), rgba(35 29 49 / 0.82))",
      }}
    >
      <c-cc className="min-h-[300px]" style={{ direction: "ltr" }}>
        <c-cc className="space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <icon class="w-[50px] h-[50px] text-white icon-[material-symbols-light--smart-display]" />
          </div>

          <f-32 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">
            Coming Soon
          </f-32>

          <f-14 className="text-gray-700 text-center max-w-md">
            This section will feature cool videos of my completed projects, stay
            tuned to see what I’ve been building!
          </f-14>

          <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full w-2/5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse" />
          </div>
        </c-cc>
      </c-cc>

      {/* <div className="flex gap-2 justify-end mt-5" style={{ direction: "ltr" }}>
        <button className="btn btn-soft" onClick={props.onMinimize}>
          Minimize
        </button>
        <button className="btn btn-error" onClick={props.onClose}>
          Close
        </button>
      </div> */}
    </WindowFloat>
  );
}
