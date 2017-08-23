app.controller('MainCtrl', ['$scope', function($scope){
    $scope.hello = 'HELLOWORLD';
}])
.controller('LogInCtrl', ['$scope', function($scope){
    $scope.hello = 'HELLOWORLD';
    $scope.user = {
        email: "",
        password: ""
    };
    var myData = new Firebase("https://codejam.firebaseio.com/");
    $scope.logIn = function(){
        myData.authWithPassword({
            email: $scope.user.email,
            password : $scope.user.password
        }, function(error, authData){
            if(error){
                console.log("Login Failed", error);
            } else {
                console.log("Authenticated successfully with payload", authData);
                //We store the unique id locally so that it can be retrieved by the user controller later. NB data cannot be transfered between controllers.
                localStorage.setItem("uniqueId", authData.uid);
                //we switch to the user page.
                location.replace("/#/user");
            }
        });
    }
    
}])
.controller('UserCtrl', ['$scope', function($scope){
    var userData, ref;
    $scope.name = "We Got This Shit";
    //We Get The unique Id from Local Storage
    var uid = localStorage.getItem("uniqueId");
    console.log("We Got this Shit", uid);
    var myData = new Firebase("https://codejam.firebaseio.com/");
    //Using The unique Id, we can retrieve the Patient Data from The patient Records child on the firebase Database
 myData.child('PatientsRecords').orderByChild("patientId").equalTo(uid).once("child_added", function(snapshot){
        console.log(snapshot.val());
    })
    
}])
.controller('SignUpCtrl', ['$scope', '$http', function($scope, $http){
    //The scope is used for data that will be presented or retrieved for the html page. If data will not be used on the actual html page, it does not need to be attached to the scope 
    $scope.newUser = {
        email: "",
        password: ""
    };
    $scope.newPatient = {
        patientId: "",
        firstName: "",
        lastName: "",
        address: "",
        bloodType: "",
        EfirstName: "",
        ElastName: "",
        Erelationship: "",
        Ephone: "",
        History: {
             VisitCount: 0
        }
    };
    $scope.myData = new Firebase("https://codejam.firebaseio.com/");
    //functions that will be called as a result of an event on the html page can aslo be attached to the scope
    $scope.save = function(){
        console.log($scope.newUser);
        //console.log($scope.newPatient);
        $scope.myData.createUser({
            email: $scope.newUser.email,
            password : $scope.newUser.password
        }, function(error, userData){
            if(error){
                console.log("Error creating User:", error);
            }
            else{
                console.log("Successfully created User account with uid:", userData.uid);
                $http.post("Data/user.json", userData);
                $scope.newPatient.patientId = userData.uid;
                console.log($scope.newPatient);
                $scope.myData.child('PatientsRecords').push($scope.newPatient);
                //The above line adds the new patient under the patint records section on firebase
            }
        });
    };
}])
.controller('NurseCtrl', ['$scope', function($scope){
    var Queue = function(){
        this.count = 0, this.head = 0, this.tail = -1, this.queueData = [];
         
        
    };
}])
.controller('MapCtrl', ['$scope', function($scope){
    var map;
    var myLatLng = {lat: 10.4, lng: -61.4};
    var list = [], heatMap, numPatients = 20;
    var patient = {
        location: new google.maps.LatLng(10.4, -61.4),
        weight: 10
    };
    for(i = 0; i < numPatients; i++){
        list.push(patient);
    }
    function initialize(){
            var mapOptions = {
                zoom: 10, 
                center: new google.maps.LatLng(10.4, -61.4)
            };
            map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var pointArray = new google.maps.MVCArray(list);
        heatMap = new google.maps.visualization.HeatmapLayer({
            data: pointArray,
            radius: 30

        });
        heatMap.setMap(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    
}])