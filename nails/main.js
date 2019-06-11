let _sandbox = {};
let nails = {};
let _eventMap = {};
function executeNailsCommand(command) {
    if (command.includes('+')) {
        var numbers = command.split('+');
        numbers.forEach(function (item, index) {
            numbers[index] = Number.parseInt(item.replace(/[^0-9]/, ''));
        });
        return add(numbers);
    }
}

function executeNailsFunction(func, params) {
    if (_sandbox.userspace.hasOwnProperty(func)) {
        return _sandbox.userspace[func](params);
    } else {
        alert('function is not safe to execute');
    }
}
function add(params) {
    let num = 0;
    for (let number in params) {
        num += Number.parseInt(params[number]);
    }
    return num;
}
function fail(message) {
    throw "nailsJS failed, because nails " + message;
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function addFunctionToSandbox(func) {
    if (isFunction(func)) {
        _sandbox.userspace[func.name] = func;
    } else {
        console.log("couldnt add function to sandbox");
    }
}
function setupSandbox(render) {
    _sandbox.version = 1.0;
    _sandbox.vendor = "nailsJS";
    _sandbox.math = {};


    //User crafted stuff goes in here
    _sandbox.userspace = {};
    _sandbox.userspace.render = render;


    addFunctionToSandbox(add);
    let divide = function (numbers) {

        return Number.parseInt(numbers[0]) / Number.parseInt(numbers[1]);
    }

    addFunctionToSandbox(divide);


}

function getArguments(str) {
    var pattern = /\(([^}]+)\)/;
    return str.match(pattern)[0];

}



function wireClick() {
    let Click = function (id, callback) {
        console.log(_eventMap);
        _eventMap[id] = callback;
       
    }

    document.addEventListener('click', function (event) {
        // console.log('Click called by sender: ' + event.target.id);
        event.preventDefault();
        if(event.target.id === null){
            //console.log('Body detected bail..');
            return;
            
        }
        if(_eventMap.hasOwnProperty(event.target.id)){
                _eventMap[event.target.id](event);
            
        }
    }, false);


    nails.Click = Click;
}

function startNails() {
    //Gatther a list of all elements which have nailsJS enabled.
    //Nails enabled are those elements with the nails-active attribute
    //Nails command are embedded in two %
    //For instance <h1 value=%1+1%></h1> would result in <h1>2</h2>
    let root = _sandbox.userspace.render;

    var list = root.childNodes;
    var activeElements = [];

    root.childNodes.forEach(function (item, index) {
        //console.log(item, index);
        try {
            var a = item.getAttribute('nails-active');
            var b = item.getAttribute('nails');
            if (a === "") {
                activeElements.push(item)
            }
        } catch (exception) {
            // console.log('Couldnt find attribute')
        }
    });
    wireClick();


    activeElements.forEach(function (item, index) {

        let pattern = /^((%.+%))$/

        var nailsCommand = item.getAttribute('nails');
        if (pattern.test(nailsCommand)) {
            console.log(nailsCommand + ' is a nails command!');
            var val = executeNailsCommand(nailsCommand);
            if (item.innerHTML != "") {
                var sanitized = sanitizeString(val);
                item.innerHTML = item.innerHTML.replace('%0', sanitized);
            } else {
                item.innerHTML = val;
            }
        } else {
            //This is not an shortcut command
            //try to execute this as an function

            let args = getArguments(nailsCommand);

            nailsCommand = nailsCommand.replace(args, "");
            args = args.replace('(', '');
            args = args.replace(')', '');
            args = args.split(',')

            var val = executeNailsFunction(nailsCommand, args);
            if (item.innerHTML != "") {
                var sanitized = sanitizeString(val);

                item.innerHTML = item.innerHTML.replace('%0', sanitized);
            } else {
                var sanitized = sanitizeString(val);

                item.innerHTML = sanitized;
            }
        }


    });


}


function sanitizeString(str) {
    if (typeof str === 'string') {
        str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
        return str.trim();
    } else {
        return str;
    }

}

function init() {
    console.log("NailsJS V1.0.0");

    //Search for the render attribute on the body

    let entry = document.getElementsByTagName("render");
    if (entry.length < 1) {
        fail("couldn't find a valid entry point. Please include the render tag somewhere on the page")
    }
    if (entry.length > 1) {
        fail('found more than one entry point, which is currently not supported.');
    }

    //Still alive, initialize sandbox


    setupSandbox(entry[0]);

    //console.log(_sandbox.add([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

    var test = function (param) {
        alert(param);

        return "TEST OK"
    }

    addFunctionToSandbox(test);


    startNails();


}

init();



