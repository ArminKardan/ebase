var import_bridge = require("./libs/bridge");
(async () => {
  await import_bridge.App.Init();
  await import_bridge.App.initUDB();
  await import_bridge.App.Connect({ public: true });
})();
