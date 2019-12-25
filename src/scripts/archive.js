

const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)

const archiver = require('archiver')

const FILTER = {
    get items(){
        return this._items
    },
    set items(array){
        this._items = array
    },
    _items: ['node_modules', 'out', 'dist'],
}


const dir = c => c.cwd+'archived/' // this is the dir used to house archives which are named for the repo chosen

const directory = (config, toast) => new Promise((res, rej) => {
    fs.mkdir(dir(config), () => run(dir(config), config, res, rej, toast))
})

module.exports = { directory }





/**
 * @description read directory, filter unwanted contents and compress the rest to a directory
 * 
 * @param {String} dir path to put the compressed/zip file EX: /home/user/repo/archived/ 
 * @param {Object} config EX: {cwd: "/home/user/repo/", name: "project_name"}

 * @param {Function} res function to resolve
 * @param {Function} rej function to reject
 * @param {Function} toast function to send human messages back
 */
async function run(dir, config, res, rej, toast){   console.dir(dir);  console.dir(config);

    const { cwd, name } = config

    // create a file to stream archive data to.
    const output = fs.createWriteStream(dir+name+'.zip')
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    })
    
    const repo_path = cwd+name
    const contents = await readdir(repo_path)
    
    const filtered = contents.filter(entity => !FILTER.items.includes(entity))

    for(const index in filtered){

        const item = filtered[ index ]
        
        const path = `${repo_path}/${item}`
        
        // check if item is a file
        if(item.includes('.')){
            
            archive.file(path, false)
        }
        else {

            // check if really a directory or just a file without a .
            const check = (await stat( path )).isDirectory()

            if(check){
                
                archive.directory(path, false)
            }
            else {
                
                archive.file(path, false)
            }
        }
    }

    output.on('close', () => res(`🎉 Compressed ${name} to ${dir} (${archive.pointer()} bytes)`))

    //output.on('end', () => res(`🎉 Compressed ${name} to ${dir} (${archive.pointer()} bytes)`))

    archive.on('warning', console.warn)

    archive.on('error', err => rej(err))

    archive.pipe(output)

    archive.finalize()
}