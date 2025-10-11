import UserAvatar from "@/frontend/components/qecomps/UserAvatar";
import WindowFloat from "../WindowFloat";

export default function AboutWindow(props: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <WindowFloat
      // title="About Me"
      onclose={props.onClose}
      onminimize={props.onMinimize}
      showMinimize={true}
      maxWidth={"140vh"}
      padding={20}
      _refer={props.onMinimize}
      contentStyle={{
        background:
          "linear-gradient(135deg, rgba(212 219 241 / 0.82), rgba(35 29 49 / 0.82))",
      }}
    >
      
      <div className="flex items-center gap-5" style={{ direction: "ltr" }}>
        <UserAvatar image="/1.jpg" width={100} style={{flexShrink:0}}/>
        <c-ss>
          <f-24 className="font-bold mb-2">Saman Esmaellpour</f-24>
          <f-14 className="text-gray-800 mb-2">Full-Stack Developer (QE)</f-14>
          <f-13 className="text-gray-700">
            I’m a senior full-stack developer and proud member of the Turing
            research group, specializing in React.js, Next.js, JavaScript,
            Node.js, Python, C#, and C++. Combining deep technical knowledge
            with a passion for problem-solving, I’ve worked on diverse projects
            ranging from cloud-based services to real-time applications. I’m
            committed to delivering clean, maintainable, and scalable code while
            helping businesses innovate and grow.
          </f-13>
        </c-ss>
      </div>

      <c-ss
        className="border-t border-gray-200 mt-5 pt-5"
        style={{ direction: "ltr" }}
      >
        <f-18 className="font-semibold mb-3">Skills</f-18>
        <w-sse className="gap-2">
          {[
            "QE",
            "JavaScript",
            "TypeScript",
            "Python",
            "C++",
            "Next.js",
            "React.js",
            "Node.js",
            "Tailwind CSS",
            "Flutter",
            "MongoDB",
          ].map((skill) => (
            <f-13
              key={skill}
              className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium"
            >
              {skill}
            </f-13>
          ))}
        </w-sse>
      </c-ss>

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
