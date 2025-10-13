export default function DesktopIcon(props: { id: any, icon: any, label: any, onOpen: any }) {
    return (
        <c-cc
            onClick={() => props.onOpen(props.id)}
            className="gap-1 p-2 rounded hover:bg-white/20 cursor-pointer transition-colors w-20 "
        >
            <c-cc className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg text-white shadow-lg">
                {props.icon}
            </c-cc>
            <f-11 className=" text-white font-semibold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
                {props.label}
            </f-11>
        </c-cc>
    )
}
