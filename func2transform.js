
let funcString = ''
let funcName = ''

console.log(process.argv.slice(2).join(' ').toString())
if(process.argv.length > 2){
	testFunc(process.argv.slice(2).join(' '),console.log.bind(console))
}

if(!funcString){
	console.log('give me a function defintion, hit return when you\'re done')
}

let repl = require('repl')

repl.start({prompt: '> ', eval: myEval});

function myEval(cmd, context, filename, callback){
	if(!funcString){
		testFunc(cmd, callback)
	} else {
		funcName = cmd.trim()
		console.log(`${funcName} is a terrific name. I'll save it to disk as ${funcName}.js\nPipe things to it like so: "echo 99luftballoons | node ${funcName} > newFile.txt"`)
		writeProgram(funcName, funcString)
		process.exit()
	}
}

function testFunc(funcInput, done){
	console.log("Thank you for your function.")
	try {
		console.log(`Trying: yourFunction("99 luftballoons\\n")`)
		console.log('> ' + eval(funcInput)("99 luftballoons\n") )
		funcString = funcInput.trim()
		done('Well it didn\'t throw an error. what do you want to call it?')
	} catch (e){
		done(e + '\n' + "Please try again, I believe in you.")
	}
}


function writeProgram(funcName, funcString){
	require('fs').writeFileSync(`${funcName}.js`, 
`let {Readable, Writable, Transform} = require('stream')
function func2Transform(func, options = {lineSep: require('os').EOL, joinChar: ","}){
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
		if(!oldData.trim()) return ''
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

process.stdin.pipe(func2Transform(${funcString})).pipe(process.stdout)`)}