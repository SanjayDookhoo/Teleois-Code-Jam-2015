//Prompt for health center ID
var HC=prompt("Health Center ID");

var id;
var strtTime;
var patientInfo;

var ref = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC);
	ref.once("value", function(snapshot){
		var next=snapshot.val().Trackers.Next;//Get next person in queue
		var count=snapshot.val().Trackers.Count;//Get count of persons in queue
		var curr = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC+'/Que/'+next);
		curr.once("value", function(snapshot){
			id=snapshot.val().ID;//get persons ID
		});		
		//Get Patient name based on ID 
		var myRoot = new Firebase("https://dreghisdb.firebaseio.com/");
	    myRoot.child("PatientsRecords").orderByChild("patientId").equalTo(id).once("child_added", function(snapshot){
	    	//Autofill form
	    	var day= Date();
	    	document.getElementById("time").value=day;
	    	document.getElementById("fname").value=snapshot.val().firstName;
	    	document.getElementById("lname").value=snapshot.val().lastName;
		})
	});

function discharge(){
	var ref = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC);
	ref.once("value", function(snapshot){
		next=snapshot.val().Trackers.Next;//Get next person in queue
		count=snapshot.val().Trackers.Count;//Get count of persons in the queue
		var curr = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC+'/Que/'+next);
		curr.once("value", function(snapshot){
			id=snapshot.val().ID;//get persons ID
			strtTime=snapshot.val().EntryTime;
		});		

		//Gather inputted information
		var weight =document.getElementById("weight").value;
		var FeverLen =document.getElementById("FeverLen").value;
		var travel =document.getElementById("travelledTo").value;
		var pmhx =document.getElementById("PMHX").value;
		var allergies =document.getElementById("allergies").value;
		var bp =document.getElementById("bp").value;
		var pulse =document.getElementById("pulse").value;
		var respir =document.getElementById("respiration").value;
		var spo2 =document.getElementById("SPO2").value;
		var temp =document.getElementById("temp").value;
		var nsig =document.getElementById("nSig").value;
		var notes =document.getElementById("notes").value;
		var diag =document.getElementById("diagnosis").value;
		var treat =document.getElementById("treatment").value;
		var dsig =document.getElementById("dSig").value;
		
		//Update Trackers and remove person
		var upd = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC+'/Trackers');
		upd.child('Next').set(next+1);
		upd.child('Count').set(count-1);
		var del = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC+'/Que/'+next);
		del.remove();

		//Send User Id plus Start Time to Clinic History
		var hist = new Firebase('https://dreghisdb.firebaseio.com/HealthCenters/'+HC+'/CenterHistory');
		hist.push({ 'ID': id, 'EntryTime': strtTime });
	});
}