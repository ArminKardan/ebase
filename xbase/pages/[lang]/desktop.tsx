import Component, { PageEl } from "@/frontend/components/qecomps/Component";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import BootScreen from "@/frontend/components/qecomps/desktop/BootScreen";
import AboutWindow from "@/frontend/components/qecomps/desktop/AboutMeWindow";
import ContactWindow from "@/frontend/components/qecomps/desktop/ContactWindow";
import DesktopIcon from "@/frontend/components/qecomps/desktop/DesktopIcon";
import GameWindow from "@/frontend/components/qecomps/desktop/Game";
import MediaPlayerWindow from "@/frontend/components/qecomps/desktop/MediaPlayerWindow";
import ProjectsWindow from "@/frontend/components/qecomps/desktop/ProjectsWindow";
import ResumeWindow from "@/frontend/components/qecomps/desktop/ResumeWindow";
import StartMenu from "@/frontend/components/qecomps/desktop/StartMenu";
import Taskbar from "@/frontend/components/qecomps/desktop/Taskbar";
import Notification from "@/frontend/components/qecomps/desktop/Notification";

export default (p) => Component(p, Page);

const Page: PageEl = (
  props,
  refresh,
  getProps,
  onLoad,
  onConnected,
  dies,
  isFront,
  z
) => {
  getProps(async (isFront) => {
    props.bootComplete = false;
    props.activeWindow = null;
    props.minimizedWindows = [];
    props.startMenuOpen = false;
    props.showNotification = false;
    props.recentOpen = false;
    props.currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Boot Time
    await sleep(5000);
    props.bootComplete = true;
    refresh();
  });

  onLoad(async () => {
    props.background = "/TURING.jpg";
    date();
    // Show notification
    await sleep(7000);
    props.showNotification = true;
    refresh();

    // Hide notification
    await sleep(12000);
    props.showNotification = false;
    refresh();
  });

  const date = () => {
    setInterval(() => {
      props.currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      refresh();
    }, 1000);
  };

  const openWindow = (windowId) => {
    if (windowId === "toggle_recent") {
      props.recentOpen = !props.recentOpen;
      refresh();
      return;
    }

    props.activeWindow = windowId;
    props.minimizedWindows =
      props.minimizedWindows?.filter((id) => id !== windowId) || [];
    props.startMenuOpen = false;
    refresh();
  };

  const closeWindow = () => {
    props.activeWindow = null;
    refresh();
  };

  const minimizeWindow = () => {
    if (props.activeWindow) {
      props.minimizedWindows = [
        ...(props.minimizedWindows || []),
        props.activeWindow,
      ];
      props.activeWindow = null;
      refresh();
    }
  };

  const toggleStartMenu = () => {
    props.startMenuOpen = !props.startMenuOpen;
    refresh();
  };

  if (!props.bootComplete) {
    return <BootScreen />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative pb-16"
      style={{ backgroundImage: `url(${props.background})` }}
    >
      {/* Desktop Icons */}
      <div className="p-5 flex flex-col gap-4 w-fit">
        <DesktopIcon
          id="about"
          icon={
            <icon class="w-[26px] h-[26px] icon-[octicon--person-fill-24]" />
          }
          label="About Me"
          onOpen={openWindow}
        />
        <DesktopIcon
          id="projects"
          icon={
            <icon class="w-[26px] h-[26px] icon-[teenyicons--folder-solid]" />
          }
          label="Projects"
          onOpen={openWindow}
        />
        <DesktopIcon
          id="resume"
          icon={
            <icon class="w-[29px] h-[29px] icon-[material-symbols--description-rounded]" />
          }
          label="Resume"
          onOpen={openWindow}
        />
        <DesktopIcon
          id="contact"
          icon={<icon class="w-[29px] h-[29px] icon-[ic--baseline-email]" />}
          label="Contact"
          onOpen={openWindow}
        />
      </div>

      {/* Windows */}
      {props.activeWindow === "about" && (
        <AboutWindow onClose={closeWindow} onMinimize={minimizeWindow} />
      )}
      {props.activeWindow === "projects" && (
        <ProjectsWindow onClose={closeWindow} onMinimize={minimizeWindow} />
      )}
      {props.activeWindow === "resume" && (
        <ResumeWindow onClose={closeWindow} onMinimize={minimizeWindow} />
      )}

      {props.activeWindow === "contact" && (
        <ContactWindow
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          contactName={props.contactName}
          contactEmail={props.contactEmail}
          contactMessage={props.contactMessage}
          onNameChange={(value) => {
            props.contactName = value;
            refresh();
          }}
          onEmailChange={(value) => {
            props.contactEmail = value;
            refresh();
          }}
          onMessageChange={(value) => {
            props.contactMessage = value;
            refresh();
          }}
        />
      )}
      {props.activeWindow === "game" && (
        <GameWindow onClose={closeWindow} onMinimize={minimizeWindow} />
      )}
      {props.activeWindow === "mediaplayer" && (
        <MediaPlayerWindow onClose={closeWindow} onMinimize={minimizeWindow} />
      )}

      {/* Notification */}
      {props.showNotification && (
        <Notification
          onClose={() => {
            props.showNotification = false;
            refresh();
          }}
          onAboutClick={() => openWindow("about")}
          onProjectsClick={() => openWindow("projects")}
        />
      )}

      {/* Start Menu */}
      {props.startMenuOpen && (
        <StartMenu
          onItemClick={openWindow}
          onClose={() => {
            props.startMenuOpen = false;
            refresh();
          }}
          recentOpen={props.recentOpen}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        minimizedWindows={props.minimizedWindows || []}
        activeWindow={props.activeWindow}
        onOpenWindow={openWindow}
        onToggleStart={toggleStartMenu}
        currentTime={props.currentTime}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  var session = await (
    await import("@/backend/SSRVerify.ts")
  ).SSRVerify(context, false, []);

  let obj = await Prosper(
    {
      props: {
        session,
        title: "Turing - Desktop",
        description: "Desktop Mode",
      },
    },
    context
  );

  return obj;
};
