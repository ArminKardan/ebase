// pages/500.js
export default function Custom404() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen  text-center animate-fade-in"
      style={{
        animation: 'fadeIn 1s ease-out',
        direction: "ltr",
      }}
    >
      <h1 className="text-6xl font-bold text-blue-700 mb-4">500</h1>
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-3xl text-blue-800 font-bold">?</span>
        </div>
        <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-75"></div>
      </div>
      <p className="text-xl text-gray-700 mb-2">Server error.</p>
      <p className="text-md text-gray-500 mb-6">
        We have some error in our side.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Go Home
      </a>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
