// jshint esversion: 6, asi: true, laxcomma: true
const fs = require('fs')
const dir = c => c.cwd+'archived/' // this is the dir used to house archives which are named for the repo chosen

const directory = (config, toast) => new Promise((res, rej) => 
    fs.mkdir(dir(config), () => run(dir(config), config, res, rej, toast)))

module.exports = { directory }




function run(dir, config, res, rej, toast){   console.dir(dir);  console.dir(config);

    let bank = 0
    const { cwd, name } = config

    const archiver = require('archiver')

    // create a file to stream archive data to.
    const output = fs.createWriteStream(dir+name+'.zip')
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    })

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () => res(`🎉 Archived ${name} to ${dir} (${archive.pointer()}B)`))

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => res(`🎉 Archived ${name} to ${dir} (${archive.pointer()}B)`))

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', err => err.code === 'ENOENT' ? console.warn(err) : console.error(err))

    // good practice to catch this error explicitly
    archive.on('error', err => rej(err))

    if(typeof toast === 'function'){
        archive.on('data', buf => {
            bank += buf.length
            toast(`Archiving, wrote ${bank}`)
        })
    }

    // pipe archive data to the file
    archive.pipe(output)

    // append files from a directory, putting its contents at the root of archive
    archive.directory(cwd+name, false)

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize()
}