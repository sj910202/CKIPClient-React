var net = require('net');
//var Iconv  = require('iconv').Iconv;
//var fs = require('fs');
var parseString = require('xml2js').parseString;


var HOST = '140.109.19.104';
var PORT = 1501;

var client = new net.Socket();


var CKIP = function(insertString) {

    var insertString = insertString;

    var xmldataformat = function () {
        //    var insertString = " 中華民國成立後，即將清朝的「學部」改名為「教育部」，當時底下有「承政廳」、「普通教育司」、「專門教育司」及「社會教育司」，從事國內教育興革相關工作。至1926年3月，國民政府於廣州成立後，再由「教育行政委員會」接管相關任務。";
        var xmldata = '<?xml version="1.0" encoding="Big5"?>' +
            '<wordsegmentation version="0.1">' +
            '<option showcategory="1" />' +
            '<authentication username="sj910202" password="sj1011" />' +
            '<text>' + insertString + '</text>' +
            '</wordsegmentation>';
        var iconv = new Iconv('utf-8', 'Big5');
        return iconv.convert(xmldata);
    }


    function submitTextToCKIP () {
        console.log("test");
        client.connect(PORT, HOST, function () {
            console.log(xmldataformat(insertString));
            console.log('CONNECTED TO: ' + HOST + ':' + PORT);
            // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client

            client.write(xmldataformat(insertString));
        });

        client.on('data', function (data) {
            var iconv = new Iconv('Big5', 'utf-8');
            var finaldata = iconv.convert(data);
            //translate XML to JS object
            parseString(finaldata, function (err, result) {
                console.dir(result.wordsegmentation.result[0].sentence[0]);
                var regexp = new RegExp(/\S/);
                console.log(regexp.exec(result.wordsegmentation.result));
            });

            console.log('DATA: ' + finaldata);
            // Close the client socket completely
            fs.writeFile("./xmldata", finaldata, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });

            client.destroy();

        });
        client.on('close', function () {
            console.log('Connection closed');
        });
    }

    //submitTextToCKIP();


}

module.exports = CKIP;
    /*
    client.connect(PORT, HOST, function () {
        console.log(xmldataformat());
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client

        client.write(xmldataformat(), function (data) {
            if (data) {
                console.log("True");
            } else {
                console.log('False');
            }
        });

    });


    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    client.on('data', function (data) {
        var iconv = new Iconv('Big5', 'utf-8');
        var finaldata = iconv.convert(data);
        //translate XML to JS object
        parseString(finaldata, function (err, result) {
            console.dir(result.wordsegmentation.result[0].sentence[0]);
            var regexp = new RegExp(/\S/);
            console.log(regexp.exec(result.wordsegmentation.result));
        });

        console.log('DATA: ' + finaldata);
        // Close the client socket completely
        fs.writeFile("./xmldata", finaldata, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });

        client.destroy();

    });

    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Connection closed');
    });
    */

