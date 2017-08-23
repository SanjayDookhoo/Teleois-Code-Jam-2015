//Removes scrollbars
document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only

//Prompt for health center ID
var HC=prompt("Health Center ID");

var count;//Stores count of persons in queue
var next;//Stores place of next person in queue
var couint;//Int version of count
var nexint;//Int version of next
var name;//Name of person in queue
var queue = [];
var beep = new Audio("beep-02.wav"); // Beep when data is changed

//Main scetion
var ref = new Firebase('https://dreghisdb.firebaseio.com/');
ref.on("value", function(snapshot){
	//Capture basic info on health center
	var newRef = new Firebase("https://dreghisdb.firebaseio.com/HealthCenters/"+HC);
	newRef.on("value", function(snapshot){
  		count= snapshot.val().Trackers.Count;
  		next= snapshot.val().Trackers.Next;
  		name= snapshot.val().CenterDetails.Name;
  		couint=parseInt(count)-1;//Minus 1 because first person is being attended to and not waiting
  		nexint=parseInt(next);
  	});

	//Add Health Center data output
  	document.getElementById("header").innerHTML = "";
  	document.getElementById("header").innerHTML = name;
  	document.getElementById("persWait").innerHTML = "";
  	document.getElementById("persWait").innerHTML = " Persons Waiting: "+couint;

  	//Read queue data
    var myData = new Firebase("https://dreghisdb.firebaseio.com/HealthCenters/"+HC+"/Que");
    myData.on('value', function(datasnapshot){
       	queue = datasnapshot.val();//Store all queue data
       	persons=[];

    	var myRoot = new Firebase("https://dreghisdb.firebaseio.com/");
       	document.getElementById("queuebody").innerHTML ="" //Reset what is in the div tag is a change occured

       	//Loop through all IDs in the queue
       	for(var i=nexint;i<=(nexint+couint);i++){
       		//Get Patient name based on ID 
       		myRoot.child("PatientsRecords").orderByChild("patientId").equalTo(queue[i].ID).once("child_added", function(snapshot){
        		persons[i]=snapshot.val();
        		
        		//If it is the first person apply different styling to output
        		if(i-(nexint)==0){
					document.getElementById("queuebody").innerHTML +="<div id=\"queue1\">"+persons[i].firstName.toUpperCase()+' '+persons[i].lastName.toUpperCase()+"</div>";
        		}else{
  					document.getElementById("queuebody").innerHTML +="<div id=\"queue\">"+persons[i].firstName.toUpperCase()+' '+persons[i].lastName.toUpperCase()+"</div>";
    			}
				beep.play();//beep played whne data is changed
    		})
       	}
   	})
});


//Clock Function courtesy http://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
//Function which displays time on load
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("clck").innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

//Adds a 0 to the number if less than 10 (For styling)
function checkTime(i) {
    if (i < 10) {i = "0" + i}; 
    return i;
}