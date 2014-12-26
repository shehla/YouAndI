var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
LABEL_LENGTH = 35;
//messages_from = fetch_messages(Ti.App.Properties.getString('phone'));
//fetch_messages(Ti.App.Properties.getString('phone'));
//simple_get();

function extract_messages(msg_response, from_me)
{
	msgs = [];
	for(i=0;i<msg_response.length;i++)
	{
		msg = msg_response[i];
		msg = {'from': msg['from']['S'],
			'to': msg['to']['S'],
			'emotion': 0,
			'txt': msg['message']['S'],
			'from_me':from_me,  
			'timestamp': parseInt(msg['timestamp']['N'])};	
		msgs.push(msg);
	}			
	return msgs;
}

//my_msgs = extract_messages(fetch_messages(Ti.App.Properties.getString('phone')));
//lover_msgs = extract_messages(fetch_messages(Ti.App.Properties.getString('lover_phone')));
fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs);
fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs);
//alert('msgs->'+JSON.stringify(msgs));
user_msgs_retrieved = false;
lover_msgs_retrieved = false;
final_messages = [];
user_final_messages = [];
lover_final_messages = [];
function if_msgs_fetched()
{
	if(user_msgs_retrieved==true && lover_msgs_retrieved==true)	
	{
		merge_messages();	
	}	
}
// sort and merge messages to form recent messages.
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
			lover_ptr += 1;
			if (lover_ptr == lover_final_messages.length)
			{
				for(x=user_ptr;x<user_final_messages.length;x++)
					final_messages.push(user_final_messages[x]);
				break;
			}			
		}
		else
		{
			final_messages.push(user_final_messages[user_ptr]);
			Ti.API.info(' adding User ----->'+JSON.stringify(user_final_messages[user_ptr]));
			user_ptr += 1;			
			if (user_ptr == user_final_messages.length)
			{
				for(x=lover_ptr;x<lover_final_messages.length;x++)
					final_messages.push(lover_final_messages[x]);
				break;	
			}			
		}
	}
	render_messages();
}

function get_user_msgs(response)
{
	user_msgs_retrieved = true;
	Ti.API.info('User msgs -->' +JSON.stringify(response));
	user_final_messages = extract_messages(response["data"]["Items"],true);
	Ti.API.info(' User -----> '+JSON.stringify(msgs));
	if_msgs_fetched();
}

function get_lover_msgs(response)
{
	lover_msgs_retrieved = true;
	Ti.API.info('Lover msgs -->' +JSON.stringify(response));
	lover_final_messages = extract_messages(response["data"]["Items"],false);
	Ti.API.info('Lover -----> '+JSON.stringify(msgs));
	if_msgs_fetched();	
}

function fetch_messages(phone, callback)
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
		callback(response);		
  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});				
}	

function add_message(milliseconds)
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
		add_messages_to_view(final_messages[final_messages.length-1]);		

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});	
}

var textArea = Ti.UI.createTextField({
  borderWidth: 2,
  borderColor: '#bbb',
  borderRadius: 5,
  color: 'black',
  backgroundColor:'white',
  font: {fontSize:20, fontColor:'black'},
  keyboardType: Ti.UI.KEYBOARD_DEFAULT,
  returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
  textAlign: 'left',
  //value: 'I am a textarea',
  top: 425,
  left:5,
  width: 250, height : 25
});
Ti.UI.currentWindow.add(textArea);
/*
textArea.addEventListener('focus', function() {
    Ti.UI.currentWindow.animate({bottom: 166, duration:500});
});
 
textArea.addEventListener('blur', function() {
    Ti.UI.currentWindow.animate({bottom: 0, duration:500});
});
*/
var button = Ti.UI.createButton({
	title: 'Send',
	color:'white',
	top: 425,
	left: 260,	
	width: 50,
	height: 25
});
Ti.UI.currentWindow.add(button);

button.addEventListener('click', function(e){				
	// Did user enter name and phone?
	if (textArea.value != '')
	{	
		var milliseconds = (new Date).getTime();
		Ti.API.info('User: '+Ti.App.Properties.getString('phone')+' Sending message: '+textArea.value+' to lover->'+Ti.App.Properties.getString('lover_phone')+' at time->'+milliseconds);
		
		add_message(milliseconds);
	}
	else
	{
		alert('Please enter a message to send.');
	}		
});
//////////////////////////////////////////////////////

var scrollView = Ti.UI.createScrollView({
  contentWidth: 'auto',
  contentHeight: 'auto',
  showVerticalScrollIndicator: true,
  showHorizontalScrollIndicator: true,
  top:0,
  height: 420,
  //height: '80%',
  //width: '80%'
});
var view = Ti.UI.createView({
  //backgroundColor:Ti.App.Properties.getString('back_color'),
  //backgroundImage: 'background_iphone5.jpg',
  borderRadius: 10,
  top: 0,
  height: 0,
  //width: 1000
});


top_global = 10;

function render_messages()
{
	for(i=0;i<final_messages.length;i++)
	{
		
		add_messages_to_view(final_messages[i]);
	}
}



scrollView.add(view);
//Ti.UI.currentWindow.add(table);
Ti.UI.currentWindow.add(scrollView);

function add_messages_to_view(message)
{
		view.height = view.height + LABEL_LENGTH;
		if(message['emotion'] == 0)
		{
			var namelbl = Ti.UI.createLabel({
				color:Ti.App.Properties.getString('text_color'),
			  text: message['txt'],  
			  borderRadius: 8,
			  //backgroundColor: 'white',
			  borderWidth: 0,
			  backgroundPaddingLeft: 5,
			  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			  top: top_global,
			  //width: 280,
			  height: 5
			});
			if (message['from_me'])
			{
				namelbl.left=5;
			}
			else
			{
				namelbl.right=5;
			}
			view.add(namelbl);
			top_global = top_global + LABEL_LENGTH;
		}
		else
		{
			var image1 = Ti.UI.createImageView({		  
			  top: top_global,		  
			  height: 60,
			  width:60
			});
			if (message['from_me'])
			{
				image1.left=5;
			}
			else
			{
				image1.right=5;
			}
			
			if(message['emotion'] == 1)
				image1.image='love.jpeg';
			else if(final_messages['emotion'] == 2)
				image1.image='miss_u.png';
			
			top_global = top_global + 60;
			view.add(image1);		
		}
	}