Ti.include('notifications.js');
Ti.include('fetch_messages.js');
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
LABEL_LENGTH = 35;
KEYBOARD_HEIGHT = 170;
MSG_PADDING = 10;
USER_BG_COLOR = '#E5FFCC';
LOVER_BG_COLOR = '#CCE5FF';

// bug in titanium https://jira.appcelerator.org/browse/TIMOB-16496
blurCalled = false;
var textArea;
var button;
var scrollView;
var message_view;
var text_btn_view;
var table;
// this is used from emotion.js when add_message is called.
// That is why I have to declare it globally.
var textArea;



refresh_messages_screen();

function render_UI()
{		 
	create_controls();
	add_textarea_and_send_btn();
	show_messages_on_view();
	//scrollView.setContentOffset({x:0,y:message_view.getHeight()-450},{animated:false});		
	//scrollView.setVisible(true);	
	table.setContentOffset({animated:false});	
	Ti.App.Properties.setString('controls_rendered','1');
	table.setVisible(true);	
}

function create_controls()
{
	
	table = Ti.UI.createTableView({
        separatorColor : 'transparent',
        top            : 0,
        backgroundColor:'transparent',
        height         : 410,
        visible: false
	});

	load_earlier_button = Ti.UI.createButton({
		title: 'Load earlier messages..',
		color:'black',
		borderRadius: 10,
		backgroundColor: 'white',
		top: 5,
		bubbleParent: false,
		//left: 0,	
		width: '95%',
		height: 25
	});
	load_earlier_button.addEventListener('click', function(e){				
		refresh_messages_screen();		
	});	
    var row = Ti.UI.createTableViewRow({
		className: 'youandirow',
		selectionStyle: 'none',
           width: 'auto',
           height: 'auto',
           backgroundColor:'transparent'
        });
        row.add(load_earlier_button);
    table.appendRow(row);
	
	scrollView = Ti.UI.createScrollView({
	  contentWidth: 'auto',
	  contentHeight: 'auto',
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: true,
	  top:0,
	  height: 415,
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
	  backgroundColor:'#808080',
	  //backgroundImage: 'background_iphone5.jpg',
	  //borderRadius: 10,
	  top: 415,
	  height: 7,	  
	  //width: 1000
	});
		
	table.addEventListener('click', function(e)
	{
		textArea.blur();
	});
	
	//scrollView.add(message_view);	
	//Ti.App.win1.add(scrollView);	
	Ti.App.win1.add(table);
	Ti.App.win1.add(text_btn_view);
	Ti.App.win1.addEventListener('focus', function(e){
		new_msgs = Ti.App.Properties.getString('new_messages');
		if(new_msgs == '0')
		{			
			this_msgs = eval(Ti.App.global_messages);			
			if(Ti.App.num_msgs < this_msgs.length)
			{
				for(x=Ti.App.num_msgs;x<this_msgs.length;x++)
				{
					put_message_to_view(this_msgs[x], table.data[0].rows.length-1);
				}
				Ti.App.num_msgs = this_msgs.length;
			}
			post_message_send_notification_and_update_views();
		}
		else{
			// got a push notification. Fetch new msgs
			refresh_messages_screen();
			Ti.App.global_messages = [];
		}
	});			
}

function init_startup_global_vars()
{
	total_user_messages = 0;	
}

function refresh_messages_screen()
{
	Ti.App.global_messages = [];
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
		get_messages_from_store(callback_for_UI);
		//mock_fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, render_UI);
		//mock_fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, render_UI);
	}
		
}

function get_messages_from_store(callback_for_UI)
{
	
	new_msgs = Ti.App.Properties.getString('new_messages');
	if(new_msgs == '0')
	{ 
		query_type = 'LT';
		user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
	}
	else
	{		
		query_type = 'GT';
		user_timestamp = Ti.App.Properties.getString('newest_user_msg_timestamp');
	}
	
	conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
	Ti.API.info('Passing timestamp ----->'+user_timestamp);
	fetch_messages(conversation_id, user_timestamp, callback_for_UI, query_type);
	//fetch_messages(Ti.App.Properties.getString('lover_phone'), lover_timestamp, get_lover_msgs, callback_for_UI, query_type);	
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
	  width: 250, height : 30
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
			Ti.API.info('User: '+Ti.App.Properties.getString('phone')+' Sending message: '+textArea.value+' to lover->'+Ti.App.Properties.getString('lover_phone'));
			
			add_message(0, textArea.value);
		}
		else
		{
			alert('Please enter a message to send.');
		}		
	});
}


function post_message_send_notification_and_update_views()
{
	scrollView.scrollToBottom();		
	textArea.blur();
	textArea.value ='';	
}
//////////////////////////////////////////////////////

function show_messages_on_view()
{
	Ti.API.info('coming to show_messages_on_view');
	var index_to_add;
	new_msgs = Ti.App.Properties.getString('new_messages');
	if(new_msgs=='1')
		index_to_add = table.data[0].rows.length-1;
	else
		index_to_add = 0;
	global_msgs = get_global_messages();	
	for(i=global_msgs.length-1;i>=0;i--)
	{
		put_message_to_view(global_msgs[i], index_to_add);
		index_to_add = index_to_add + 1;
	}		
	Ti.App.num_msgs = global_msgs.length;
	total_user_messages += fetched_messages.length;
	// now set the new_messages switch false
	Ti.App.Properties.setString('new_messages','0');
	
}


function put_message_to_view(message, index_to_add)
{	
	var row = Ti.UI.createTableViewRow({
		className: 'youandirow',
		selectionStyle: 'none',
		/*           
            backgroundGradient : {
                type          : 'linear',
                colors        : [ "#fff", '#eeeeed' ],
                startPoint    : { x : 0, y : 0 },
                endPoint      : { x : 0, y : 70 },
                backFillStart : false
            }
            */
           width: 'auto',
           height: 'auto',
           backgroundColor:'transparent'
        });     
    
	if(message['emotion'] == 0)
	{		
		var msg_view = Ti.UI.createLabel({
			backgroundColor: 'white',
			height: 'auto',
			borderRadius: 8,			
			width: 'auto',
			top: 10,
		});
		var namelbl = Ti.UI.createLabel({
			color:Ti.App.Properties.getString('text_color'),
			backgroundColor: 'transparent',
		  text: message['txt'],  
		  //borderRadius: 8,
		  //borderWidth: 0,		  		  
		  //backgroundPaddingTop: 5,		  
		  //backgroundPaddingBottom: 5,		  
		  //horizontalWrap: true,
		  left: MSG_PADDING,
		  right: MSG_PADDING,
		  top: MSG_PADDING,
		  bottom: MSG_PADDING,
		  width: 'auto',
		  //width: 250,
		  height: 'auto'
		});
		
		if (message['from_me'] == true)
		{			
			msg_view.right=5;
			msg_view.backgroundColor = USER_BG_COLOR;
		}
		else
		{
	
			msg_view.left=5;
			msg_view.backgroundColor = LOVER_BG_COLOR;
		}		
				
		msg_view.add(namelbl);
		row.add(msg_view);
		//message_view.add(namelbl);
		//message_view.height = message_view.height + LABEL_LENGTH;
				
	}
	else
	{			
		var image1 = Ti.UI.createImageView({		  		  
		  height: 60,
		  width:60
		  //height:'auto',
		  //width:'auto'
		});
		
		if (message['from_me'])
		{
			image1.right=5;
		}
		else
		{
			image1.left=5;
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
			image1.image='fing_sorry.gif';			
		else if(message['emotion'] == 4)
			image1.image='mad.gif';			
			
		row.add(image1);		
	}	
	cur_rows = table.data[0].rows.length-1;
	
	table.insertRowAfter(index_to_add, row);
	//table.scrollToIndex(table.data[0].rows.length-1);
	table.scrollToIndex(index_to_add+1);
}