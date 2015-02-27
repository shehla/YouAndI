user_msgs_retrieved = false;
lover_msgs_retrieved = false;
final_messages = [];
user_final_messages = [];
lover_final_messages = [];

function if_msgs_fetched(ui_cb_after_merging_messages_for_display)
{
	if(user_msgs_retrieved==true && lover_msgs_retrieved==true)	
	{
		merge_messages();				
		ui_cb_after_merging_messages_for_display();		
	}		
}

function init_structs()
{
	user_msgs_retrieved = false;
	lover_msgs_retrieved = false;
	final_messages = [];
	user_final_messages = [];
	lover_final_messages = [];	
	blurCalled = false;
	var textArea = null;
	var button = null;
}

function merge_messages()
{
	total_msgs = lover_final_messages.length + user_final_messages.length;
	user_ptr = 0;
	lover_ptr = 0;
	for(i=0;i<total_msgs;i++)
	{
		if(lover_final_messages[lover_ptr]['timestamp'] < user_final_messages[user_ptr]['timestamp'])
		{
			final_messages.push(lover_final_messages[lover_ptr]);
			Ti.API.info(' adding LOVER EMOTION ----->'+JSON.stringify(lover_final_messages[user_ptr]));			
			lover_ptr += 1;
			if (lover_ptr == lover_final_messages.length)
			{				
				for(x=user_ptr;x<user_final_messages.length;x++)
				{
					Ti.API.info(' adding LOVER EMOTION inn ----->'+JSON.stringify(user_final_messages[x]));
					final_messages.push(user_final_messages[x]);
				}
				break;
			}			
		}
		else
		{
			final_messages.push(user_final_messages[user_ptr]);
			//if (user_final_messages[user_ptr]['emotion'])
			Ti.API.info(' adding EMOTION ----->'+JSON.stringify(user_final_messages[user_ptr]));
			user_ptr += 1;			
			if (user_ptr == user_final_messages.length)
			{				
				for(x=lover_ptr;x<lover_final_messages.length;x++)
				{
					//if (user_final_messages[x]['emotion'])
					Ti.API.info(' adding EMOTION inn ----->'+JSON.stringify(lover_final_messages[x]));
					
					final_messages.push(lover_final_messages[x]);
				}
				break;	
			}			
		}
	}	
	
}

function get_user_msgs(response, ui_cb_after_merging_messages_for_display)
{
	user_msgs_retrieved = true;
	Ti.API.info('User msgs -->' +JSON.stringify(response));
	user_final_messages = extract_messages(response["data"]["Items"],true);
	Ti.API.info(' User -----> '+JSON.stringify(msgs));
	if_msgs_fetched(ui_cb_after_merging_messages_for_display);
}

function get_lover_msgs(response, ui_cb_after_merging_messages_for_display)
{
	lover_msgs_retrieved = true;
	Ti.API.info('Lover msgs -->' +JSON.stringify(response));
	lover_final_messages = extract_messages(response["data"]["Items"],false);
	Ti.API.info('Lover -----> '+JSON.stringify(msgs));
	if_msgs_fetched(ui_cb_after_merging_messages_for_display);	
}

function mock_fetch_messages(phone, callback, ui_cb_after_merging_messages_for_display)
{
	response = {
		"data": {
			"Items": [
				{
					'message': {'S':'mock message 1'},
					'emotion': {'N': 0},
					'from': {'S': phone},
					'to': {'S': '217819112'},
					'timestamp': {'N': 12132131}
				}
			]
		}
	};
	callback(response, ui_cb_after_merging_messages_for_display);
}

function fetch_messages(phone, callback, ui_cb_after_merging_messages_for_display)
{	
	var params = {
			"RequestJSON" : {
				"TableName" : 'messages',
				//"IndexName":"to-timestamp-index",
				"HashKeyValue" : {
					"S" : phone
				},	
				"RangeKeyCondition": {
					"AttributeValueList":[{"N":"0"}],"ComparisonOperator":"GT"
				}			
			} //Required
		};	
		Ti.API.info(JSON.stringify(params));
	AWS.DDB.query(params,
			
		function(data, response) {
		//alert('Success: '+ JSON.stringify(response));
		callback(response, ui_cb_after_merging_messages_for_display);		
  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});				
}	

function add_message(milliseconds, _post_message_send_notification_and_update_views)
{
	cur_time = milliseconds.toString();
	var params = {
			'RequestJSON' : {
				"TableName" : 'messages',
				"Item" : {
					"from" : { "S" : Ti.App.Properties.getString('phone')}, //Required					
					'to' : { 'S' : Ti.App.Properties.getString('lover_phone')},
					'timestamp': { 'N' : cur_time},
					'message': { 'S' : textArea.value}						
				}
			} //Required
		};
		
			
	Ti.API.info('add_message: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		Ti.API.info(JSON.stringify(response));
		final_messages.push({'from': Ti.App.Properties.getString('phone'),
			'to': Ti.App.Properties.getString('lover_phone'),
			'emotion': 0,
			'txt':textArea.value,
			'from_me':true,
			'timestamp': cur_time
		});
		Ti.App.global_messages = final_messages;		
		_post_message_send_notification_and_update_views();
  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});	
}


function extract_messages(msg_response, from_me)
{
	msgs = [];
	for(i=0;i<msg_response.length;i++)
	{
		msg = msg_response[i];
		if(msg['message'])
			txt_msg = msg['message']['S'];
		else
			txt_msg = '';		
		if(msg['emotion'])
		{			
			this_emotion = parseInt(msg['emotion']['N']);
		}
		else
			this_emotion = 0;
		msg_dict = {'from': msg['from']['S'],
			'to': msg['to']['S'],
			'emotion': this_emotion,
			'txt': txt_msg,
			'from_me':from_me,  
			'timestamp': parseInt(msg['timestamp']['N'])};	
		msgs.push(msg_dict);
	}			
	return msgs;
}