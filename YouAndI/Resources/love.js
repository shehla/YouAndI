Ti.include('notifications.js');
Ti.include('fetch_messages.js');
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
LABEL_LENGTH = 35;


// bug in titanium https://jira.appcelerator.org/browse/TIMOB-16496
blurCalled = false;
var textArea;
var button;
top_global = 10;
var scrollView;
var view;

//refresh_messages_screen();

function makeScrollViewProperlyVisible()
{
	add_textarea_and_send_btn();
	show_messages_on_view();
	scrollView.setContentOffset({x:0,y:view.getHeight()-450},{animated:false});		
	scrollView.setVisible(true);	
}

function create_controls()
{
	scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	  top:0,
	  height: 450,
	  visible: false,
	  //height: '80%',
	  //width: '80%'
	});
	view = Ti.UI.createView({
	  //backgroundColor:Ti.App.Properties.getString('back_color'),
	  //backgroundImage: 'background_iphone5.jpg',
	  borderRadius: 10,
	  top: 0,
	  height: 0,
	  //width: 1000
	});
	view.addEventListener('click',function(e){    	
      	textArea.blur();    	
	});	
	
	scrollView.add(view);	
	Ti.App.win1.add(scrollView);	
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

function refresh_messages_screen()
{
	init_structs();
	if (Ti.App.win1.getChildren().length > 0)
	{		
		for(i=0;i<Ti.App.win1.getChildren().length;i++)
			Ti.App.win1.remove(Ti.App.win1.children[i]);
	}			

	if (Ti.App.Properties.getString('phone') != null && Ti.App.Properties.getString('lover_phone') != null)
	{
		fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, makeScrollViewProperlyVisible);
		fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, makeScrollViewProperlyVisible);
		//mock_fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, makeScrollViewProperlyVisible);
		//mock_fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, makeScrollViewProperlyVisible);
	}
	create_controls();
}
// sort and merge messages to form recent messages.

function update_view_keyboad_shut()
{	
    view.height -= 166;	
}

function add_textarea_and_send_btn()
{	
	view.height = view.height + 35;
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
	  top: top_global,
	  left:5,
	  width: 250, height : 25
	});
	view.add(textArea);
	
	textArea.addEventListener('focus', function() {
	    view.height += 166;
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
		top: top_global,
		bubbleParent: false,
		left: 260,	
		width: 50,
		height: 25
	});
	view.add(button);
	
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
	textArea.blur();
	textArea.value ='';	
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
}


function put_message_to_view(message)
{
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
		textArea.top += LABEL_LENGTH;
		button.top += LABEL_LENGTH;
		view.height = view.height + LABEL_LENGTH;		
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
		else if(message['emotion'] == 2)
		{
			
			image1.image='miss_u.png';
		}
		else if(message['emotion'] == 3)
			image1.image='sorry.jpeg';			
		else if(message['emotion'] == 4)
			image1.image='mad.jpeg';			
			
		
		
		top_global = top_global + 60;
		textArea.top += 60;
		button.top += 60;		
		view.height = view.height + 60;
		view.add(image1);		
	}	
	//scrollView.scrollToBottom();
}