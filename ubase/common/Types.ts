
declare global {

    type OutToneKeyType = "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "angry"
    type OutToneTitleType = "رسمی" | "دوستانه" | "تحقیقی" | "دستوری" | "عاطفی" | "عصبانی"
    type PolicyKindType = "smart" | "database" | "text"
    type PolicyType = {
        pid: string,
        name: string,
        type: PolicyKindType,
        desc: string,
        priority: number,
        in: Array<any>,
        pre: {
            modify: Array<ModifyType>,
            inject: Array<InjectType>,
        },
        post: {
            modify: Array<ModifyType>,
            inject: Array<InjectType>,
        },
        prompt: string,
        texts: [],
        aid: string,
        bid: string,
        tone: { key: OutToneKeyType, title: OutToneTitleType, icon: string },
        out: Array<any>
    }

    type SchemaType = {
        name: string,
        desc: string,
        unit: string,
        type: "explanation" | "boolean" | "limited" | "description",
        critical: boolean,
        important: boolean
    }

    type BrainType = {
        bid: string,
        job: string,
        key: string,
        name: string,
        brain: string,
        trigger: string,
        type: "smart" | "database" | "text",
        isolated: boolean,
        multiple: boolean,
        repressed: boolean,
        suppressor: boolean,
        priority: number,
        schema: Array<SchemaType>,
        policies: Array<PolicyType>
    }

    type ModifyType = { type: "replace" | "smart", prompt?: string, regex?: string, new?: string }
    type InjectType = { type: "pre" | "post", prompt?: string, text?: string }

    type AdminType = {
        servid: string,
        name: string,
        aiworksfor: string,
        context: string,
        aid: string,
        brains: Array<BrainType>,
        gateways: Array<GatewayType>,
        helptext?: string,
        modify: Array<ModifyType>,
        inject: Array<InjectType>
    }


    type ChatType = { type?:"text"|"photo", photourl?:string, text: string, from: "ai" | "system" | "user" | "policy" | "tone" | "data" }


    type ChannelInMessageType = {
        type: "message" | "ready" | "qr",
        from: string,
        text: string,
        env: EnvironmentType,
        alias: string
    }

    type SessionType = {
        id?: string,
        fromid?: string,
        startedby?: "they" | "me",
        gateway?: GatewayType,
        chats?: Array<ChatType>,
        dbinfo?: any,
        userinfo?: any,
        maxAge?: number,
        createdAt?: number,
        lastDataSent?: Array<any>,
        helptextsent?: boolean,
        dataConversationHistory?: Array<{ from: "user" | "ai", text }>,
        conversationHistory?: Array<{ from: "user" | "ai", text }>,
        targetDataIndex?: number,
        phase?: "notfound" | "askforget" | "dataout"
    }

    type ToneType = "formal" | "casual" | "inquisitive" | "assertive" | "emotional" | "offensive" | "angry"
    type EnvironmentType = "telegram" | "whatsapp" | "eita" | "bale" | "igap" | "sorosh" | "divarchat" | "debug" | "website"

    type InTTypes = "startedby" | "tone" | "profileimage" | "conversation" | "criticaldata" | "counter" | "textcondition" |
        "website" | "call" | "sms" | "whatsapp" | "telegram" | "sorosh" | "mooncalendar" | "suncalendar" | "grecalendar"
        | "bale" | "eita" | "divarchat" | "divar" | "suspicious" | "support" | "brainhistory" | "gateway" | "removefilter"

    type ProfileImageType = "notpossible" | 'noprofile' | 'male' | 'female' | 'logo' | 'baby' | 'gym' | 'medical' | 'islam' | 'building' | 'car'
        | 'jewelry' | 'animal' | 'pool' | 'office' | 'education' | 'nature' | 'instruments' | 'electronics' | 'food' | 'cigar' | 'camera' | 'code' | 'military';
    type InTStartedByType = { id: string, type: InTTypes, icon: string, title: string, value: "they" | "me" };

    type InTToneType = { id: string, type: InTTypes, icon: string, title: string, values: Array<ToneType> };
    type InTProfileImageType = { id: string, type: InTTypes, icon: string, title: string, values: Array<ProfileImageType> };
    type InTConversationType = { id: string, type: InTTypes, icon: string, title: string, count: number, admincount: number, usercount: number, prompt: string };
    type InTCriticalDataType = { id: string, type: InTTypes, icon: string, title: string };
    type InTGlobalCounterType = { id: string, type: InTTypes, icon: string, title: string, values: Array<{ varname: string, max: number, min: number }> };
    type InTTextConditionType = { id: string, type: InTTypes, icon: string, title: string, pattern: string };
    type InTTimeLimitType = { id: string, type: InTTypes, icon: string, title: string, values: Array<string> };
    type InTWebsiteType = { id: string, type: InTTypes, icon: string, title: string, domain1: string, domain2: string, domain3: string, domain4: string, domain5: string };
    type InTCallType = { id: string, type: InTTypes, icon: string, title: string, phonepattern: string };
    type InTSMSType = { id: string, type: InTTypes, icon: string, title: string, phonepattern: string };
    type InTWhatsappType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTTelegramType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTEitaType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTBaleType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTIGAPType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTSoroshType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTDivarChatType = { id: string, type: InTTypes, icon: string, title: string, fromid: string };
    type InTDivarType = { id: string, type: InTTypes, icon: string, title: string, value: "myads" | "otherads" | "both" };
    type InTSupportType = { id: string, type: InTTypes, icon: string, title: string, value: "myads" | "otherads" | "both" };
    type InTSuspiciousType = { id: string, type: InTTypes, icon: string, title: string, min: number };
    type InTMoonCalendarType = {
        id: string, type: InTTypes, icon: string, title: string, values: [string, string],
        months: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean,],
        sun: boolean, mon: boolean, tue: boolean, wed: boolean, thu: boolean, fri: boolean, sat: boolean, weekend: boolean
    };
    type InTSunCalendarType = {
        id: string, type: InTTypes, icon: string, title: string, values: [string, string],
        months: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean,],
        sun: boolean, mon: boolean, tue: boolean, wed: boolean, thu: boolean, fri: boolean, sat: boolean, weekend: boolean
    };
    type InTGreCalendarType = {
        id: string, type: InTTypes, icon: string, title: string, values: [string, string],
        months: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean,],
        sun: boolean, mon: boolean, tue: boolean, wed: boolean, thu: boolean, fri: boolean, sat: boolean, weekend: boolean
    };
    type InTBrainHistoryType = { id: string, type: InTTypes, icon: string, title: string, bid: string, name: string, max: number, min: number };
    type InTGatewayType = { id: string, type: InTTypes, icon: string, title: string, env: EnvironmentType, channel: string, app: string, resource: string, name: string, alias: string };
    type GatewayType = { icon: string, env: EnvironmentType, channel: string, app: string, resource: string, name: string, alias: string };

}