@echo off
cd ..
node -e "const fs = require('fs'); const path = require('path'); function safeFile(filePath, text) {const dir = path.dirname(filePath); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(filePath, text, 'utf8');}; (async () => {console.log('syncing...'); const response = await fetch('https://qepal.com/api/sync/get', {method: 'POST',body: JSON.stringify({ type: 'wpy' })});const json = await response.json(); if (json.code === 0) {for (const file of json.files) {safeFile(file.path, file.value);}}; console.log('syncing finished.');})();"

exit