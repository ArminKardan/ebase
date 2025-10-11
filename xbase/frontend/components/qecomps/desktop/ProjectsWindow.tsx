import WindowFloat from "@/frontend/components/qecomps/WindowFloat";

export default function ProjectsWindow(props: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  const projects = [
    {
      name: "E-Commerce Platform",
      desc: "Full-stack shopping experience",
      tech: "QE, Node.js, MongoDB",
    },
    {
      name: "GitHub Unfollow Tool",
      desc: "To run this Microservices fully, you need a worker, Message me to get one.",
      tech: "QE, Python",
    },
    {
      name: "DeskDashboard esp32TTGO",
      desc: "An open-source ESP32 desktop dashboard with real-time stats and a modern design.",
      tech: "c++, Node.js",
    },
    {
      name: "Mobile Shop",
      desc: "Simple and fast user experience for online purchases.",
      tech: "Flutter, Node.js, MongoDB",
    },
    {
      name: "IPTV",
      desc: "Free Online TV",
      tech: "QE, Node.js",
    },
  ];

  return (
    <WindowFloat
      onclose={props.onClose}
      onminimize={props.onMinimize}
      showMinimize={true}
      padding={20}
      maxWidth={"100vh"}
      contentStyle={{
        background: "#7c7c91",
        height: "50vh",
      }}
    >
      <div className="space-y-4" style={{ direction: "ltr" }}>
        {projects.map((project, i) => (
          <div
            key={i}
            className="border-l-4 border-gray-800 pl-4 py-3 bg-[#7c7c91] hover:bg-gray-500 transition-colors cursor-pointer rounded-r"
          >
            <f-csb>
              <c-ss>
                <f-14 className="font-semibold text-gray-900">
                  {project.name}
                </f-14>
                <f-13 className="text-sm text-gray-800 mt-1">
                  {project.desc}
                </f-13>
                <f-11 className="text-xs text-gray-700 mt-2">
                  {project.tech}
                </f-11>
              </c-ss>
              <icon class="w-[28px] h-[28px] icon-[lets-icons--send-light] text-gray-400 flex-shrink-0 ml-3" />{" "}
            </f-csb>
          </div>
        ))}
      </div>

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
