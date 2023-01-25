import { DOMParser } from 'xmldom'
import xpath from 'xpath'

(async function(){
    const url = "https://www.willuhn.de/products/hibiscus-server/changelog.php"
    const response = await fetch(url)
    const htmlStr = await response.text();

    const warnCallback = function(w){console.log('FUCK '+w)}
    const parser = new DOMParser({
        errorHandler: {warning: warnCallback, error: warnCallback,fatalError: warnCallback}
    });
    const xmlDoc = parser.parseFromString(htmlStr, "text/html");

    
    const done = []
    function traverse(node) {
        done.push(node)
        const len = node.childNodes?.length ?? 0;
        console.log(node.nodeType + " " + node.nodeName+" with "+len+" children.")
        for (let i = 0; i < len; i++) {
            const child = node.childNodes.item(i);
            const isnew = done.indexOf(child)<0
            if (isnew) {
                traverse(child)
            } else {
                console.log(child.nodeType + " " + child.nodeName+" (circular)")
            }
        }
    }
    //traverse(xmlDoc)
    const path = xpath.parse('//pre/text()');
    const data = path.select({node: xmlDoc, isHtml: true})
    console.log("got "+data.length+" results")
    const [releaseDate,,version] = data[0].data.split("\n")[0].split(" ");
    console.log({releaseDate, version})
})()