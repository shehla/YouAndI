// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.App.Properties.setString('back_color','#AFEEEE');
Ti.App.Properties.setString('text_color', '#336699');
//clear_fields();
/*
Ti.App.Properties.setString('status', 2);
Ti.App.Properties.setString('phone', '18a');
Ti.App.Properties.setString('lover_phone', '18b');
*/
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
current_window = null;

Titanium.UI.setBackgroundColor('#000');
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var add_lover_win=null;
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
Ti.API.info('Status ---->'+Ti.App.Properties.getString('status'));
if (Ti.App.Properties.getString('status') == 1)
{
	settings_win = 'add_lover.js';
	render_tabs();
	render_app();		

	//fetch_status();
}	
else if(Ti.App.Properties.getString('status') == 2 || Ti.App.Properties.getString('status') == 3)
{	
	//final_registration_window('In status 2 '+Ti.App.Properties.getString("phone")+ ' waiting for '+Ti.App.Properties.getString("lover_phone")+' to register/accept.');
	fetch_status();		
}
/*
else if()
{	
	final_registration_window('In status 3 '+Ti.App.Properties.getString("phone")+ ' sent request to ->'+Ti.App.Properties.getString("lover_phone"));
}
*/
else if(Ti.App.Properties.getString('status') == 4)
{
	final_registration_window('Bingo .. you:'+Ti.App.Properties.getString("phone")+ ' and ->'+Ti.App.Properties.getString("lover_phone")+ ' are in love :D');
}
else
{	
	settings_win = 'basic_registration.js';
	render_tabs();
	render_app();		
}

 
function fetch_status()
{	
	//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+phone+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	if (typeof(Ti.App.Properties.getString('lover_phone')) != 'undefined')
		//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]},"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('lover_phone')+'"}}],"AttributesToGet": ["phone", "name", "status", "lover_phone"]}}}}';
		var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}, {"HashKeyElement": {"S":"'+Ti.App.Properties.getString('lover_phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
		//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"1112"}}, {"HashKeyElement": {"S":"21d1d"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	else
		var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	Ti.API.info('Initial query ->' + params);
	
			
	AWS.DDB.batchGetItem(JSON.parse(params),
			
		function(data, response) {		
		recs = response["data"]["Responses"]["lovers"]["Items"];
		Ti.API.info('Result ->'+JSON.stringify(recs));
		Ti.API.info(' Num recs ->' + recs.length);
		if (recs.length == 1)
		{
			// User didn't mention a lover yet
			//alert('ERROR: not supposed to come here!');
			final_registration_window(Ti.App.Properties.getString("phone")+ ' sent request to ->'+Ti.App.Properties.getString("lover_phone"));				
		}
		else
		{
			// User and lover both exist
			user_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);
			lover_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][1]);
			if (user_details['lover_phone'] == lover_details['phone'])//&& user_details['phone'] == lover_details['lover_phone'])
			{
				//Bingo: They're in love :D
				final_registration_window('Bingo .. you:'+Ti.App.Properties.getString("phone")+ ' and ->'+Ti.App.Properties.getString("lover_phone")+ ' are in love :D');											
			}			
		}								

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});			
}

function final_registration_window(custom_msg)
{
	var emptyView = Titanium.UI.createView({});	
	add_lover_win = Ti.UI.createWindow({
		backgroundColor:Ti.App.Properties.getString('back_color'), 		
		url: 'login_greetings.js',
		leftNavButton: emptyView
	});			
	custom_label = Ti.UI.createLabel({
		color: Ti.App.Properties.getString('text_color'),
		text: custom_msg,
		font:{fontSize:20,fontFamily:'Helvetica Neue'},
		textAlign:'center',
		width:'auto'
	});	
	add_lover_win.add(custom_label);
	current_window = add_lover_win;
	//tab2.add(add_lover_win);
	//tab2.open(add_lover_win);
	render_app();		
} 

function clear_fields()
{
	Ti.App.Properties.removeProperty('name');
	Ti.App.Properties.removeProperty('status');
	Ti.App.Properties.removeProperty('phone');
	Ti.App.Properties.removeProperty('lover_phone');
}


function render_tabs()
{
	var win2 = Titanium.UI.createWindow({  
	    title:'Settings',
	    backgroundColor:Ti.App.Properties.getString('back_color'),
	    url: settings_win
	});
	current_window = win2;
}

function render_app()
{
	//
	// create base UI tab and root window
	//
	var win1 = Titanium.UI.createWindow({  
	    title:'Loves',
	    backgroundColor:Ti.App.Properties.getString('back_color'),
	    url:'love.js'
	});
	var tab1 = Titanium.UI.createTab({  
	    icon:'KS_nav_views.png',
	    title:'Loves',   
	    window:win1 
	});	
	
	var tab2 = Titanium.UI.createTab({  
	    icon:'KS_nav_ui.png',
	    title:'Settings',
	    window:current_window    
	});
	
	tabGroup.addTab(tab2);	
	tabGroup.addTab(tab1);
	tabGroup.open(); 	
}