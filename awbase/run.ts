import { App } from './libs/bridge';

(async () => {

    await App.Init();
    await App.initUDB();
    await App.Connect({public:true})

})();

