Ti.include('notifications.js');
fetched_messages = [];
NUM_RECORDS = 4;

function init_structs()
{
	fetched_messages = [];		
}

function get_last_msg_timestamp(message_list, total_messages)
{
	if (message_list.length > 0)
		return message_list[message_list.length-1]['timestamp'];
	else return 0;	
}


// this is the newest message timestamp
function get_newest_msg_timestamp(message_list, total_messages)
{
	if (message_list.length > 0)
		return message_list[0]['timestamp'];		
	else
		return 0; 	
}

function update_user_timestamps()
{
	last_timestsamp_user = get_last_msg_timestamp(fetched_messages);	
	// update timestamp only if there are new msgs recieved
	if(last_timestsamp_user != 0)
		Ti.App.Properties.setString('last_user_msg_timestamp', last_timestsamp_user);
	newest_timestsamp_user = get_newest_msg_timestamp(fetched_messages);
	// update timestamp only if there are new msgs recieved
	if(newest_timestsamp_user != 0)
		Ti.App.Properties.setString('newest_user_msg_timestamp', newest_timestsamp_user);		
}

function get_user_msgs(response)
{
	Ti.API.info('User msgs -->' +JSON.stringify(response));
	fetched_messages = extract_messages(response["data"]["Items"]);
	update_user_timestamps();
	Ti.API.info(' User -----> '+JSON.stringify(fetched_messages)+' newest time->'+Ti.App.Properties.getString('newest_user_msg_timestamp'));	
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

function fetch_messages(conversation_id, last_timestamp, ui_cb_after_merging_messages_for_display, query_type)
{	
	var params = {
			"RequestJSON" : {
				"TableName" : 'messages',
				//"IndexName":"to-timestamp-index",
				"HashKeyValue" : {
					"S" : conversation_id
				},	
				"RangeKeyCondition": {
					//"AttributeValueList":[{"N":last_timestamp}],"ComparisonOperator":"LT"
					"AttributeValueList":[{"N":last_timestamp}],"ComparisonOperator":query_type
				},
				"Limit": NUM_RECORDS,
				"ScanIndexForward": false	
			} //Required
		};	
		Ti.API.info(JSON.stringify(params));
	AWS.DDB.query(params,
			
		function(data, response) {
		get_user_msgs(response);
		ui_cb_after_merging_messages_for_display();		
  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});				
}	

function add_message(emotion_type, msg_text)
{
	conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
	var url = "http://52.0.12.121/cgi-bin/add_message.cgi?&conversation_id="+conversation_id+"&from="+Ti.App.Properties.getString('phone')+"&emotion="+emotion_type+"&message="+msg_text;
	Ti.API.info('sending notification :'+url);

	 var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {	 
	         Ti.API.info("Received text: " + this.responseText);
	         cur_timestamp = this.responseText.replace(/^\s+|\s+$/g, '');
				message_new = {'from': Ti.App.Properties.getString('phone'),
					'to': Ti.App.Properties.getString('lover_phone'),
					'emotion': emotion_type.toString(),
					'txt':msg_text,
					'from_me':true,
					'timestamp': cur_timestamp
				};
				// update user newest timestamp		
				put_message_in_global(message_new);					
				//_post_message_send_notification_and_update_views();		
				Ti.App.win1.fireEvent('focus');
				// Why do we have it here??		
				//send_notification(emotion_type, msg_text);
				Ti.App.Properties.setString('newest_user_msg_timestamp', message_new['timestamp']);
				Ti.API.info('Setting newest timestamp ->'+Ti.App.Properties.getString('newest_user_msg_timestamp'));						
	         
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {	         
	         alert('error 12:');
	     },
	     timeout : 5000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send();	
}


function extract_messages(msg_response)
{
	msgs = [];	
	for(i=0;i<msg_response.length;i++)
	{
		from_me = false;
		msg = msg_response[i];
		
		if(msg['from']['S'] == Ti.App.Properties.getString('phone'))
			from_me = true;
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
		msg_dict = {'conversation_id': msg['conversation_id']['S'],
			'from': msg['from']['S'],			
			'emotion': this_emotion,
			'txt': txt_msg,
			'from_me':from_me,  
			'timestamp': parseInt(msg['timestamp']['N'])};
		Ti.API.info('extracting msg from response -> '+msg_dict['from']+' '+ msg_dict['txt']+' '+msg_dict['from_me']);
		msgs.push(msg_dict);
		put_message_in_global(msg_dict);
	}			
	return msgs;
}