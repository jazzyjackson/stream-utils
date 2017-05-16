// this takes 1 to 3 arguments. 
// 1: func. return program that invokes the function and returns the result to stdout. process.stdout.write()
// 2: interval in ms, func. setInterval, invoke function and write output to stdout
// 3: interval, number of tries, function expression.
// Basically we'll test if each argument can be coerced to a number, assign them to an object if so, assign them to a function stream if not.
let i = 0;

let theInterval = setInterval(()=>{
    i += 0.05
    // let paddingLeft = Math.sin(Date.now() % Math.PI) + 1
    let paddingLeft = Math.tan(i % (2 * Math.PI)) + 20
    let output = ''
    let index = 0;
    while(index < paddingLeft){
      index += 0.1
      output += ' '
    }
    output += ':D'


    console.log(output)
    // process.stdout.write(output)
    // process.stdout.write('\0')
}, 10)

