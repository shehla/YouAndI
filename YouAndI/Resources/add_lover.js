var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);


///////////////////
// Welcome message
var welcome_lbl = Ti.UI.createLabel({
	color:'blue',
  text: 'Welcome '+Ti.App.Properties.getString('name')+' :)',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 20, left: 60,
  width: 250, height: 40
});
Ti.UI.currentWindow.add(welcome_lbl);

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

function check_lover_entered()
{
	return !(lover_phone_txt.value == '');
}

function user_updated_while_adding_lover()
{
	alert('Rad! lover updated');
}

function lover_updated_while_adding_lover()
{
	
}

// When:
//		1. Lover existed and sent a request for THIS user earlier
function update_lover_record(lover, callback)
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
		Ti.API.info('Update query ->'+JSON.stringify(params));
		AWS.DDB.updateItem(params,
			
			function(data, response) {
				Ti.API.info('Update ->'+JSON.stringify(response));
				callback();
	
	  	},  function(message,error) {
				Ti.API.info(JSON.stringify(error));
	
		});	
}

//////////////////////////////////////////////////////////////////////
// Adding register button

var button = Ti.UI.createButton({
	title: 'Request Lover',
	top: 160,	
	width: 100,
	height: 50
});

function get_user_from_global()
{
	return {'name': Ti.App.Properties.getString('name'),
		'phone': Ti.App.Properties.getString('phone')};
	
}

button.addEventListener('click', function(e){				
	// Did user enter name and phone?	
	if (check_lover_entered())
	{			
		user_details = get_user_from_global();
		user_details['lover_phone'] = lover_phone_txt.value;
		fetch_lover_details(user_details['lover_phone']);		
	}
	else
	{
		alert('Please enter name and phone number to proceed.');
	}		
});
Ti.UI.currentWindow.add(button);

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
	user_details = get_user_from_global();	
	msg = "";
	if (response["data"]["Responses"]["lovers"]["Items"].length > 0)
	{
		lover_ddb = response["data"]["Responses"]["lovers"]["Items"][0];
		Ti.API.info(' Lover -> '+ JSON.stringify(lover_ddb));
		lover = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);							
		// BINGO! The lover already sent a request for THIS guy.
		if (lover['lover_phone'] == user_details['phone'])
		{
			// Add the new entry for THIS user			
			user_details['status'] = '2';
			// Update lover record (status and lover_phone)
			lover['status'] = 2;
			update_lover_record(user_details, user_updated_while_adding_lover);
			update_lover_record(lover, user_updated_while_adding_lover);
		}
		// The lover has not sent a request for this guy
		else{
			// Send a request to the lover from THIS guy			
			user_details['status'] = '1';
			// TODO: send an email to lover						
			update_lover_record(user_details, user_updated_while_adding_lover);			
		}				
		add_user("lovers", user_details, msg);
	}
	// Lover doesn't exist in DDB
	else
	{
		// TODO: Add a check if the lover is already in love with someone else ;) (check for status=1)
		Ti.API.info(user_details['name']+': ooh, it seems your lover has not registered yet :(');			
		alert(user_details['name']+': ooh, it seems your lover has not registered yet :(');
		Ti.App.Properties.setString("is_logged_in", "true");
		user_details['lover_phone'] = lover_phone_txt.value;
		user_details['status'] = '1';		
		update_lover_record(user_details, lover_updated);
	}
}
