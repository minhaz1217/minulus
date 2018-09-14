var app = angular.module("minulus",['ngRoute']);


app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl : "home.html",
        controller: "mainController"
    })
    .when('/signin', {
        templateUrl : "signin.html",
        controller: "signController"
    })
    .when('/dashboard', {
        templateUrl : "dashboard.html",
        controller: "mainController"
    })
    .when('/signup', {
        templateUrl : "signup.html",
        controller: "signController"
    })
    //TODO: make a 404 page and go to 404 page
    .when("/u",{
        templateUrl: "message.html",
        controller: "userController"
    })
    .when("/u/:username", {
        templateUrl: "message.html",
        controller: "userController"
    });
});


app.controller("mainController", function($scope){

});

app.controller("signController", function($scope,$http){
    $scope.signin = function(){
        var user = {username: $scope.username, password : $scope.password};
        $http.post("/auth/signin", user).success(function(data){
            if(data.state == 'success'){
                console.log("SUCCESS");
            }else{
                console.log("Unsuccessful");
            }
        });

    }
    $scope.signup = function(){
        var user = {username: $scope.username, password : $scope.password, created_at : Date.now()};
        $http.post("/auth/signup", user).success(function(data){
            if(data.state == 'success'){
                console.log("SUCCESS");
            }else{
                console.log("Unsuccessful");
            }
        });
    }
});


app.controller("userController", function($scope, $routeParams, $http){
    
    $scope.data = {username: "", message: "", created_at: ""};


    if($routeParams.username == null){
        $scope.data.username = "null";
    }else{
        console.log($routeParams.username);
        $scope.username = $routeParams.username;
    }

    $scope.data.username = $scope.username;
    

    $scope.send = function(){
        $scope.data.created_at = Date.now();
        $http.post("/api/send", $scope.data).success(function(data){
            if(data.state == "success"){
                console.log("SUCCESS");
            }else{
                console.log("UNSCUCCESSFUL");
            }
        });
    }
});