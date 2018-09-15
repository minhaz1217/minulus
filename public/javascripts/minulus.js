var app = angular.module("minulus",['ngRoute', 'ngResource']).run(function($rootScope, $http,$location){
    $http.get("/auth/loginCheck").success(function(data){
        if(data.state == "success"){
            $rootScope.current_user = data.user;
            $rootScope.authenticated = true;
        }else{
            $rootScope.current_user = null;
            $rootScope.authenticated = false;
        }
    });
    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = "";
        console.log("HI");
        $location.path("/");
    }
});


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
        controller: "dashBoardcontroller"
    })
    .when('/signup', {
        templateUrl : "signup.html",
        controller: "signController"
    })
    //TODO: make a 404 page and go to 404 page
    .when("/u",{
        templateUrl: "signup.html",
        controller: "messageController"
    })
    .when("/u/:username", {
        templateUrl: "message.html",
        controller: "messageController"
    })
    .when('/:random', {
        templateUrl : "404.html",
        controller: "mainController"
    });
});

app.factory('postService', function($http){
    var factory = {};
    factory.getAll = function(){
        return $http.post("/api/posts", {username: "hello112"}).success(function(status, data){
            if(status == 200){
                return data;
            }else{
                return {error: "NOT FOUND"};                
            }
        });
    }
    return factory;
})
app.controller("mainController", function($scope){

});

app.controller("dashBoardcontroller", function($scope,$rootScope,$location,postService,$http){

    if($rootScope.authenticated == false){
        $location.path("/signin");
        console.log("Sign in first");
        return;
    }else{
        $scope.username = $rootScope.current_user;
        //TODO: must change the website root
        var websiteRoot = "https://minulus.herokuapp.com/#/u/";
        $scope.urlValue = websiteRoot+$scope.username;
        $http.post("/api/posts", {user: $rootScope.current_user}).success(function(data){
            $scope.datas = data;
            //console.log(data);
        });
    }
    

    /*
$scope.username = $rootScope.current_user;
//TODO: must change the website root
var websiteRoot = "http://localhost:3000/#/u/";
$scope.urlValue = websiteRoot+"minhaz";
$http.post("/api/posts", {user: $rootScope.current_user}).success(function(data){
if(data != ""){
    $scope.datas = data;
}else{
    $scope.error_message = "You need to re-login.";
}

});
*/
//   $scope.datas = postService.query();


});

app.controller("signController", function($scope,$http,$rootScope,$location){
    $scope.signin = function(){
        
        var user = {username: $scope.username, password : $scope.password};
        $http.post("/auth/signin", user).success(function(data){
            if(data.state == 'success'){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path("/dashboard");
                console.log("Successful");
            }else{
                $scope.error_message = data.message;
                console.log("Unsuccessful");
            }
        });

    }
    $scope.signup = function(){
        var user = {username: $scope.username, password : $scope.password, created_at : Date.now()};
        $http.post("/auth/signup", user).success(function(data){
            if(data.state == 'success'){
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path("/dashboard");
                console.log("Successful");
            }else{
                $scope.error_message = "Error in signup";
                console.log("Unsuccessful");
            }
        });
    }
});


app.controller("messageController", function($scope, $routeParams, $http, $location){
    
    $scope.data = {username: "", message: "", created_at: ""};
    if($routeParams.username == null){
        $scope.data.username = "null";
    }else{

        console.log($routeParams.username);
        $scope.username = $routeParams.username;
    }
    $scope.data.username = $routeParams.username;
    console.log("Message to : " + $scope.data.username);
    $http.post("/api/u", $scope.data).success(function(data){
        if(data.state == "success"){
            //TODO: remove this log
            console.log("SUCCESS");
        }else{
            console.log("UNSUCCESS");
            $location.path("/signup");
        }
    });



    
    $scope.send = function(){
        $scope.data.created_at = Date.now();
        $http.post("/api/send", $scope.data).success(function(data){
            if(data.state == "success"){
                $scope.success_message = "Message sent.";
                console.log("SUCCESS");
            }else{
                $scope.error_message = "Problem in sending message.";
                console.log("UNSCUCCESSFUL");
            }
        });
    }
});