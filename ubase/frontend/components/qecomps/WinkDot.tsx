import React from "react";

type WinkDotProps = {
    color?:
    | "green"
    | "yellow"
    | "red"
    | "blue"
    | "purple"
    | "pink"
    | "sky"
    | "orange";
    size?: number;
};

export const colorMap = {
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    pink: "bg-pink-400",
    sky: "bg-sky-400",
    orange: "bg-orange-400",
};

export const WinkDot: React.FC<WinkDotProps> = ({ color = "green", size = 2.5 }) => {
    const sizeClass = `w-${size} h-${size}`;

    return (
        <div className="inline-grid *:[grid-area:1/1]">
            <div className="inline-grid *:[grid-area:1/1]">
                <div
                    className={`rounded-full ${colorMap[color]} ${sizeClass} animate-ping`}
                ></div>
                <div
                    className={`rounded-full ${colorMap[color]} ${sizeClass}`}
                ></div>
            </div>
        </div>
    );
};
