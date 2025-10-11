import TextBox from "@/frontend/components/qecomps/TextBox";
import WindowFloat from "@/frontend/components/qecomps/WindowFloat";

export default function ContactWindow({
  onClose,
  onMinimize,
  contactName = "",
  contactEmail = "",
  contactMessage = "",
  onNameChange,
  onEmailChange,
  onMessageChange,
}) {
  const handleSend = async () => {
    // Validation
    if (!contactName || !contactEmail || !contactMessage) {
      error("All fields are required.");
      return;
    } else {
      const res = await API["msg"]({
        Name: contactName,
        Email: contactEmail,
        msg: contactMessage,
      });
      if (res.success) {
        success("Message sent!");
        // Clear form
        onNameChange("");
        onEmailChange("");
        onMessageChange("");
      } else {
        error(res.msg || "erroooor");
      }
    }
  };

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      showMinimize={true}
      padding={20}
      maxWidth={"100vh"}
      contentStyle={{
        background:
          "linear-gradient(135deg, rgba(212 219 241 / 0.82), rgba(35 29 49 / 0.82))",
      }}
    >
      <div className="space-y-4" style={{ direction: "ltr" }}>
        <c-ss>
          <TextBox
            style={{ fontWeight: 1000, fontSize: 13, color: "#374151" }}
            dir="ltr"
            type="text"
            title="Name"
            placeholder="Your name"
            defaultValue={contactName}
            on={onNameChange}
          />
        </c-ss>

        <c-ss>
          <TextBox
            style={{ fontWeight: 1000, fontSize: 13, color: "#374151" }}
            dir="ltr"
            type="email"
            title="Email"
            placeholder="example@email.com"
            defaultValue={contactEmail}
            on={onEmailChange}
          />
        </c-ss>

        <c-ss>
          <f-13 className="mb-2" style={{ fontWeight: 1000, color: "#374151" }}>
            Message
          </f-13>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={5}
            placeholder="Your message..."
            value={contactMessage}
            onChange={(e) => onMessageChange(e.target.value)}
          />
        </c-ss>

        <button className="btn btn-accent w-full" onClick={handleSend}>
          Send Message
        </button>
      </div>
      {/* 
      <div className="flex gap-2 justify-end mt-5" style={{ direction: "ltr" }}>
        <button className="btn btn-soft" onClick={onMinimize}>
          Minimize
        </button>
        <button className="btn btn-error" onClick={onClose}>
          Close
        </button>
      </div> */}
    </WindowFloat>
  );
}
