Ti.include('notifications.js');
user_msgs_retrieved = false;
lover_msgs_retrieved = false;
user_final_messages = [];
lover_final_messages = [];
NUM_RECORDS = 4;

function if_msgs_fetched(ui_cb_after_merging_messages_for_display)
{
	if(user_msgs_retrieved==true && lover_msgs_retrieved==true)	
	{		
		user_msgs_retrieved = false;
		lover_msgs_retrieved = false;
		merge_messages();		
		ui_cb_after_merging_messages_for_display();		
	}		
}

function init_structs()
{
	user_msgs_retrieved = false;
	lover_msgs_retrieved = false;
	user_final_messages = [];
	lover_final_messages = [];	
	blurCalled = false;	
	var button = null;
}

function add_remaining_messages(cur_ptr, remaining_messages)
{
	for(x=cur_ptr;x<remaining_messages.length;x++)
	{
		Ti.API.info(' adding LOVER EMOTION inn ----->'+JSON.stringify(remaining_messages[x]));
		//final_messages.push(remaining_messages[x]);
		put_message_in_global(remaining_messages[x]);
	}	
}

function get_last_msg_timestamp(message_list, total_messages)
{
	if (message_list.length > 0)
		return message_list[message_list.length-1]['timestamp'];
	else
	{
		if(total_messages ==0) return '0';
		else return '-1'; 
	}
}

function merge_messages()
{
	
	Ti.API.info('==================================\nIn merge message --->');
	last_timestsamp = get_last_msg_timestamp(user_final_messages, total_user_messages);
	if (last_timestsamp=='-1')
		new_user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
	else
		Ti.App.Properties.setString('last_user_msg_timestamp', last_timestsamp);
		
	last_timestsamp = get_last_msg_timestamp(lover_final_messages, total_lover_messages);
	if (last_timestsamp=='-1')
		new_lover_timestamp = Ti.App.Properties.getString('last_lover_msg_timestamp');
	else
		Ti.App.Properties.setString('last_lover_msg_timestamp', last_timestsamp);		
		
	total_msgs = lover_final_messages.length + user_final_messages.length;
	user_ptr = 0;
	lover_ptr = 0;
	for(i=0;i<total_msgs;i++)
	{
		if (lover_ptr == lover_final_messages.length)
		{							
			add_remaining_messages(user_ptr, user_final_messages);
			break;
		}					
		if (user_ptr == user_final_messages.length)
		{	
			add_remaining_messages(lover_ptr, lover_final_messages);			
			break;	
		}		
		if(lover_final_messages[lover_ptr]['timestamp'] < user_final_messages[user_ptr]['timestamp'])
		{
			//final_messages.push(lover_final_messages[lover_ptr]);
			put_message_in_global(lover_final_messages[lover_ptr]);
			Ti.API.info(' adding LOVER EMOTION ----->'+JSON.stringify(lover_final_messages[user_ptr]));			
			lover_ptr += 1;
		}
		else
		{
			//final_messages.push(user_final_messages[user_ptr]);
			put_message_in_global(user_final_messages[user_ptr]);
			//if (user_final_messages[user_ptr]['emotion'])
			Ti.API.info(' adding EMOTION ----->'+JSON.stringify(user_final_messages[user_ptr]));
			user_ptr += 1;						
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

function fetch_messages(phone, last_timestamp, callback, ui_cb_after_merging_messages_for_display)
{	
	var params = {
			"RequestJSON" : {
				"TableName" : 'messages',
				//"IndexName":"to-timestamp-index",
				"HashKeyValue" : {
					"S" : phone
				},	
				"RangeKeyCondition": {
					"AttributeValueList":[{"N":last_timestamp}],"ComparisonOperator":"GT"
				},
				"Limit": NUM_RECORDS		
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

function add_message(emotion_type, msg_text)
{
	var milliseconds = (new Date).getTime();
	cur_time = milliseconds.toString();
	var params = {
			'RequestJSON' : {
				"TableName" : 'messages',
				"Item" : {
					"from" : { "S" : Ti.App.Properties.getString('phone')}, //Required					
					'to' : { 'S' : Ti.App.Properties.getString('lover_phone')},
					'timestamp': { 'N' : cur_time},					
					'emotion': { 'N' : emotion_type.toString()}										
				}
			} //Required
		};	
	if (emotion_type == 0)
	{
		params['RequestJSON']["Item"]['message'] = 	{'S': msg_text};
	}
			
	Ti.API.info('add_message: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		Ti.API.info(JSON.stringify(response));
		message_new = {'from': Ti.App.Properties.getString('phone'),
			'to': Ti.App.Properties.getString('lover_phone'),
			'emotion': emotion_type.toString(),
			'txt':msg_text,
			'from_me':true,
			'timestamp': cur_time
		};
		put_message_in_global(message_new);		
		Ti.App.current_msg = msg_text;
		Ti.App.current_full_msg = message_new;			
		//_post_message_send_notification_and_update_views();
		Ti.App.win1.fireEvent('focus');
		send_notification(emotion_type, Ti.App.current_msg);
		Ti.App.Properties.setString('last_user_msg_timestamp', message_new['timestamp']);		
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