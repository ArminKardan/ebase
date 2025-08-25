
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import { App } from './libs/bridge';
// global.wsdebug = true;
export type TelegramPCustom = {}

(async () => {

    console.clear()
    await App.Init(false);
    await App.initUDB();

    await App.Connect({ //if process args not available use this
        resource: process.env.RESOURCE || "default",
        image: "/files/app/robot.webp",
    })
    
    console.log("[nexus] connected.")

    global.nexus.msgreceiver = async (msg) => {
        console.log("MSG:", msg)
    }


    App.rest.get('/', (req, res) => {
        res.json({ code: 0 });
    });

    App.on("ping", async (specs) => {
        console.log("ping request from:", specs.uid)
        return { code: 0, pong: true }
    })

})();


