import JSZip from "jszip";
import { saveAs } from "file-saver";

export default (text, contentname, zipname) => {
    // Create a new instance of JSZip
    const zip = new JSZip();

    // Add a text file (a.txt) with some content
    zip.file(contentname, text);

    // Generate the ZIP file
    zip.generateAsync({ type: "blob" }).then((blob) => {
        // Trigger the download of the ZIP file
        saveAs(blob, zipname + ".zip");
    });
};