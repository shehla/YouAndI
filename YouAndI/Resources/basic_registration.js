//////////////////////////////////////////////////////////////////////
// Adding text field
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

var namelbl = Ti.UI.createLabel({
	color:Ti.App.Properties.getString('text_color'),
  text: 'Name',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 10, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(namelbl);

var nametxt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: Ti.App.Properties.getString('text_color'),
  	top: 10, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(nametxt);

/////////////////////
// Your number
var phonelbl = Ti.UI.createLabel({
	color:Ti.App.Properties.getString('text_color'),
  text: 'Phone #',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 60, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(phonelbl);

var phonetxt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: Ti.App.Properties.getString('text_color'),
  	top: 60, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(phonetxt);

//////////////////////////////////////////////////////////////////////
// Adding register button

var button = Ti.UI.createButton({
	title: 'Register',
	top: 160,	
	width: 100,
	height: 50
});

// check if phone and name are entered
function check_basic_fields()
{
	if(nametxt.value == "")
	{
		alert('Can\'t register without a name');
		return false;
	}
	if(phonetxt.value == "")
	{
		alert("Please enter a phone number to register");
		return false;
	}
	return true;
}

function login_user()
{	
	Ti.App.Properties.setString("name", nametxt.value);
	Ti.App.Properties.setString("phone", phonetxt.value);	
}

function get_user_details()
{
	user_details = {			
		'name': nametxt.value,
		'phone': phonetxt.value
	};
	return user_details;
}


function add_user(table_name, user_details, msg)
{
	var params = {
			'RequestJSON' : {
				"TableName" : table_name,
				"Item" : {
					"status" : { "N" : user_details['status']}, //Required					
					'name' : { 'S' : user_details['name']},
					'phone': { 'S' : user_details['phone']}						
				}
			} //Required
		};
		
	if (user_details['lover_phone'] && user_details['lover_phone'] != '' && typeof(user_details['lover_phone'] != 'undefined'))
	{
		params["RequestJSON"]["Item"]["lover_phone"] = {};
		params["RequestJSON"]["Item"]["lover_phone"]["S"] = user_details['lover_phone'];
	}
			
	Ti.API.info('add_user: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		if(msg != '' && typeof(msg) != 'undefined')
		{
			alert('Horray! '+msg);
		}
		Ti.API.info(JSON.stringify(response));
		login_user();
		add_lover_window();
		Ti.App.Properties.setString('status',1);

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});	
}

function add_lover_window()
{
	var emptyView = Titanium.UI.createView({});	
	add_lover_win = Ti.UI.createWindow({
		backgroundColor:Ti.App.Properties.getString('back_color'), 		
		url: 'add_lover.js',
		leftNavButton: emptyView
	});		
	//Ti.UI.currentWindow.hide();
	//add_lover_win.show();
	Ti.UI.currentTab.add(add_lover_win);
	Ti.UI.currentTab.open(add_lover_win);	
	//Ti.UI.currentTab.window = add_lover_win;
}


button.addEventListener('click', function(e){				
	// Did user enter name and phone?
	if (check_basic_fields())
	{	
		user_details = get_user_details();
		user_details['status'] = '0';
		msg = 'Welcome aboard :). How about adding your loved one?';
		add_user("lovers", user_details, msg);
	}
	else
	{
		alert('Please enter name and phone number to proceed.');
	}		
});

Ti.UI.currentWindow.add(button);