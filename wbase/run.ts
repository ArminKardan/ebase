import { App } from './libs/bridge';

(async () => {

    console.clear()
    await App.Init(false);
    await App.initUDB();
    await App.Connect({public:true})

    
    // nexus.on.channel("mychannel", async specs=>{
        
    // })

    // nexus.on.direct(async specs=>{

    // })
    // global.nexus.msgreceiver = async (msg) => {
    //     console.log("MSG:", msg)
    // }


    // App.rest.get('/', (req, res) => {
    //     res.json({ code: 0 });
    // });

    // App.on("test", async (specs) => {
    //     return { code: 0 }
    // })

})();


