Ti.include('notifications.js');
Ti.include('fetch_messages.js');
Ti.include();
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

var loveBtn;
var missingBtn;
var sadBtn;
var madBtn;

createButtons();
function createButtons()
{
	loveBtn = Ti.UI.createButton({
		title: 'Love you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#FF83FA',
		top: 0,
		bubbleParent: false,
		left: '0%',	
		width: '100%',		
		height: '25%'
	});
	loveBtn.addEventListener('click', function(e){				
		//send_notification(1, 'love ya');		
		var milliseconds = (new Date).getTime();				
		add_emotion(1, 'love ya');
	});	
	Ti.UI.currentWindow.add(loveBtn);

	missingBtn = Ti.UI.createButton({
		title: 'Missing you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#8A2BE2',
		top: '25%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	missingBtn.addEventListener('click', function(e){
		//send_notification(2, 'missing you');				
		var milliseconds = (new Date).getTime();					
		add_emotion(2, 'missing you');
	});	
	Ti.UI.currentWindow.add(missingBtn);
	
	sorryBtn = Ti.UI.createButton({
		title: 'I am Sorry',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#6495ED',
		top: '50%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	sorryBtn.addEventListener('click', function(e){
		//send_notification(3, 'so sorry');				
		var milliseconds = (new Date).getTime();				
		add_emotion(3, 'so sorry');
	});		
	Ti.UI.currentWindow.add(sorryBtn);
	
	madBtn = Ti.UI.createButton({
		title: 'Mad at you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#388E8E',
		top: '75%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	madBtn.addEventListener('click', function(e){
		//send_notification(4, "so mad at you");				
		var milliseconds = (new Date).getTime();				
		add_emotion(4, "so mad at you");
	});		
	Ti.UI.currentWindow.add(madBtn);			
} 

function do_nothing()
{
}

function add_emotion(emotion_type, msg)
{
		add_message(emotion_type, msg, do_nothing);
}

function disable_Btn(emotion)
{	
	if(emotion==1)
	{
		loveBtn.enabled = false;
		loveBtn.title = 'Love sent..';
		setTimeout(function() {
			loveBtn.enabled = true;
			loveBtn.title = 'Send love';
		}, 5000);		
	}
	else if(emotion==2)
	{
		missingBtn.enabled = false;
		missingBtn.title = 'Its good to tell';
		setTimeout(function() {
			missingBtn.enabled = true;
			missingBtn.title = 'Missing you';
		}, 5000);		
	}
	else if(emotion==3)
	{
		sorryBtn.enabled = false;
		sorryBtn.title = 'Aww, cute';
		setTimeout(function() {
			sorryBtn.enabled = true;
			sorryBtn.title = 'I am sorry';
		}, 5000);		
	}
	else if(emotion==4)
	{
		madBtn.enabled = false;
		madBtn.title = 'It\'ll get better';
		setTimeout(function() {
			madBtn.enabled = true;
			madBtn.title = 'Mad at you';
		}, 5000);		
	}
	else
	{
		alert('ERROR: in disabling button');
	}
}
