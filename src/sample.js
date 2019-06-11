var add;
var divide;
var concat;

add = function(params){
    let num = 0;
    for(let i in params){
        num += params[i];
    }
    return num;
}

divide = function(numbers){
    return Number.parseInt(numbers[0]) / Number.parseInt(numbers[1]);
}

concat = function(strings){
    let result = "";
    strings.forEach(function(element) {
        if(typeof element !== 'undefined'){
            result += element + " ";
        }
      });

    return result;
}