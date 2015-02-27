///////////////////////////////////////////
function send_notification(emotion_type, cur_message)
{	
	//var url = "http://52.0.12.121/send_not.php?emotion_type="+emotion_type+"&message="+cur_message;	
	var url = "http://52.0.12.121/cgi-bin/send_not.cgi?&lover_phone="+Ti.App.Properties.getString('lover_phone')+"&emotion_type="+emotion_type+"&message="+cur_message;
	Ti.API.info('sending notification :'+url);

	 var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
	         Ti.API.info("Received text: " + this.responseText);
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	         Ti.API.debug(e.error);
	         alert('error');
	     },
	     timeout : 5000  // in milliseconds
	 });
	 // Prepare the connection.
	 client.open("GET", url);
	 // Send the request.
	 client.send();
}