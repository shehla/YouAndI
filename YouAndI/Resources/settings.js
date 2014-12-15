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


