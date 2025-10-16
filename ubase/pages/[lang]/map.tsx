import Component, { PageEl } from "@/frontend/components/qecomps/Component";
import Window from "@/frontend/components/qecomps/Window";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import LiveMap from "@/frontend/components/qecomps/map/LiveMap";

export default (p) => Component(p, Page);

const Page: PageEl = (
  props: {} & { [key: string]: any },
  refresh,
  getProps,
  onLoad,
  onConnected,
  dies,
  isFront,
  z
) => {

  getProps(async (isFront) => {
    // Default coordinates (Zargari office)
    const defaultLat = 29.63441753728273;
    const defaultLng = 52.49366283416749;

    props.latitude = defaultLat;
    props.longitude = defaultLng;
    props.mapLoaded = false;
    props.mapInstance = null;
    props.mapLoaded = true;

  });

  return (
    <Window title="Location">
      <LiveMap
        latitude={props.latitude}
        longitude={props.longitude}
        zoom={15}
        height="500px"
        width="100%"
        mapLoaded={props.mapLoaded}
        setMapRef={(map) => {
          props.mapInstance = map;
        }}
      />
    </Window>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await (
    await import("@/backend/SSRVerify.ts")
  ).SSRVerify(context, false, []);

  const obj = await Prosper(
    {
      props: {
        session,
        title: "Location",
        description: "Map page",
      },
    },
    context
  );
  return obj;
};
