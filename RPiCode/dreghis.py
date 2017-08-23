#Firebase and Other Imports
from firebase import firebase
import sys
import time
import socket
import pygame
from uuid import getnode as get_mac

#NFC Module Imports
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

#Blink LED Blue indicating Data was added
def DataAdded(speed):
	GPIO.output(15, False)
	GPIO.output(13, False)
	for i in range(0,3):
		GPIO.output(11, True)
		time.sleep(speed)
		GPIO.output(11, False)
		time.sleep(speed)

#Set LED to Red indicating data is not yet added
def ProcessingData():
	GPIO.output(11, False)
	GPIO.output(13, False)
	GPIO.output(15, True)

#Load beep sound
def LoadBeep():
	pygame.mixer.init(0)
	pygame.init()
	pygame.mixer.music.load("beep-07.wav")

#Play beep sound
def Beep():
	pygame.mixer.music.play(0)
	clock = pygame.time.Clock()
	clock.tick(10)
	while pygame.mixer.music.get_busy():
		pygame.event.poll()
		clock.tick(10)

#Create empty object to store data
def CreateQueue():
	class Quee(object):
        	id=None #User Id
        	stm=None #Time of Entry
        	strtpos=None #Position In Queue
	return Quee

#PN532 Setup
def pn532SetUp():
	pn532 = Mifare()
	pn532.SAMconfigure()
	pn532.set_max_retries(MIFARE_SAFE_RETRIES)
	return pn532

#Converts Binary Data into String
def ToASCII(text):
	text=text.decode('utf-8')
	i=0
	result=''
	while((i<len(text))and(text[i]!='\x00')):
		result=result+text[i]
		i=i+1
	return result

#Read data from NFC Tag and returns data as a string
def ReadNFC(pn532):
	uid = pn532.scan_field()
	while(1):
		if uid:
			#uuid[]
			data=''
			for i in range(0, 3):
				address = pn532.mifare_address(i,1)
				pn532.mifare_auth_a(address,MIFARE_FACTORY_KEY)
				#pn532.mifare_auth_b(address,MIFARE_FACTORY_KEY)

				#uuid.append(b'2fc15656-91cd-')
				#uuid.append(b'46c3-b84c-')
				#uuid.append(b'1cd0fb66ed09')

				#pn532.mifare_write_standard(address,uuid1)

				tmp=pn532.mifare_read(address)
				data=data+ToASCII(tmp)
				pn532.in_deselect()

			return str(data)
		else:
			uid = pn532.scan_field()

#Gets MAC Address for use in uniquely identifying a health center
def GetMAC():
	mac=get_mac()
	mac='HC'+str(mac)
	MAC='HealthCenters/'+mac
	return MAC

#Firebase Setup
def fbSetUp():
	URL = "https://dreghisdb.firebaseio.com/"
	fb = firebase.FirebaseApplication(URL, None)	
	return fb

#Write data to firebase
def WriteData(Quee,fb):
	MAC=GetMAC()#Get MAC Address
	#Processing of Input Values for use
	ProcessingData()
	next=(fb.get(MAC+'/Trackers/Next', None))
	count=(fb.get(MAC+'/Trackers/Count',None))
	strtpos=int(count)+(int(next)-1)

	if strtpos==0:
		fb.put(MAC+'/Trackers', 'Next', 1)

	Quee.stm = int(time.time())
	Quee.strtpos=strtpos+1

	#Writes input values into firebase
	fb.put(MAC+'/Trackers', 'Count', count+1)
	PoS = MAC+'/Que/'+str(Quee.strtpos)

	fb.put(PoS, 'ID', Quee.id)
	fb.put(PoS, 'EntryTime', Quee.stm)

#Main Function
def main():
	RGBSetup()#Setup LED
	LoadBeep()#Load Beep wav file
	pn532=pn532SetUp()#Setup PN532 Module
	fb=fbSetUp()#Setup Firebase
	Quee=CreateQueue()#Create Object to hold input 
	while(1):
		#Read Values from NFC
		Ready()
		Quee.id=ReadNFC(pn532)
		Beep()
		print('Data Captured')
		
		#Processing of Input Values for use
		ProcessingData()
		WriteData(Quee,fb)
		DataAdded(0.3)
		print('Data Added')

if __name__=='__main__':
	try:
		main()
		GPIO.cleanup()#Turn off GPIO pins
	except KeyboardInterrupt:
		GPIO.cleanup()
		exit()
