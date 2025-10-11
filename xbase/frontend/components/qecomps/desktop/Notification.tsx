import CloseIcon from "@mui/icons-material/Close";

export default function Notification(props: {
  onClose: () => void;
  onAboutClick: () => void;
  onProjectsClick: () => void;
}) {
  return (
    <div className="fixed bottom-20 right-6 z-[1002] animate-[slideUp_0.3s_ease-out]">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-80">
        {/* Header */}
        <f-cse className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 gap-2">
          <c-cc className="">
            <f-19>ℹ️</f-19>
          </c-cc>
          <f-13 className="text-white font-semibold flex-1">Notifiction</f-13>
          <button
            onClick={props.onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </f-cse>

        {/* Content */}
        <c-ss className="p-4 gap-3" style={{ direction: "ltr" }}>
          <f-13 className="text-gray-700 leading-relaxed">
            Hi, I'm Saman! Welcome to my personal site, Hope you're visiting from
            a PC! double-click the folders to explore.
          </f-13>
          <f-12 className="text-gray-600">
            Get Started:{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={props.onAboutClick}
            >
              About Me
            </span>{" "}
            |{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={props.onProjectsClick}
            >
              My Projects
            </span>
          </f-12>
        </c-ss>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
