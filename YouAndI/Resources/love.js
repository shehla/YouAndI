var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

function add_message(milliseconds)
{
	var params = {
			'RequestJSON' : {
				"TableName" : 'messages',
				"Item" : {
					"from" : { "S" : Ti.App.Properties.getString('phone')}, //Required					
					'to' : { 'S' : Ti.App.Properties.getString('lover_phone')},
					'timestamp': { 'N' : milliseconds.toString()},
					'message': { 'S' : textArea.value}						
				}
			} //Required
		};
		
			
	Ti.API.info('add_message: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		Ti.API.info(JSON.stringify(response));		

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
  //height: 340,
  //width: 1000
});
var recent_messages = 
	[
		{	
			emotion:0,	
			txt:'Missing you my lailee',
			timestamp:1419377095,
			'from_me':true
		},
		{	
			emotion:0,	
			txt:'Its raining and I\'m missing you',
			timestamp:1419377295,
			'from_me':true
		},
		{
			emotion:0,
			txt:'jhoot na bol',
			timestamp:1419377295,
			'from_me':false
		},
		{
			emotion:0,
			txt:'So deeply in love with you',
			timestamp:1419377795,
			'from_me':true
			
		},
		{
			emotion:0,
			txt:'aaj janay ki zidh na karo',
			timestamp:1419377995,
			'from_me':true
		},
		{
			emotion:0,
			txt:'shaeron sey lafz ley kay',
			timestamp:1419378000,
			'from_me':false
		},
		{
			emotion:0,
			txt:'dil yeh dhookay dariii',
			timestamp:1419378001,
			'from_me':true
		},
		{
			emotion:0,
			txt:'urr gaey totoay rey',
			timestamp:1419378002,
			'from_me':false
		},
		{
			emotion:0,
			txt:'teray pehlo mein reh lon',
			timestamp:1419378004,
			'from_me':true
		},
		{
			emotion:0,
			txt:'mein khud ko pagal keh don',
			timestamp:1419378006,
			'from_me':false
		},
		{
			emotion:1, // love you
			'from_me':false
		},		
		{
			emotion:0,
			txt:'tu sey naina jab sey millay',
			timestamp:1419378008,
			'from_me':false
		},
		{
			emotion:0,
			txt:'totii charpai rasta daikjhay',
			timestamp:1419378010,
			'from_me':true
		},
		{
			emotion:2, // missing you
			'from_me':true
		},		
		{
			emotion:0,
			txt:'bano rey bano meri challi susraal',
			timestamp:1419378012,
			'from_me':true
		},		
		{
			emotion:0,
			txt:'tera mera rishta hay aisa',
			timestamp:1419378015,
			'from_me':true
		},
		{
			emotion:0,
			txt:'ik pal door gawara nahi',
			timestamp:1419378020,
			'from_me':false
		},
		{
			emotion:0,
			txt:'kyun tum hi ho',
			timestamp:1419378022,
			'from_me':true
		},
		
							
	];

top_global = 10;
Ti.API.info(JSON.stringify(recent_messages));
for(i=0;i<recent_messages.length;i++)
{
	if(recent_messages[i]['emotion'] == 0)
	{
		var namelbl = Ti.UI.createLabel({
			color:Ti.App.Properties.getString('text_color'),
		  text: recent_messages[i]['txt'],  
		  borderRadius: 8,
		  //backgroundColor: 'white',
		  borderWidth: 0,
		  backgroundPaddingLeft: 5,
		  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		  top: top_global,
		  //width: 280,
		  height: 5
		});
		if (recent_messages[i]['from_me'])
		{
			namelbl.left=5;
		}
		else
		{
			namelbl.right=5;
		}
		view.add(namelbl);
		top_global = top_global + 40;
	}
	else
	{
		var image1 = Ti.UI.createImageView({		  
		  top: top_global,		  
		  height: 60,
		  width:60
		});
		if (recent_messages[i]['from_me'])
		{
			image1.left=5;
		}
		else
		{
			image1.right=5;
		}
		
		if(recent_messages[i]['emotion'] == 1)
			image1.image='love.jpeg';
		else if(recent_messages[i]['emotion'] == 2)
			image1.image='miss_u.png';
		
		top_global = top_global + 60;
		view.add(image1);		
	}
}

scrollView.add(view);


//Ti.UI.currentWindow.add(table);
Ti.UI.currentWindow.add(scrollView);