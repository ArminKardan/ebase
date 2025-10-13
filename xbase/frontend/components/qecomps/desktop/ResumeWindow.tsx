import WindowFloat from "@/frontend/components/qecomps/WindowFloat";

export default function ResumeWindow(props: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <WindowFloat
      onclose={props.onClose}
      onminimize={props.onMinimize}
      showMinimize={true}
      padding={20}
      maxWidth={"80vh"}
      contentStyle={{
        background:
          "linear-gradient(135deg, rgba(212 219 241 / 0.82), rgba(35 29 49 / 0.82))",
      }}
    >
      <c-ss className="space-y-6" style={{ direction: "ltr" }}>
        <c-ss>
          <f-cse className="font-bold mb-4 gap-2">
            <icon class='w-[22px] h-[22px] icon-[material-symbols--work] text-blue-500' />
            <f-18 className="font-bold">Experience</f-18>
          </f-cse>
          <c-ss className="space-y-4">
            <c-ss>
              <f-16 className="font-semibold text-gray-800">
                Senior Developer
              </f-16>
              <f-13 className="text-gray-600">
                Turing Team. • 2022 - Present
              </f-13>
              <f-13 className="text-gray-700 mt-2">
                Built responsive web applications for various clients and
                mentoring junior developers.
              </f-13>
            </c-ss>
          </c-ss>
        </c-ss>

        <c-ss>
          <f-cse className="font-bold mb-4 gap-2">
            <icon class='w-[26px] h-[26px] icon-[mdi--account-school] text-blue-500' />
            <f-18 className="font-bold">Education</f-18>
          </f-cse>
          <c-ss>
            <f-14 className="font-semibold text-gray-800">
              Computer Engineering
            </f-14>
            <f-13 className="text-gray-600">Islamic Azad University • 2023 - 2027</f-13>
          </c-ss>
          <br-x/>
          <c-ss>
            <f-14 className="font-semibold text-gray-800">
              High School Diploma
            </f-14>
            <f-13 className="text-gray-600">Sampad • 2016 - 2022</f-13>
          </c-ss>
        </c-ss>
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
