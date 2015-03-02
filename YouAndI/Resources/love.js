Ti.include('notifications.js');
Ti.include('fetch_messages.js');
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
LABEL_LENGTH = 35;
KEYBOARD_HEIGHT = 200;

// bug in titanium https://jira.appcelerator.org/browse/TIMOB-16496
blurCalled = false;
var textArea;
var button;
var scrollView;
var message_view;
var text_btn_view;

//refresh_messages_screen();

function render_UI()
{		 
	create_controls();
	add_textarea_and_send_btn();
	show_messages_on_view();
	scrollView.setContentOffset({x:0,y:message_view.getHeight()-450},{animated:false});		
	scrollView.setVisible(true);
	Ti.App.Properties.setString('controls_rendered','1');	
}

function create_controls()
{
	scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	  top:0,
	  height: 420,
	  visible: false,
	  //height: '80%',
	  //width: '80%'
	});
	message_view = Ti.UI.createView({
	  //backgroundColor:Ti.App.Properties.getString('back_color'),
	  //backgroundImage: 'background_iphone5.jpg',
	  borderRadius: 10,
	  top: 0,
	  height: 0,
	  //width: 1000
	});
	text_btn_view = Ti.UI.createView({
	  backgroundColor:'grey',
	  //backgroundImage: 'background_iphone5.jpg',
	  borderRadius: 10,
	  top: 420,
	  height: 30,	  
	  //width: 1000
	});
	message_view.addEventListener('click',function(e){    	
      	textArea.blur();    	
	});	
	
	scrollView.add(message_view);	
	Ti.App.win1.add(scrollView);	
	Ti.App.win1.add(text_btn_view);
	Ti.App.win1.addEventListener('focus', function(e){				
			this_msgs = eval(Ti.App.global_messages);
			if(Ti.App.num_msgs < this_msgs.length)
			{
				for(x=Ti.App.num_msgs;x<this_msgs.length;x++)
				{
					put_message_to_view(this_msgs[x]);
				}
				Ti.App.num_msgs = this_msgs.length;
			}
	});			
}

function init_startup_global_vars()
{
	total_user_messages = 0;
	total_lover_messages = 0;	
	top_global = 10;
}

function refresh_messages_screen()
{
	Ti.API.info('------------------------\n in refresh_messages_screen');
	init_structs();
	if (Ti.App.Properties.getString('controls_rendered')=='1')
	{		
		callback_for_UI	= show_messages_on_view;
	}
	else
	{	
		if (Ti.App.win1.getChildren().length > 0)
		{		
			for(i=0;i<Ti.App.win1.getChildren().length;i++)
				Ti.App.win1.remove(Ti.App.win1.children[i]);
		}
		init_startup_global_vars();
		callback_for_UI	= render_UI;
	}		
	if (Ti.App.Properties.getString('phone') != null && Ti.App.Properties.getString('lover_phone') != null)
	{
		last_user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
		last_lover_timestamp = Ti.App.Properties.getString('last_lover_msg_timestamp');
		
		fetch_messages(Ti.App.Properties.getString('phone'), last_user_timestamp, get_user_msgs, callback_for_UI);
		fetch_messages(Ti.App.Properties.getString('lover_phone'), last_lover_timestamp, get_lover_msgs, callback_for_UI);
		//mock_fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, render_UI);
		//mock_fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, render_UI);
	}
		
}
// sort and merge messages to form recent messages.

function update_view_keyboad_shut()
{	
    text_btn_view.top += KEYBOARD_HEIGHT;
	scrollView.top += KEYBOARD_HEIGHT;	
}

function add_textarea_and_send_btn()
{	
	message_view.height = message_view.height + 35;
	text_btn_view.height = text_btn_view.height + 35;
	textArea = Ti.UI.createTextField({
	  borderWidth: 2,
	  bubbleParent: false,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: 'black',
	  backgroundColor:'white',
	  font: {fontSize:20, fontColor:'black'},
	  //keyboardType: Ti.UI.KEYBOARD_DEFAULT,
	  //returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
	  textAlign: 'left',
	  //value: 'I am a textarea',
	  top: 5,
	  left:5,
	  width: 250, height : 25
	});
	text_btn_view.add(textArea);
	
	textArea.addEventListener('focus', function() {
	    text_btn_view.top -= KEYBOARD_HEIGHT;
	    scrollView.top = scrollView.top - KEYBOARD_HEIGHT;
	    //message_view.height = message_view.height - 200;// - text_btn_view.height;
	    //scrollView.scrollToBottom();
	});
	 
	textArea.addEventListener('blur', function() {
		if(blurCalled == false)
		{
	    	update_view_keyboad_shut();
	    	blurCalled = true;
	  	}
	  	else
	  	{
	  		blurCalled = false;
	  	}
	});
	button = Ti.UI.createButton({
		title: 'Send',
		color:'white',
		top: 5,
		bubbleParent: false,
		left: 260,	
		width: 50,
		height: 25
	});
	text_btn_view.add(button);
	
	button.addEventListener('click', function(e){				
		// Did user enter name and phone?
		if (textArea.value != '')
		{	
			var milliseconds = (new Date).getTime();
			Ti.API.info('User: '+Ti.App.Properties.getString('phone')+' Sending message: '+textArea.value+' to lover->'+Ti.App.Properties.getString('lover_phone')+' at time->'+milliseconds);
			
			add_message(milliseconds, post_message_send_notification_and_update_views);
		}
		else
		{
			alert('Please enter a message to send.');
		}		
	});
}

function post_message_send_notification_and_update_views()
{
	send_notification(0, textArea.value);
	put_message_to_view(final_messages[final_messages.length-1]);
	scrollView.scrollToBottom();	
	Ti.App.Properties.setString('last_user_msg_timestamp', final_messages[final_messages.length-1]['timestamp']);
	textArea.blur();
	textArea.value ='';	
	final_messages = [];
}
//////////////////////////////////////////////////////

function show_messages_on_view()
{
	for(i=0;i<final_messages.length;i++)
	{
		
		put_message_to_view(final_messages[i]);
	}	
	Ti.App.global_messages = final_messages;
	Ti.App.num_msgs = final_messages.length;
	total_user_messages += user_final_messages.length;
	total_lover_messages += lover_final_messages.length;
	scrollView.scrollToBottom();
	final_messages = [];
}


function put_message_to_view(message)
{	
	if(message['emotion'] == 0)
	{
		var namelbl = Ti.UI.createLabel({
			color:Ti.App.Properties.getString('text_color'),
		  text: message['txt'],  
		  borderRadius: 8,
		  borderWidth: 0,
		  backgroundPaddingLeft: 5,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		  top: top_global,
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
		message_view.add(namelbl);
		top_global = top_global + LABEL_LENGTH;
		//textArea.top += LABEL_LENGTH;
		//button.top += LABEL_LENGTH;
		message_view.height = message_view.height + LABEL_LENGTH;		
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
		{
			image1.image='love.gif';
			//image1.width=100;
		}
		else if(message['emotion'] == 2)
		{
			
			image1.image='miss_u.gif';			
		}
		else if(message['emotion'] == 3)
			image1.image='sorry.gif';			
		else if(message['emotion'] == 4)
			image1.image='mad.gif';			
			
		
		
		top_global = top_global + 60;
		//textArea.top += 60;
		//button.top += 60;		
		message_view.height = message_view.height + 60;
		message_view.add(image1);		
	}	
}