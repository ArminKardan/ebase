import dynamic from "next/dynamic";

// Dynamically load Leaflet components
const Map = dynamic(
    () =>
        import("react-leaflet").then(({ MapContainer, useMap }) => {
            const SetMapRef = ({ setMapRef }: { setMapRef: (map: any) => void }) => {
                const map = useMap();
                setMapRef(map);
                return null;
            };

            return function Map({ center, zoom, style, children, setMapRef }: any) {
                return (
                    <MapContainer center={center} zoom={zoom} style={style}>
                        <SetMapRef setMapRef={setMapRef} />
                        {children}
                    </MapContainer>
                );
            };
        }),
    { ssr: false }
);

const MapTileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const MapMarker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const MapPopup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default (props: {} & { [key: string]: any }) => {
    if (!props.mapLoaded || typeof window === "undefined") return <></>;

    if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
        document.head.appendChild(link);

        // Optional: remove on unmount
        if (props.dies) {
            props.dies(() => document.head.removeChild(link));
        }
    }

    return (
        <div
            style={{
                height: props.height || "500px",
                width: props.width || "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #ccc",
            }}
        >
            <Map
                center={[props.latitude, props.longitude]}
                zoom={props.zoom || 15}
                style={{ height: "100%", width: "100%" }}
                setMapRef={props.setMapRef || (() => { })}
            >
                <MapTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapMarker position={[props.latitude, props.longitude]}>
                    <MapPopup>
                        <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                            <strong>Live Location</strong>
                            <br />
                            Lat: {props.latitude.toFixed(5)}
                            <br />
                            Lng: {props.longitude.toFixed(5)}
                        </div>
                    </MapPopup>
                </MapMarker>
            </Map>
        </div>
    );
};
