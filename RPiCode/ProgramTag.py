#NFC Module, time, binascii and system Imports
import binascii
import time
import sys
sys.path.append("/home/pi/py532lib/py532lib")
from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
from py532lib.mifare import *

#LED Imports
import RPi.GPIO as GPIO

#Setup LED GPIO
def RGBSetup():
        GPIO.setmode(GPIO.BOARD)
        RGB=[15,11,13]
        for i in RGB:
                GPIO.setup(i,GPIO.OUT)
                GPIO.output(i, False)

#Set LED to Green indicating ready to read
def Ready():
        GPIO.output(15, False)
        GPIO.output(11, False)
        GPIO.output(13, True)

#PN532 Setup
def pn532SetUp():
        pn532 = Mifare()
        pn532.SAMconfigure()
        pn532.set_max_retries(MIFARE_SAFE_RETRIES)
        return pn532

#Read data from NFC Tag and returns data as a string
def ProgramTag(uuid,pn532):
        uid = pn532.scan_field()
        while(1):
                if uid:
                        for i in range(0, 3):
                                address = pn532.mifare_address(i,1)
                                pn532.mifare_auth_a(address,MIFARE_FACTORY_KEY)
                                pn532.mifare_auth_b(address,MIFARE_FACTORY_KEY)
                                pn532.mifare_write_standard(address,uuid[i])
                                pn532.in_deselect()
                        return
                else:
                                uid = pn532.scan_field()

def main():
        RGBSetup()
        Ready()
        uuid=['none','none','none']

        uuid[0]=(b'154c953e-3a82-')
        uuid[1]=(b'4f49-b534-')
        uuid[2]=(b'325fb3b75504')
	                
        pn532=pn532SetUp()
        ProgramTag(uuid,pn532)

if __name__=='__main__':
        try:
                main()
                GPIO.cleanup()#Turn off GPIO pins
        except KeyboardInterrupt:
                GPIO.cleanup()
                exit()

