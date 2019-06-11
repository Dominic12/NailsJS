//Entry Point for the Nails engine.

function addFunctionToNails(func){
    if (isFunction(func)) {
        _sandbox.nails.commands[func.name] = func;
    } else {
        console.log("couldnt add function to nails commands");
    }
}
function loadCommands(){
    addFunctionToNails(add);
    addFunctionToNails(divide);
    addFunctionToNails(concat);
    let test = function(params){
        console.log('hi, im executed')
        console.log(params);
    }

    addFunctionToNails(test);
}

function exec(command){
    let parsedCommand = command.split(' ');
    if(_sandbox.nails.commands.hasOwnProperty(parsedCommand[0])){
        var descriptor = parsedCommand.shift();
        console.log(parsedCommand);
       return _sandbox.nails.commands[descriptor](parsedCommand)
    }
}

function setUpSandbox(){
    console.log('Setting up Sandbox for shell access');
    _sandbox.nails = {};
    _sandbox.nails.commands = {};
    _sandbox.nails.commands.testSandbox = function(){
        console.log('Sandbox integrity test started..');
        if(_sandbox.hasOwnProperty('nails') && _sandbox.hasOwnProperty('userspace')){
            console.log('Integrity Test passed!');
        }else{
            fail('could not vertify sandbox');
        }
    }
    _sandbox.nails.commands.testSandbox();
    //if passed, we get on here..
    loadCommands();
}
function init(){
    //Nails must already be initialzied,
    //We check that using the _sandbox object;
    if(typeof _sandbox === 'undefined'){
        throw 'Nails engine needs to be initialized after main.js';
    }
    console.log('Initializing Nails Engine V1.0');
    setUpSandbox();
}

init();