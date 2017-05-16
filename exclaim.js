let {Readable, Writable, Transform} = require('stream')
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

process.stdin.pipe(func2Transform(each => each + '!')).pipe(process.stdout)