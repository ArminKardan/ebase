import WindowFloat from "@/frontend/components/qecomps/WindowFloat";

export default function GameWindow(props: {
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
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <f-40 className="text-white font-bold">🎮</f-40>
          </div>
          
          <f-32 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Coming Soon
          </f-32>
          
          <f-14 className="text-gray-700 text-center max-w-md">
            An exciting gaming experience is being developed. Stay tuned for updates!
          </f-14>
          
          <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
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