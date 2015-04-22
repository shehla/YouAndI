Ti.include('notifications.js');
Ti.include('fetch_messages.js');
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
//var num_msgs = 0;

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
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
create_screen_and_render_first_time();

function render_UI()
{		 
	create_controls();
	add_textarea_and_send_btn();
	show_messages_on_view();
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
    put_table_msgs_rows(0, {'from': 'load_earlier_button',
				'to': 'load_earlier_button',				
				'timestamp': '0',// use a big number for timestamp
	});
	
    table_view_rows.push('dummy_view');
	rowPad = Ti.UI.createTableViewRow({
		className: 'youandirow',
		selectionStyle: 'none',
       width: 'auto',
       height: 1,
       backgroundColor:'transparent'
    });		
	table.appendRow(rowPad);
	
    put_table_msgs_rows(1, {'from': 'rowPad',
				'to': 'rowPad',				
				'timestamp': '3227778696322',// use the biggest number
	});
	
	table_view_rows.push('dummy_view');	    
	
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
			
			check_and_add_msgs_to_table();
			post_message_send_notification_and_update_views();
		}
		else{
			// got a push notification. Fetch new msgs
			refresh_messages_screen();
			//Ti.App.global_messages = [];
		}
	});			
}

function create_screen_and_render_first_time()
{
	init_structs();
	callback_for_UI	= render_UI;		
	query_type = 'LT';
	user_timestamp = Ti.App.Properties.getString('last_user_msg_timestamp');
	conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
	Ti.API.info('Passing timestamp FOR INITAL QUERY ----->'+user_timestamp);
	fetch_messages(conversation_id, user_timestamp, callback_for_UI, query_type);			
}

function refresh_messages_screen()
{
	init_structs();
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
	callback_for_UI = show_messages_on_view;
	conversation_id = get_conversation_id(Ti.App.Properties.getString('phone'), Ti.App.Properties.getString('lover_phone'));
	Ti.API.info('Passing timestamp ----->'+user_timestamp);
	fetch_messages(conversation_id, user_timestamp, callback_for_UI, query_type);		
	//mock_fetch_messages(Ti.App.Properties.getString('phone'), get_user_msgs, render_UI);
	//mock_fetch_messages(Ti.App.Properties.getString('lover_phone'), get_lover_msgs, render_UI);		
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
			//rowPad.height = 1;
			add_message(0, textArea.value, post_add_message);						
		}
		else
		{
			alert('Please enter a message to send.');
		}		
	});
}

function update_timestamp_new_msg(cur_timestamp)
{
	table_msgs_rows = get_table_msgs_rows();
	for(x=0;x<table_msgs_rows.length;x++)
	{
		if(table_msgs_rows[x]['timestamp'] == '2227778696322')
		{
			table_msgs_rows[x]['timestamp'] = cur_timestamp;
			table_view_rows[x].opacity = 1;			
		}
			
	}
	Ti.App.table_msgs_rows = table_msgs_rows;
}

function post_add_message(cur_timestamp)
{
	Ti.API.info('XXXXXXXXXXX -> '+cur_timestamp);
	update_timestamp_new_msg(cur_timestamp);
}


function post_message_send_notification_and_update_views()
{			
	//textArea.blur();
	textArea.value ='';	
}
//////////////////////////////////////////////////////
function check_and_add_msgs_to_table()
{
	this_msgs = get_global_messages();			
	table_msgs_rows = get_table_msgs_rows();
	num_rows_in_table = table_msgs_rows.length - 2;
	num_total_msgs = this_msgs.length;
	Ti.API.info('Window focus: '+num_rows_in_table+' < '+num_total_msgs);					
	if(num_rows_in_table < num_total_msgs) // + 2 for for extra dummy rows
	{
		num_global_msgs = this_msgs.length;				
		for(var dd=num_rows_in_table;dd<num_total_msgs;dd++) // -2 for for extra dummy rows
		{
			Ti.API.info('=========> '+dd+'   '+this_msgs[dd]['txt']);					
			put_message_to_view(this_msgs[dd]);
		}

		//num_msgs = this_msgs.length;
	}
	table.scrollToIndex(table.data[0].rows.length-1);	
}


function show_messages_on_view()
{	
	check_and_add_msgs_to_table();
	// now set the new_messages switch false
	Ti.App.Properties.setString('new_messages','0');
	
}

function get_index_in_table(message)
{
	table_msgs_rows = get_table_msgs_rows();
	Ti.API.info('coming length->'+table_msgs_rows.length);
	for(var x=0;x<table_msgs_rows.length-1;x++)
	{		
		//Ti.API.info('my X:'+x);
		Ti.API.info('x:'+x+' '+table_msgs_rows[x]['timestamp']+' < '+message['timestamp']+' < '+table_msgs_rows[x+1]['timestamp']);
		if(parseFloat(message['timestamp']) > parseFloat(table_msgs_rows[x]['timestamp'])
			&& parseFloat(message['timestamp']) < parseFloat(table_msgs_rows[x+1]['timestamp']))
		{			
			Ti.API.info(' RETURNING IDX x:'+x);
			return x;
		}
	}
}


function put_message_to_view(message)
{	
	var row = Ti.UI.createTableViewRow({
		className: 'youandirow',
		selectionStyle: 'none',
           width: 'auto',
           height: 'auto',
           backgroundColor:'transparent'
        });     
    index_to_add = get_index_in_table(message);
    
    var new_view;
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
		new_view = msg_view;					
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
		new_view = image1;	
	}		
	idx_to_add = index_to_add+1;
	table_view_rows.insert(idx_to_add, new_view);
	put_table_msgs_rows(idx_to_add, message);
	
	table.insertRowAfter(index_to_add, row);
	//table.scrollToIndex(table.data[0].rows.length-1);
	table.scrollToIndex(index_to_add+1);
}