var net = require('net');
var Iconv  = require('iconv').Iconv;
//var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');

var CKIPhost = '140.109.19.104';
var CKIPport = 1501;
var CKIPaccount = "sj910202";
var CKIPpassword = "sj1011";

var client = new net.Socket();
var CKIPterm = [];
var xmldataformat = function (insertString) {
    var xmldata = '<?xml version="1.0" encoding="Big5"?>' +
        '<wordsegmentation version="0.1">' +
        '<option showcategory="1" />' +
        '<authentication username="' +CKIPaccount+ '" password="'+ CKIPpassword +'" />' +
        '<text>' + insertString + '</text>' +
        '</wordsegmentation>';
    var iconv = new Iconv('utf-8', 'Big5');
    return iconv.convert(xmldata);
}

module.exports = {

    setCKIP:function(host,port,account,password){
        CKIPhost = host;
        CKIPport = port;
        CKIPaccount = account;
        CKIPpassword = password;
    },

    connectToCKIP: function(){
        if(CKIPhost && CKIPport && CKIPaccount && CKIPpassword)
        client.connect(CKIPport, CKIPhost, function () {
            console.log('CONNECTED TO: ' + CKIPhost + ':' + CKIPport);
        });
        else{
            console.log("Do setCKIP before connectToCKIP, and check any data is filled.");
        }
    },

    sendToCKIP : function(str){
        client.write(xmldataformat(str));
    },

    waitForCKIP: function(resCallback,res){
            client.on('data', function (data) {
                var iconv = new Iconv('Big5', 'utf-8');
                var finaldata = iconv.convert(data).toString();
                //translate XML to JS object
                var parser = new xml2js.Parser(xml2js.defaults["0.4"]); // get the 0.1 defaults in version 0.2
                parser.parseString(finaldata, function (err, doc) {
                    console.log(doc.wordsegmentation.result[0].sentence[0]);
                    var sentence = "";
                    for (var j=0;j<doc.wordsegmentation.result[0].sentence.length;j++){
                        sentence += doc.wordsegmentation.result[0].sentence[j];
                    }
                    console.dir(sentence);
                    sentence = sentence.substr(1);
                    var datePart =sentence.split(/\s+/);
                    console.dir(datePart);
                    for(var i=0; i<datePart.length; i++){
                        var group = datePart[i].match(/(\S*)\((\S*)\)/);
                        var term = {};
                        console.log(datePart[i]);
                        console.log(group);
                        term.term = group[1];
                        term.tag = group[2];
                        console.dir(term);
                        CKIPterm.push(term);
                    }
                });
                console.log('DATA: ' + CKIPterm);
                // Close the client socket completely
                /*
                 fs.writeFile("./xmldata", finaldata, function (err) {
                 if (err) {
                 console.log(err);
                 } else {
                 console.log("The file was saved!");
                 }
                 });
                 */
               // client.destroy();
               // return returnResponse(finaldata);
                if(resCallback && typeof(resCallback)==="function" )
                   if(resCallback(res,CKIPterm))
                       CKIPterm.length = 0;
            });
    }
}