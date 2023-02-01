const fs = require("fs");

function jsonReader(filePath, cb) {
    fs.readFile(filePath, "utf-8", (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    })
}


/* jsonReader("./data.json", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data[0]);
        const objectString = JSON.stringify(data[0]);
        console.log("String " + objectString)
    }
})

fs.writeFile("./data_new.json", JSON.stringify(newObject, null, 2), err => {
    if (err) {
        console.log(err);
    } else {
        console.log("File successfully written!");
    }
}) */


/* jsonReader("./data.json", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        data.shift();
        fs.writeFile("./data.json", JSON.stringify(data, null, 2), err => {
            if (err) {
                console.log(err)
            }
        })

    }
}) */


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


var i = 1;                  //  set your counter to 1

function myLoop() {         //  create a loop function
    setTimeout(function () {   //  call a 3s setTimeout when the loop is called
        jsonReader("./data.json", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data.shift();
                fs.writeFile("./data.json", JSON.stringify(data, null, 2), err => {
                    if (err) {
                        console.log(err)
                    }
                })

            }
        });
        i++;                    //  increment the counter
        if (i < 10) {           //  if the counter < 10, call the loop function
            myLoop();             //  ..  again which will trigger another 
            jsonString = fs.readFileSync("./data.json", "utf-8");
            jsonStringFirst = JSON.parse(jsonString)[0];
            console.log(jsonStringFirst);
        }                       //  ..  setTimeout()
    }, 3000)
}

myLoop();                   //  start the loop




/*

delay(1000).then((

) =>

    jsonReader("./data.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data.shift();
            fs.writeFile("./data.json", JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.log(err)
                }
            })

        }
    })

); */





/* fs.readFile('./data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    } else {

        try {
            const data = JSON.parse(jsonString);
            console.log(data[0])
            data.shift();
            console.log(data);
        } catch (err) {
            console.log("Error parsing JSON", err);
        }


    }
    //  console.log('File data:', jsonString)
}) */