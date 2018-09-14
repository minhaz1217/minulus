var app = angular.module("minulus",['ngRoute', 'ngResource']).run(function($rootScope){

    if($rootScope.authenticated == null || $rootScope.authenticated == false){
        $rootScope.authenticated = false;
        $rootScope.current_user = "";
    }

        $rootScope.authenticated = false;
        $rootScope.current_user = "";
    $rootScope.signout = function(){
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = "";
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
        templateUrl: "message.html",
        controller: "userController"
    })
    .when("/u/:username", {
        templateUrl: "message.html",
        controller: "userController"
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
    /*
    if($rootScope.authenticated == false){
        $location.path("/signin");
        console.log("Sign in first");
        return;
    }else{
        $scope.username = $rootScope.current_user;
    }
    */
   $scope.username = $rootScope.current_user;

   /*
   postService.getAll().success(function(data){
       $scope.datas = data;
   });
   */
  $http.post("/api/posts", {user: $rootScope.current_user}).success(function(data){
    if(data != ""){
        $scope.datas = data;
    }else{
        $scope.error_message = "You need to re-login.";
    }

});
//   $scope.datas = postService.query();


})

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
                $scope.error_message = data.message;
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