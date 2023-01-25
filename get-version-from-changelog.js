import { DOMParser } from 'xmldom'
import xpath from 'xpath'
import fs from 'fs'

(async function(){
    const url = "https://www.willuhn.de/products/hibiscus-server/changelog.php"
    const response = await fetch(url)
    const htmlStr = await response.text();

    const warnCallback = function(w){console.log('FUCK '+w)}
    const parser = new DOMParser({
        errorHandler: {warning: warnCallback, error: warnCallback,fatalError: warnCallback}
    });
    const xmlDoc = parser.parseFromString(htmlStr, "text/html");
    const path = xpath.parse('//pre/text()');
    const data = path.select({node: xmlDoc, isHtml: true})
    console.log("got "+data.length+" results")
    const [releaseDate,,version] = data[0].data.split("\n")[0].split(" ");
    console.log({releaseDate, version})
    fs.writeFile('release-version', version, err=>{
        if (err) {
            console.error("could not write release-version");
            console.error(err);
        }
    })
})()