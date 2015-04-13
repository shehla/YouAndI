#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import socket, ssl, json, struct, sys
import cgitb
import cgi

from boto_manager import BotoManager


def fetch_lover_details_from_store(lover_phone):
    boto_manager = BotoManager()
    table = boto_manager.get_table('lovers', 'us-east-1')
    lover_desc = table.get_item(phone=lover_phone)
    return lover_desc

def send_notification(deviceToken, message):
        print 'Sending to ',deviceToken,' message: ',message
        thePayLoad = {
             'aps': {
                  'alert': message,
                  'sound':'k1DiveAlarm.caf',
                  'badge':13,
                  },
             'test_data': { 'foo': 'bar' },
             }

        # Certificate issued by apple and converted to .pem format with openSSL
        # Per Apple's Push Notification Guide (end of chapter 3), first export the cert in p12 format
        # openssl pkcs12 -in cert.p12 -out cert.pem -nodes
        #   when prompted "Enter Import Password:" hit return
        #
        theCertfile = 'cert.pem'
        #
        theHost = ( 'gateway.sandbox.push.apple.com', 2195 )

        #
        data = json.dumps( thePayLoad )

        # Clear out spaces in the device token and convert to hex
        deviceToken = deviceToken.replace(' ','')
        #byteToken = bytes.fromhex( deviceToken ) # Python 3
        byteToken = deviceToken.decode('hex') # Python 2

        theFormat = '!BH32sH%ds' % len(data)
        theNotification = struct.pack( theFormat, 0, 32, byteToken, len(data), data )

        # Create our connection using the certfile saved locally
        ssl_sock = ssl.wrap_socket( socket.socket( socket.AF_INET, socket.SOCK_STREAM ), certfile = theCertfile )
        ssl_sock.connect( theHost )

        # Write out our data
        ssl_sock.write( theNotification )

        # Close the connection -- apple would prefer that we keep
        # a connection open and push data as needed.
        ssl_sock.close()

def build_message(emotion_type, message):
    if emotion_type == 0:
        return message
    elif emotion_type == 1:
        return "\xE2\x9D\xA4 " + message
    elif emotion_type == 2:
        return "\xF0\x9F\x98\xA4 " + message
    elif emotion_type == 3:
        return "\xF0\x9F\x98\xA8 " + message
    elif emotion_type == 4:
        return "\xF0\x9F\x98\xA1 " + message
    else:
         print("Error!")


if __name__ == '__main__':
        cgitb.enable()
        print "Content-Type: text/plain;charset=utf-8"
        print
        arguments = cgi.FieldStorage()
        param_dict = {}
        for i in arguments.keys():
            print 'Val received', i,' ',arguments[i].value
            param_dict[i] = arguments[i].value
        # device token returned when the iPhone application
        # registers to receive alerts
        message = build_message(int(param_dict['emotion_type']), param_dict['message'])
        lover_desc = fetch_lover_details_from_store(param_dict['lover_phone'])
        send_notification(lover_desc['device'], message)
