import UserAvatar from "@/frontend/components/qecomps/UserAvatar";

export default function StartMenu(props: {
  onItemClick: (id: string) => void;
  onClose: () => void;
  recentOpen: boolean;
}) {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://qepal.com/i/ahPyU",
      icon: <icon class="w-[20px] h-[20px] icon-[bi--github]" />,
      colorFrom: "from-gray-700/20",
      colorTo: "to-gray-900/20",
      textColor: "text-gray-400",
      hoverFrom: "from-gray-700",
      hoverTo: "to-gray-900",
    },
    {
      name: "LinkedIn",
      url: "https://qepal.com/i/JUG6m",
      icon: <icon class="w-[20px] h-[20px] icon-[ri--linkedin-box-fill]" />,
      colorFrom: "from-blue-600/20",
      colorTo: "to-blue-800/20",
      textColor: "text-blue-400",
      hoverFrom: "from-blue-600",
      hoverTo: "to-blue-800",
    },
    {
      name: "Instagram",
      url: "https://qepal.com/i/SeTZB",
      icon: <icon class="w-[20px] h-[20px] icon-[basil--instagram-outline]" />,
      colorFrom: "from-pink-500/20",
      colorTo: "to-purple-600/20",
      textColor: "text-pink-400",
      hoverFrom: "from-pink-500",
      hoverTo: "to-purple-600",
    },
    {
      name: "Telegram",
      url: "https://qepal.com/i/oAb7x",
      icon: <icon class="w-[20px] h-[20px] icon-[bxl--telegram]" />,
      colorFrom: "from-sky-400/20",
      colorTo: "to-blue-600/20",
      textColor: "text-sky-400",
      hoverFrom: "from-sky-400",
      hoverTo: "to-blue-600",
    },
  ];

  const menuItems = [
    {
      id: "about",
      icon: <icon class="w-[22px] h-[22px] icon-[octicon--person-fill-24]" />,
      label: "About Me",
      desc: "Personal information",
    },
    {
      id: "projects",
      icon: <icon class="w-[22px] h-[22px] icon-[teenyicons--folder-solid]" />,
      label: "Projects",
      desc: "View my work",
    },
    {
      id: "resume",
      icon: (
        <icon class="w-[22px] h-[22px] icon-[material-symbols--description-rounded]" />
      ),
      label: "Resume",
      desc: "Experience & education",
    },
    {
      id: "contact",
      icon: <icon class="w-[22px] h-[22px] icon-[ic--baseline-email]" />,
      label: "Contact",
      desc: "Get in touch",
    },
  ];

  const recentApps = [
    {
      name: "Steam",
      icon: <icon class="w-[14px] h-[14px] icon-[cib--steam]" />,
      color: "from-slate-700 to-slate-900",
      iconColor: "text-blue-400",
    },
    {
      name: "Visual Studio Code",
      icon: (
        <icon class="w-[14px] h-[14px] icon-[mdi--microsoft-visual-studio-code]" />
      ),
      color: "from-blue-500 to-blue-600",
      iconColor: "text-blue-400",
    },
    {
      name: "Spotify",
      icon: <icon class="w-[20px] h-[20px] icon-[ri--spotify-fill]" />,
      color: "from-green-500 to-green-600",
      iconColor: "text-green-400",
    },
    {
      name: "Figma",
      icon: (
        <icon class="w-[14px] h-[14px] icon-[streamline-logos--figma-logo-block]" />
      ),
      color: "from-purple-500 to-purple-600",
      iconColor: "text-purple-400",
    },
    {
      name: "Edge",
      icon: <icon class="w-[14px] h-[14px] icon-[bi--browser-edge]" />,
      color: "from-[#0078D7] to-[#00A4EF]",
      iconColor: "text-[#6CCDFE]",
    },
    {
      name: "Photoshop",
      icon: (
        <icon class="w-[14px] h-[14px] icon-[icon-park-solid--adobe-photoshop]" />
      ),
      color: "from-[#0F2027] to-[#203A43]",
      iconColor: "text-[#00C8FF]",
    },
    {
      name: "Android Studio",
      icon: <icon class="w-[14px] h-[14px] icon-[mdi--android-studio]" />,
      color: "from-emerald-600 to-teal-700",
      iconColor: "text-emerald-300",
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] bg-black/20 backdrop-blur-sm"
        onClick={props.onClose}
      />

      {/* Start Menu */}
      <div
        className="fixed bottom-16 left-3 right-3 sm:left-3 sm:right-auto sm:w-[400px] max-w-3xl bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-[1001] overflow-hidden"
        style={{ direction: "ltr" }}
      >
        {/* profile */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10">
          <f-cse className="gap-4">
            {<UserAvatar image="/1.jpg" width={50} style={{ flexShrink: 0 }} />}
            <c-ss className="flex-1">
              <f-16 className="text-white font-bold">Turing Team</f-16>
            </c-ss>
          </f-cse>
        </div>

        <f-x className="h-[400px]">
          {/* Left Side - Menu Items */}
          <c-ss className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg"
                onClick={() => props.onItemClick(item.id)}
              >
                <c-cc className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 shadow-lg group-hover:scale-105">
                  {item.icon}
                </c-cc>
                <c-ss className="flex-1">
                  <f-13 className="text-white font-semibold">{item.label}</f-13>
                  <f-10 className="text-gray-400">{item.desc}</f-10>
                </c-ss>
              </div>
            ))}
          </c-ss>

          {/* Vertical Divider */}
          <div className="w-px bg-white/10" />

          {/* Right Side */}
          <c-ss className="w-40 p-3 space-y-2 bg-gray-800/30">
            <f-11 className="text-gray-400 px-2 mb-1">Quick Access</f-11>

            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              onClick={() => props.onItemClick("game")}
            >
              <c-cc className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-300">
                <icon class="w-[20px] h-[20px] icon-[solar--gameboy-bold]" />
              </c-cc>
              <f-12 className="text-white font-medium">Game</f-12>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              onClick={() => props.onItemClick("mediaplayer")}
            >
              <c-cc className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-orange-500/20 text-pink-400 group-hover:from-pink-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300">
                <icon class="w-[20px] h-[20px] icon-[material-symbols-light--smart-display]" />
              </c-cc>
              <f-12 className="text-white font-medium">Media Player</f-12>
            </div>

            <div className="border-t border-white/10 my-2"></div>
            <f-11 className="text-gray-400 px-2 mb-1">Social</f-11>

            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-lg group"
              >
                <c-cc
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${social.colorFrom} ${social.colorTo} ${social.textColor} group-hover:${social.hoverFrom} group-hover:${social.hoverTo} group-hover:text-white transition-all duration-300`}
                >
                  {social.icon}
                </c-cc>
                <f-12 className="text-white font-medium">{social.name}</f-12>
              </a>
            ))}
          </c-ss>
        </f-x>
        {/* Recently Used*/}
        <div className="px-3 pb-2">
          <div className="border-t border-white/10 pt-2">
            <div className="dropdown dropdown-top w-[180px]">
              <div
                tabIndex={0}
                role="button"
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/10 cursor-pointer transition-all duration-300 rounded-xl"
              >
                <f-11 className="text-gray-400">Recently Used</f-11>
                <f-11 className="text-gray-400">▲</f-11>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-gray-800/95 backdrop-blur-xl rounded-xl z-[1] w-full p-1 shadow-xl border border-white/10"
              >
                {recentApps.map((app, index) => (
                  <li key={index}>
                    <a className="flex items-center gap-3 px-3 py-2 cursor-not-allowed rounded-lg transition-all">
                      <c-cc
                        className={`w-6 h-6 rounded-lg bg-gradient-to-br ${app.color} shadow-lg`}
                      >
                        <span className="text-white">{app.icon}</span>
                      </c-cc>
                      <f-10 className="text-gray-300">{app.name}</f-10>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-gray-900/50">
          <f-x className="p-2 gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-yellow-500/20 cursor-pointer transition-all duration-300 rounded-xl group"
              onClick={() => window.location.reload()}
            >
              <icon class="w-[20px] h-[20px] icon-[iconamoon--restart-bold] text-gray-400 group-hover:text-yellow-500 transition-colors" />
              <f-12 className="text-gray-300 font-medium">restart</f-12>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-red-500/20 cursor-not-allowed transition-all duration-300 rounded-xl group">
              <icon class="w-[18px] h-[18px] icon-[wpf--shutdown] text-gray-400 group-hover:text-red-400 transition-colors" />
              <f-12 className="text-gray-300 font-medium">Shutdown</f-12>
            </button>
          </f-x>
        </div>
      </div>
    </>
  );
}
