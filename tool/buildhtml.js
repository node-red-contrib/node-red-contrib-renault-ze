const fs =require('fs');
const path = require('path');

function copyFile(filename, joinfiles, srcpath, dstpath){

    let src = path.join(srcpath, filename);
    let dst = path.join(dstpath, filename);
    console.log(src, dst);
    let content = fs.readFileSync(src, 'utf8');

    for (const item of joinfiles) {
        let joincontent = fs.readFileSync(path.join(dstpath, item), 'utf8');

        content = '<script type="text/javascript">\r\n'
            + joincontent.replace('Object.defineProperty(exports, "__esModule", { value: true });','')
            +'\r\n</script>\r\n\r\n'
            + content
                .replaceAll('<html','<script')
                .replaceAll('</html>','</script>');
        fs.unlinkSync(path.join(dstpath, item));
    }
    fs.writeFileSync(dst, content, 'utf8')
}

var searchpath = 'src/';
var exportpath = 'nodes/'

var entries = fs.readdirSync(searchpath);
var dstentries = fs.readdirSync(exportpath);

for (i = 0; i < entries.length; i ++)
{
    let item = entries[i];
    let fullpath = path.join(searchpath, item);
    if (!fs.lstatSync(fullpath).isDirectory())
    {
        if (item.toLocaleLowerCase().endsWith('.html'))
        {
            let joinfiles = [];
            for (j = 0; j < dstentries.length; j++){
                let item2 = dstentries[j];
                let fullpath2 = path.join(exportpath, item2);
                if (!fs.lstatSync(fullpath2).isDirectory())
                {
                    if (item2.toLocaleLowerCase().startsWith(item.toLocaleLowerCase())
                    && item2.toLocaleLowerCase() != item.toLocaleLowerCase()) {
                        joinfiles.push(item2);
                    }
                }
            }
            console.log(item, joinfiles);
            copyFile(item, joinfiles, searchpath, exportpath);
        }
    }
}


