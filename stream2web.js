const express = require('express');
const app = express();
const server = require('http').Server(app);

let browserBoot = {
  'darwin': 'open',
  'win32': 'start',
  'linus': 'xdg-open' //xdg-utils must be installed, might throw error.
}

app.get('/', (req,res)=>{
  // res.write('hello')
  // res.end()
  process.stdin.pipe(res)
})


let {execSync} = require('child_process')

server.listen(3000)
execSync(`${browserBoot[process.platform]} http://localhost:3000`)