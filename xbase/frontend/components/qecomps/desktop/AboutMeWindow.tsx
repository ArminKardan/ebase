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
          <f-24 className="font-bold mb-2">Turing Team</f-24>
          <f-14 className="text-gray-800 mb-2">Technology Solutions</f-14>
          <f-13 className="text-gray-700">
            At Turing, we specialize in investment, design, consultation,
            training, and support across software and hardware solutions. Our
            team is deeply skilled in artificial intelligence, business
            development in electronic and digital technologies, and building
            innovative solutions based on cutting-edge technologies in computer
            science, electrical engineering, and electronics. We combine
            technical expertise with a passion for problem-solving, delivering
            clean, maintainable, and scalable code while helping businesses
            innovate and grow.
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
            "Platform Design & Development",
            "Microservices Architecture",
            "Website Design",
            "Electronic Product Development",
            "Real-Time Applications",
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
