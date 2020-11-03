
function getData(cb) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=19&type=multiple");
    xhr.send();

    xhr.onreadystatechange = function() {
        console.log(this.readyState, this.status);
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        } else if (this.status != 200) {
            console.log("we have an error!", this.status);
        }
    };
}

function printDataToConsole(data) {
    console.log(data);
    console.log(data.response_code);
}

getData(printDataToConsole);