//////////////////////////////////////////////////////////////////////
// Adding text field
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

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

function add_user(table_name, user_details, msg)
{
	var params = {
			'RequestJSON' : {
				"TableName" : table_name,
				"Item" : {
					"status" : { "N" : user_details['status']}, //Required					
					'name' : { 'S' : user_details['name']},
					'phone': { 'S' : user_details['phone']}						
				}
			} //Required
		};
		
	if (user_details['lover_phone'] && user_details['lover_phone'] != '' && typeof(user_details['lover_phone'] != 'undefined'))
	{
		params["RequestJSON"]["Item"]["lover_phone"] = {};
		params["RequestJSON"]["Item"]["lover_phone"]["S"] = user_details['lover_phone'];
	}
			
	Ti.API.info('add_user: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		if(msg != '' && typeof(msg) != 'undefined')
		{
			alert('Horray! '+msg);
		}
		Ti.API.info(JSON.stringify(response));
		login_user();

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

function check_basic_fields()
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

function check_lover_entered()
{
	return !(lover_phone_txt.value == '');
}

// When:
//		1. Lover existed and sent a request for THIS user earlier
function update_lover_record(lover)
{
	var params = {
				'RequestJSON' : {
					"TableName" : 'lovers',
					"Key" : {
						"HashKeyElement" : {
							"S" : lover['phone']
						},
					},
					"AttributeUpdates" : {
						"lover_phone" : {
							"Value" : {
								"S" : lover['lover_phone']
							},
							"Action" : "PUT"
						},
						"status" : {
							"Value" : {
								"N" : lover['status'].toString()
							},
							"Action" : "PUT"
						}						
					},
					"ReturnValues" : "ALL_NEW"
				}
				//Required
			};
	
		AWS.DDB.updateItem(params,
			
			function(data, response) {
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				Ti.API.info(JSON.stringify(error));
	
		});	
}

function get_user_details()
{
	user_details = {			
		'name': nametxt.value,
		'phone': phonetxt.value
	};
	if(lover_phone_txt.value != '' && typeof(user_details['lover_phone'] != 'undefined'))
	{
		user_details['lover_phone'] = lover_phone_txt.value; 
	}
	return user_details;
}

function login_user()
{
	Ti.App.Properties.setString("is_logged_in", "request_sent");
	Ti.App.Properties.setString("username", nametxt.value);	
}

// Take the Dynamo response object and fill a plain dict object 
function extract_lover_details(lover_ddb)
{
	lover = {'name': lover_ddb['name']['S'],
		'phone': lover_ddb['phone']['S'],
		'status': parseInt(lover_ddb['status']['N'])};
	if (lover_ddb['lover_phone'])
	{
		lover['lover_phone'] = lover_ddb['lover_phone']['S'];
	}	
	return lover;
}

// When:
//     	1. User pressed the register btn
// 		2. All name, phone and lover fields are entered
function handle_lover_found(response)
{	
	// The lover exists in DDB
	user_details = get_user_details();
	msg = "";
	if (response["data"]["Responses"]["lovers"]["Items"].length > 0)
	{
		lover_ddb = response["data"]["Responses"]["lovers"]["Items"][0];
		Ti.API.info(' Lover -> '+ JSON.stringify(lover_ddb));
		lover = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);							
		// BINGO! The lover already sent a request for THIS guy.
		if (lover['lover_phone'] == phonetxt.value)
		{
			// Add the new entry for THIS user			
			user_details['status'] = '2';
			// Update lover record (status and lover_phone)
			lover['status'] = 2;
			update_lover_record(lover);			
		}
		// The lover has not sent a request for this guy
		else{
			// Send a request to the lover from THIS guy			
			user_details['status'] = '1';
			// TODO: send an email to lover			
			msg = 'Good news! You\'re lover has registered and we are sending a request ;)';			
		}				
		add_user("lovers", user_details, msg);
	}
	// Lover doesn't exist in DDB
	else
	{
		// TODO: Add a check if the lover is already in love with someone else ;) (check for status=1)		
		alert(nametxt.value+': ooh, it seems your lover has not registered yet :(');
		Ti.App.Properties.setString("is_logged_in", "true");					
		user_details['status'] = '1';		
		add_user("lovers", user_details);

	}
}

function render_request_window()
{
	request_win = Ti.UI.createWindow({		
		url: 'request_window.js'	
	});
	request_win.open();
}

function handle_no_lover_found(message, error)
{	
	alert('ERROR: '+message);
	Ti.API.info(JSON.stringify(error));	
}

function fetch_lover_details(phone)
{	
	var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+phone+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	Ti.API.info(params);
	
			
	AWS.DDB.batchGetItem(JSON.parse(params),
			
		function(data, response) {
		handle_lover_found(response);
  	},  function(message,error) {				
		handle_no_lover_found(message, error);
	});			
}	

button.addEventListener('click', function(e){		
	//create_lovers_table(AWS, "lovers");
	
	// Did user enter name and phone?
	if (check_basic_fields())
	{	
		// Did user enter lover details?
		if (check_lover_entered())
		{	
			// Fetch lover details to see if lover already requested for THIS user
			fetch_lover_details(lover_phone_txt.value);
		}		
		// If user didn't enter a lover yet, just add him
		else
		{					
			msg = 'Cool, you can come and add a lover later :)';
			user_details = get_user_details();
			user_details['status'] = '0';
			add_user("lovers", user_details, msg);
		}
	}		
});

Ti.UI.currentWindow.add(button);
