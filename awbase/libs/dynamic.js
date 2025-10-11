var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var dynamic_exports = {};
__export(dynamic_exports, {
  Loopez: () => Loopez
});
module.exports = __toCommonJS(dynamic_exports);
const Loopez = () => {
  if (!global.nexus)
    return;
  if (!global.nexus.agent || !global.nexus.agent.llms) {
    global.nexus.agent = { llms: { chatCompletion: {}, imagelassifier: {} } };
  }
  if (!global.nexus.agent.poster) {
    global.nexus.agent.poster = {};
    global.nexus.agent.poster.make = async (specs) => {
      let technologies = {};
      for (let tech of specs.technologies) {
        technologies[tech] = true;
      }
      let json = await nexus.api({
        app: "eposter",
        cmd: "make",
        body: {
          access: "icusdboe39c8b",
          api: "make",
          bgurl: specs.bgurl,
          iconurl: specs.iconurl,
          icontop: specs.iconsize == "large" ? "100px" : "150px",
          iconheight: specs.iconsize == "large" ? "300px" : "160px",
          service: specs.service,
          light: specs.light,
          lightcolor: specs.lightcolor,
          maintext: specs.maintext,
          focus: specs.focus,
          focuscolor: specs.focuscolor,
          subtext: specs.subtext,
          technologies,
          lang: "fa"
        }
      });
      return json;
    };
  }
  if (!global.nexus.agent.translate) {
    global.nexus.agent.translate = async (specs) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "translate-" + specs.engine,
        body: {
          source: specs.from,
          target: specs.to,
          text: specs.text
        }
      });
      if (json.status == 200) {
        return json.result;
      }
      return null;
    };
  }
  if (!global.nexus.agent.translate) {
    global.nexus.agent.translate = async (specs) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "translate-" + specs.engine,
        body: {
          source: specs.from,
          target: specs.to,
          text: specs.text
        }
      });
      if (json.status == 200) {
        return json.result;
      }
      return null;
    };
  }
  if (!global.nexus.agent.llms.chatCompletion.gemma34BQ8) {
    global.nexus.agent.llms.chatCompletion.gemma34BQ8 = async (specs) => {
      let json = await nexus.api({ app: "egemma3x4bxq8", cmd: "completions", body: specs });
      if (json.code == 200) {
        return json;
      }
      return null;
    };
  }
  if (!global.nexus.agent.llms.imagelassifier.gemma34BQ8) {
    global.nexus.agent.llms.chatCompletion.gemma34BQ8 = async (specs) => {
      let json = await nexus.api({ app: "egemma3x4bxq8", cmd: "imageclassify", body: specs });
      if (json.code == 200) {
        return json;
      }
      return null;
    };
  }
  if (!global.nexus.agent.llms.chatCompletion.gpt4o) {
    global.nexus.agent.llms.chatCompletion.gpt4o = async (specs) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "gpt35",
        body: {
          prompts: specs.prompts
        }
      });
      if (json.status == 200) {
        return json.result[0];
      }
      return null;
    };
  }
  if (!global.nexus.agent.llms.chatCompletion.gpt35) {
    global.nexus.agent.llms.chatCompletion.gpt35 = async (specs) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "gpt35",
        body: {
          prompts: specs.prompts
        }
      });
      if (json.status == 200) {
        return json.result[0];
      }
      return null;
    };
  }
  if (!global.nexus.agent.email) {
    global.nexus.agent.email = {};
    global.nexus.agent.email.send = async (to, subject, message) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "email-send",
        body: {
          to,
          subject,
          message
        }
      });
      return json;
    };
  }
  if (!global.nexus.agent.sms) {
    global.nexus.agent.sms = {};
    global.nexus.agent.sms.confirm = async (phone, code) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "sms-confirm",
        body: {
          phone,
          code
        }
      });
      return json;
    };
    global.nexus.agent.sms.modem = async (phone, text) => {
      let json = await nexus.api({
        app: "eagents",
        cmd: "sendsms-modem",
        body: {
          phone,
          text
        }
      });
      return json;
    };
  }
  if (!global.nexus.agent.ssh) {
    global.nexus.agent.ssh = {
      ping: async () => {
        let json = await nexus.api({
          app: "essh",
          cmd: "ping"
        });
        return json;
      },
      connect: async (specs) => {
        let json = await nexus.api({
          app: "essh",
          cmd: "connect",
          body: {
            host: specs.host,
            port: specs.port,
            username: specs.username,
            password: specs.password,
            salt: specs.salt,
            timeout: specs.timeout || 300
          }
        });
        return json;
      },
      disconnect: async (specs) => {
        let json = await nexus.api({
          app: "essh",
          cmd: "disconnect",
          body: {
            channelid: specs.channelid
          }
        });
        return json;
      },
      command: async (specs) => {
        let json = await nexus.api({
          app: "essh",
          cmd: "command",
          body: {
            channelid: specs.channelid,
            command: specs.input
          }
        });
        return json;
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Loopez
});
