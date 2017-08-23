app.controller('MainCtrl', ['$scope', function($scope){
    $scope.hello = 'HELLOWORLD';
}])
.controller('LogInCtrl', ['$scope', function($scope){
    $scope.user = {
        email: "",
        password: ""
    };
    var myData = new Firebase("https://dreghisdb.firebaseio.com/");
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
    //We Get The unique Id from Local Storage
    var uid = localStorage.getItem("uniqueId");
    var myData = new Firebase("https://dreghisdb.firebaseio.com/ ");
 myData.child('PatientsRecords').orderByChild("patientId").equalTo(uid).on("child_added", function(snapshot){
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
    $scope.myData = new Firebase("https://dreghisdb.firebaseio.com/");
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
                alert("error creating user:", error);
            }
            else{
                console.log("Successfully created User account with uid:", userData.uid);
                $http.post("Data/user.json", userData);
                $scope.newPatient.patientId = userData.uid;
                console.log($scope.newPatient);
                location.replace("/#/login");
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