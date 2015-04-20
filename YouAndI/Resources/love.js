Ti.include('notifications.js');
Ti.include('fetch_messages.js');
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
KEYBOARD_HEIGHT = 170;
MSG_PADDING = 10;
USER_BG_COLOR = '#E5FFCC';
NOT_SENT_BG_COLOR = '#FFFFFF';
LOVER_BG_COLOR = '#CCE5FF';
// bug in titanium https://jira.appcelerator.org/browse/TIMOB-16496
blurCalled = false;
var textArea;
var rowPad;
var send_button;
var table_view_rows = new Array();
var text_btn_view;
var table;
// this is used from emotion.js when add_message is called.
// That is why I have to declare it globally.
var textArea;

create_screen_and_render_first_time();

function render_UI()
{		 
	create_controls();
	add_textarea_and_send_btn();
	show_messages_on_view(0);
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
           minRowHeight: 0,
           backgroundColor:'transparent'
        });
        row.add(load_earlier_button);
    table.appendRow(row);
    
	rowPad = Ti.UI.createTableViewRow({
		className: 'youandirow',
		selectionStyle: 'none',
       width: 'auto',
       height: 1,
       backgroundColor:'transparent'
    });		
	table.appendRow(rowPad);    
	
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
		rowPad.height = 1;
	});
	
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
					put_message_to_view(this_msgs[x], table.data[0].rows.length-2);
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

function create_screen_and_render_first_time()
{
	Ti.App.global_messages = [];
	init_structs();
	callback_for_UI	= render_UI;		
	if (Ti.App.Properties.getString('phone') != null && Ti.App.Properties.getString('lover_phone') != null)
	{
		query_type = 'LT';
		user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
		conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
		Ti.API.info('Passing timestamp FOR INITAL QUERY ----->'+user_timestamp);
		fetch_messages(conversation_id, user_timestamp, callback_for_UI, query_type);		
	}	
}

function refresh_messages_screen()
{
	Ti.App.global_messages = [];
	init_structs();
	if (Ti.App.Properties.getString('phone') != null && Ti.App.Properties.getString('lover_phone') != null)
	{		
		new_msgs = Ti.App.Properties.getString('new_messages');
		if(new_msgs == '0')
		{ 
			query_type = 'LT';
			user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
			callback_for_UI = post_fetch_msgs;
		}
		else
		{		
			query_type = 'GT';
			user_timestamp = Ti.App.Properties.getString('newest_user_msg_timestamp');
			callback_for_UI = post_fetch_new_msgs;
		}
		
		conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
		Ti.API.info('Passing timestamp ----->'+user_timestamp);
		fetch_messages(conversation_id, user_timestamp, callback_for_UI, query_type);		
		//mock_fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, render_UI);
		//mock_fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, render_UI);
	}
		
}

// sort and merge messages to form recent messages.

function update_view_keyboad_shut()
{	
    text_btn_view.top += KEYBOARD_HEIGHT;	
}

function add_textarea_and_send_btn()
{	
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
		rowPad.height = KEYBOARD_HEIGHT;
		table.scrollToIndex(table.data[0].rows.length-1);
	    text_btn_view.top -= KEYBOARD_HEIGHT;
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
	send_button = Ti.UI.createButton({
		title: 'Send',
		color:'white',
		top: 5,
		bubbleParent: false,
		left: 260,	
		width: 50,
		height: 25
	});
	text_btn_view.add(send_button);
	
	send_button.addEventListener('click', function(e){				
		// Did user enter name and phone?
		if (textArea.value != '')
		{				
			Ti.API.info('User: '+Ti.App.Properties.getString('phone')+' Sending message: '+textArea.value+' to lover->'+Ti.App.Properties.getString('lover_phone'));
			message_new = {'from': Ti.App.Properties.getString('phone'),
				'to': Ti.App.Properties.getString('lover_phone'),
				'emotion': 0,
				'txt':textArea.value,
				'from_me':true,
				'unconfirmed_msg': true
			};
			
			put_message_in_global(message_new);							
			Ti.App.win1.fireEvent('focus');			
			rowPad.height = 1;
			add_message(0, textArea.value, post_add_message);						
		}
		else
		{
			alert('Please enter a message to send.');
		}		
	});
}

function post_add_message()
{
	latest_msg_view = table_view_rows[table_view_rows.length-1];
	latest_msg_view.opacity = 1;
}


function post_message_send_notification_and_update_views()
{		
	textArea.blur();
	textArea.value ='';	
}
//////////////////////////////////////////////////////

function post_fetch_new_msgs()
{
	var index_to_add;
	index_to_add = table.data[0].rows.length-2;	
	show_messages_on_view(index_to_add);
}

function post_fetch_msgs()
{
	var index_to_add;
	index_to_add = 0;	
	show_messages_on_view(index_to_add);
}

function show_messages_on_view(index_to_add)
{
	Ti.API.info('coming to show_messages_on_view');
	global_msgs = get_global_messages();	
	for(i=global_msgs.length-1;i>=0;i--)
	{
		put_message_to_view(global_msgs[i], index_to_add);
		index_to_add = index_to_add + 1;
	}		
	Ti.App.num_msgs = global_msgs.length;
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
			if (message['unconfirmed_msg'])
				msg_view.opacity = 0.3;					
		}
		else
		{
	
			msg_view.left=5;
			msg_view.backgroundColor = LOVER_BG_COLOR;
		}		
				
		msg_view.add(namelbl);
		row.add(msg_view);
		table_view_rows.push(msg_view);
				
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
		table_view_rows.push(image1);	
	}	
	cur_rows = table.data[0].rows.length-2;
	
	table.insertRowAfter(index_to_add, row);
	//table.scrollToIndex(table.data[0].rows.length-1);
	table.scrollToIndex(index_to_add+1);
}