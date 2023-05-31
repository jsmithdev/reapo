

import fs from 'fs'
import util from 'util'
import archiver from 'archiver';

const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)


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

export const directory = (config, window) => new Promise((res, rej) => {
    fs.mkdir(dir(config), () => run(dir(config), config, window))
})



/**
 * @description read directory, filter unwanted contents and compress the rest to a directory
 * 
 * @param {String} dir path to put the compressed/zip file EX: /home/user/repo/archived/ 
 * @param {Object} config EX: {cwd: "/home/user/repo/", name: "project_name"}

 * @param {Function} res function to resolve
 * @param {Function} rej function to reject
 * @param {Function} toast function to send human messages back
 */
async function run(dir, config, window){

    const { cwd, name, responder } = config

    // create a file to stream archive data to.
    const output = fs.createWriteStream(`${dir}${name}_${new Date().getTime()}.zip`)
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    })
    
    const repo_path = cwd+name
    const contents = await readdir(repo_path)
    
    const filtered = contents.filter(entity => !FILTER.items.includes(entity))

    for(const index in filtered){

        const item = filtered[ index ]
        
        const path = `${repo_path}/${item}`
        
        const isDirectory = (await stat( path )).isDirectory()
        
        if(isDirectory){

            archive.directory(path, item)
        }
        else {

            archive.file(path, { name: item })
        }
    }

    output.on('close', () => window.webContents.send(responder, `🎉 Compressed ${name} to ${dir} (${archive.pointer()} bytes)`))

    archive.on('warning', console.warn)

    archive.on('error', err => window.webContents.send('error', err))

    archive.pipe(output)

    archive.finalize()
}