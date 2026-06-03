import Component, { PageEl } from "@/frontend/components/qecomps/Component";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import CodeIcon from "@mui/icons-material/Code";
import Router from "next/router";

export default (p) => Component(p, Page);

const Page: PageEl = (
  props,
  refresh,
  getProps,
  onLoad,
  onConnected,
  dies,
  isFront,
  z,
) => {
  return (
    <c-cc
      className="min-h-screen"
      style={{
        backgroundImage: `url(/bg.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <c-x className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></c-x>

      <c-cc className="z-10 min-h-screen px-4">
        <img
          src="https://cdn.qepal.com/qepal/qeraw.webp"
          alt="Qe Logo"
          className="h-16 w-auto mb-6"
        />
        <c-x className="text-3xl font-bold text-white mb-4">
          پروژه خود را شروع کنید
        </c-x>

        <c-cc className="text-white/70 text-base mb-8 max-w-md">
          این کدها را پاک کنید و پروژه خود را بسازید.
        </c-cc>

        <f-cc
          onClick={() => {
            Router.push(z.root + "/main");
          }}
          className="gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
        >
          <CodeIcon className="w-5 h-5" />
          <c-x>کدهای نمونه</c-x>
        </f-cc>
      </c-cc>
    </c-cc>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  var session = await (
    await import("@/backend/SSRVerify.ts")
  ).SSRVerify(context, false, []);

  let obj = await Prosper(
    {
      props: {
        session,
        title: "QE",
        description: "Start new project",
      },
    },
    context,
  );

  return obj;
};
