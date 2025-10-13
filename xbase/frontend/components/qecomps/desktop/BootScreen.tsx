export default function BootScreen() {
  return (
    <c-cc style={{direction:"ltr"}} className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black px-4">
      <c-cc className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
        <f-40 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold animate-[fadeIn_1s_ease-in] text-3xl sm:text-4xl md:text-5xl">
          Welcome
        </f-40>
        <f-24 className="text-white font-mono animate-pulse text-lg sm:text-xl md:text-2xl">
          Still booting please wait...
        </f-24>
        <f-14 className="text-gray-400 text-xs sm:text-sm md:text-base px-4 text-center">
          For the best experience, please use a PC and press (F11) to enter full
          screen
        </f-14>
        <f-ss className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:w-80 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto shadow-lg">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 animate-[loading_5s_ease-in-out_forwards]" />
        </f-ss>
      </c-cc>
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </c-cc>
  );
}
