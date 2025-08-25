import fs from 'fs'
import path from 'path'

function safeFile(filePath, text) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, text, 'utf8');
}

(async () => {
    console.log("syncing...")
    let json = await (await fetch("https://qepal.com/api/sync/get", {
        method: "POST", body: JSON.stringify({
            type: "x"
        })
    })).json()
    if (json.code == 0) {
        for (let file of json.files) {
            safeFile(file.path, file.value)
        }
    }
})()
