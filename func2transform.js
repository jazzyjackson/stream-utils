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


let {Readable, Writable, Transform} = require('stream')


function func2Transform(func, options = {lineSep: "\r\n", joinChar: ","}){
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

  let funcString = ''

  console.log('give me a function defintion, hit return when you\'re done')
  let repl = require('repl')
  
  repl.start({prompt: '> ', eval: myEval});

  function myEval(cmd, context, filename, callback){
    funcString = cmd
    console.log("Thank you for your function.")
    try {
      console.log(`Trying: yourFunction("99 luftballoons\\n")`)
      console.log('> ' + eval(cmd)("99 luftballoons\n") )
      console.log('seems to work great')
      process.exit()
    } catch (e){
      callback(e + '\n' + "Please try again, I believe in you.")
    }
  }



// let rs = new Readable()

// for(let i = 0; i < 37; i++){
//   rs.push(i.toString())
// }

// rs.push(null)

// process.stdin.setEncoding('utf8');
// process.stdin.pipe(process.stdout)

// process.stdin.pipe(func2Transform(each => parseInt(each) * 2)).pipe(process.stdout)


// process.stdin.pipe(f2t(str => Math.sqrt(parseInt(str)))).pipe(f2t(str => {
//   if(Number(str) == parseInt(str)){
//     return str
//   }
// })).pipe(process.stdout)

