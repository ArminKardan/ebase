export default function Taskbar({
  minimizedWindows,
  activeWindow,
  onOpenWindow,
  onToggleStart,
  currentTime,
}) {
  const allWindows = activeWindow
    ? [activeWindow, ...minimizedWindows.filter((w) => w !== activeWindow)]
    : minimizedWindows;

  const windowLabels = {
    about: "About",
    projects: "Projects",
    resume: "Resume",
    contact: "Contact",
    game: "Game",
    mediaplayer: "Media Player",
  };
  return (
    <f-cse className="fixed bottom-0 left-0 right-0 h-14 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-3 gap-3 z-[999]">
      {/* Start Button*/}
      <button
        className="group relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
        onClick={onToggleStart}
      >
        <icon class="w-[38] h-[38] icon-[uiw--windows] text-white" />
      </button>

      {/* Divider */}
      <div className="h-8 w-px bg-white/20" />

      {/* Minimized Windows */}
      <f-xs className="flex gap-2 flex-1 overflow-x-auto">
        {allWindows.map((windowId) => (
          <button
            key={windowId}
            onClick={() => onOpenWindow(windowId)}
            className={`group relative h-10 px-4 rounded-lg backdrop-blur-sm border text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 whitespace-nowrap shadow-lg ${
              windowId === activeWindow
                ? "bg-blue-500/30 border-blue-400/50"
                : "bg-white/10 border-white/10 hover:bg-white/20"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                windowId === activeWindow
                  ? "bg-blue-400 animate-pulse"
                  : "bg-gray-400"
              }`}
            />
            {windowId === "about" && (
              <icon class="w-[18px] h-[18px] icon-[octicon--person-fill-24]" />
            )}
            {windowId === "projects" && (
              <icon class="w-[18px] h-[18px] icon-[teenyicons--folder-solid]" />
            )}
            {windowId === "resume" && (
              <icon class="w-[20px] h-[20px] icon-[material-symbols--description-rounded]" />
            )}
            {windowId === "contact" && (
              <icon class="w-[20px] h-[20px] icon-[ic--baseline-email]" />
            )}
            {windowId === "game" && (
              <icon class="w-[20px] h-[20px] icon-[solar--gameboy-bold]" />
            )}
            {windowId === "mediaplayer" && (
              <icon class="w-[20px] h-[20px] icon-[material-symbols-light--smart-display]" />
            )}

            <f-12 className="font-medium">
              {windowLabels[windowId] ||
                windowId.charAt(0).toUpperCase() + windowId.slice(1)}
            </f-12>
          </button>
        ))}
      </f-xs>

      {/* Taskbar */}
      <f-cse className="gap-2">
        {/* Divider */}
        <div className="h-8 w-px bg-white/20" />

        {/* Clock */}
        <button className="h-10 px-4 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white shadow-lg transition-all duration-300 hover:scale-105">
          <c-cc className="gap-0.5">
            <f-13 className="font-mono font-semibold">{currentTime}</f-13>
            <f-10 className="text-gray-300">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </f-10>
          </c-cc>
        </button>
      </f-cse>
    </f-cse>
  );
}
