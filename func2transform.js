// let example = function(data){
//   return new Date().toISOString() + ' ' + Math.trunc(Math.random() * (Math.pow(2,16))).toString(16) + ' ' + data + '\n'
// }

// let example = function(str){ return Math.sqrt(parseInt(str)) }

//might use this append lines and flush strategy from https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
//but I feel like this probably works for like a kilobyte at a time. If network stream can do a kb at a time, why wouldn't file streams I wonder what it depends on.
// lol what if it created a utility with its own man pages. that'd be cool. probably require global installation of that argv things tho so. hm. an option.'
// how about a weird counterpart, some readstream generators. Like a setInterval for command line. Heartbeat kind of stuff. 
// takes a function, returns a program that executes that function . you can probably also just console.log things, since those go to stdout.
// options: how often + max invocations



  let funcString = ''
  let funcName = ''

  console.log('give me a function defintion, hit return when you\'re done')
  let repl = require('repl')
  
  repl.start({prompt: '> ', eval: myEval});

  function myEval(cmd, context, filename, callback){
    if(!funcString){
      console.log("Thank you for your function.")
      try {
        console.log(`Trying: yourFunction("99 luftballoons\\n")`)
        console.log('> ' + eval(cmd)("99 luftballoons\n") )
        funcString = cmd.trim()
        callback('seems to work great, what do you want to call it?')
      } catch (e){
        callback(e + '\n' + "Please try again, I believe in you.")
      }
    } else {
      funcName = cmd.trim()
      console.log(`${funcName} is a terrific name. I'll save it to disk as ${funcName}.js\nPipe things to it like so: "echo 99luftballoons | node ${funcName} > newFile.txt"`)
      writeProgram(funcName, funcString)
      process.exit()
    }
  }


function writeProgram(funcName, funcString){
  let lineSep = JSON.stringify(require('os').EOL)
  require('fs').writeFileSync(`${funcName}.js`, 
`let {Readable, Writable, Transform} = require('stream')
  function func2Transform(func, options = {lineSep: ${lineSep}, joinChar: ","}){
    let sanitizedFunc = stringifyByType(func, options)
    let theTransform = new Transform()
    theTransform._transform = function(chunk, encoding, done){
      let newData = chunk.toString().split(options.lineSep).map(sanitizedFunc).join(options.lineSep)
      this.push(newData)
      done()
    }
    return theTransform
  }

  function stringifyByType(func, options){
      return function(oldData){
      let newData = func(oldData)
        if(!newData){ // takes care of null and undefined 
          return ''
        } else if(Array.isArray(newData)){
          return newData.join(options.joinChar) + options.linesep
        } else if(typeof newData == 'object'){
          return JSON.stringify(newData) + options.linesep
        } else {
          return newData.toString()
        }
    }
  }

  process.stdin.pipe(func2Transform(eval(${funcString}))).pipe(process.stdout)`)
}