//////////////////////////////////////////////////////////////////////
// Adding text field
var AWS = require("ti.aws");
var namelbl = Ti.UI.createLabel({
	color:'blue',
  text: 'Name',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 10, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(namelbl);

var nametxt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: '#336699',
  	top: 10, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(nametxt);

/////////////////////
// Your number
var phonelbl = Ti.UI.createLabel({
	color:'blue',
  text: 'Phone #',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 60, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(phonelbl);

var phonetxt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: '#336699',
  	top: 60, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(phonetxt);

/////////////////////
// Lovers number
var lover_phone_lbl = Ti.UI.createLabel({
	color:'blue',
  text: 'Lover\'s #',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 110, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(lover_phone_lbl);

var lover_phone_txt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: '#336699',
  	top: 110, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(lover_phone_txt);


//////////////////////////////////////////////////////////////////////
// Adding register button

var button = Ti.UI.createButton({
	title: 'Register',
	top: 160,	
	width: 100,
	height: 50
});

function add_a_lover(table_name, lover_details)
{
	var params = {
			'RequestJSON' : {
				"TableName" : table_name,
				"Item" : {
					"dummy" : { "N" : '1'}, //Required
					"id" : { "S" : lover_details['id']}, //Required
					'name' : { 'S' : lover_details['name']},
					'phone': { 'S' : lover_details['phone']}
				}
			} //Required
		};
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});	
}

function create_lovers_table(table_name)
{
	AWS.DDB.createTable({
        "RequestJSON" : {
            "TableName" : table_name,
            "Region": "us-west-2",
            "KeySchema" : {
                    "HashKeyElement" : {
                    "AttributeName" : "dummy",
                    "AttributeType" : "N"
                },
                    "RangeKeyElement" : {
                    "AttributeName" : "phone",
                    "AttributeType" : "S"
                }
            },
            "ProvisionedThroughput" : {
                "ReadCapacityUnits" : 1,
                "WriteCapacityUnits" : 1
            }
        }
    },
    function(data, response){
        Ti.API.info(JSON.stringify(data));
    },
    function(message, error) {
        Ti.API.error(message);
        Ti.API.info(JSON.stringify(error));
    });	
}

function check_fields()
{
	if(nametxt.value == "")
	{
		alert('Can\'t register without a name');
		return false;
	}
	if(phonetxt.value == "")
	{
		alert("Please enter a phone number to register");
		return false;
	}
	return true;
	
}

function handle_lover_found(response)
{
	response["data"]["Responses"]["lovers"]["Items"][0]["name"]["S"];
	alert(nametxt.value+': you love '+ JSON.stringify(response["data"]["Responses"]["lovers"]["Items"][0]["name"]["S"])+ '?');
	Ti.API.info(JSON.stringify(response));
	lover_details = {
		'dummy': 1,
		'id': guid(),
		'name': nametxt.value,
		'phone': phonetxt.value
	};
	alert('writing '+lover_details['id']+' '+lover_details['name']+' '+lover_details['phone']);
	add_a_lover("lovers", lover_details);	
}

function handle_no_lover_found(error)
{
	alert(nametxt.value+': ooh, it seems your lover has not registered yet :(');	
	Ti.API.info(JSON.stringify(error));	
}

function fetch_lover_details(phone)
{	
	var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"N":"1"}, "RangeKeyElement":{"S":"'+phone+'"}}],"AttributesToGet":["name", "id"]}}}}';
	
			
	AWS.DDB.batchGetItem(JSON.parse(params),
			
		function(data, response) {
		handle_lover_found(response);
  	},  function(message,error) {				
		handle_no_lover_found(error);
	});			
}	

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

button.addEventListener('click', function(e){	
	AWS.authorize('AKIAIX5POYG6QZNZHRVA', 'UTyP0FYscLPhdAukw+kBw+Y8hNMLNw4GLjmEQ5y3');
	//create_lovers_table(AWS, "lovers");
	
	if (check_fields())
	{		
		fetch_lover_details(lover_phone_txt.value);		
	}		
});

Ti.UI.currentWindow.add(button);
