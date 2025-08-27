import path from "path"
import importer from "@/frontend/components/qecomps/importer"
import SerialGenerator from "@/frontend/components/qecomps/SerialGenerator"


export const APIERLoop = async ()=>{
    if (!global.API) global.API = {} as any

    if (!API?.["system/request"]) {
        console.log("starting APIs...")
    }
    if (global.devmode) {
        let list = getAllFiles("./backend/API", '')
        if (!global.apifilecount) {
            global.apifilecount = list.length
        }
        else if (global.apifilecount != list.length) {
            let conf = fs.readFileSync("./next.config.mjs", "utf8")
            for (let c of conf.split("\n")) {
                if (c.startsWith("//RESTARTER VALUE:")) {
                    conf = conf.replace(c, "//RESTARTER VALUE:" + SerialGenerator(5))
                    fs.writeFileSync("./next.config.mjs", conf)
                    global.apifilecount = list.length
                }
            }
        }
        let m = importer("./backend/ROOT/apier.ts") as typeof import('@/backend/ROOT/apier')
        m.Refresh(list)
    }
    else if (!global.apilistset) {
        let list = getAllFiles("./backend/API", '')
        let m = importer("./backend/ROOT/apier.ts") as typeof import('@/backend/ROOT/apier')
        m.Refresh(list)
        global.apilistset = true;
    }
}


export default async () => {
    setInterval(async () => {
        await APIERLoop()
    }, 10000)
}





function getAllFiles(dirPath, rootPath) {
    let results = [];
    const items = fs.readdirSync(dirPath);
    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const relativePath = fullPath.replace(rootPath, '');
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getAllFiles(fullPath, rootPath));
        } else {
            results.push(relativePath.replace(/\\/g, '/').slice(7).slice(0, -3).replace("/API/", "/api/"));
        }
    });
    return results;
}
