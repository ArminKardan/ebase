import Component, { PageEl } from "@/frontend/components/qecomps/Component";
import Window from "@/frontend/components/qecomps/Window";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import TextBox from "@/frontend/components/qecomps/TextBox";
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
    props.inputLat = defaultLat;
    props.inputLng = defaultLng;
    props.mapLoaded = false;
    props.mapInstance = null;
    props.mapLoaded = true;

  });

  return (
    <Window title="Location">
      <c-x className="bg-white rounded-2xl p-6 gap-5">
        <w-cc className="gap-4">
          <TextBox
            title="Latitude"
            value={props.inputLat}
            on={(txt) => {
              props.inputLat = txt;
            }}
            placeholder="Enter latitude"
          />
          <TextBox
            title="Longitude"
            value={props.inputLng}
            on={(txt) => {
              props.inputLng = txt;
            }}
            placeholder="Enter longitude"
          />
        </w-cc>
        <c-cc>
          <button
            className="btn btn-success p-4 w-full"
            onClick={() => {
              const lat = parseFloat(props.inputLat);
              const lng = parseFloat(props.inputLng);

              if (!isNaN(lat) && !isNaN(lng)) {
                props.latitude = lat;
                props.longitude = lng;
                if (props.mapInstance) {
                  props.mapInstance.setView([lat, lng]);
                }
                refresh();
              }
            }}
          >
            Show Input Location
          </button>
        </c-cc>
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
      </c-x>
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
