var app = angular.module("app", ["ngRoute", 'ui.bootstrap']);

app.controller("mainCtrl", function($scope, $window){
    $scope.sections = [
        {name: 'Trang chủ', url: '#home'},
        {name: 'Liên hệ', url: '#contact'},
        {name: 'Danh mục', url: '#category'},
        // {name: 'Hỏi đáp', url: '#ask'}
    ];

    $scope.setMaster = function(section) {
        $scope.selected = section;
    }

    $scope.isSelected = function(section) {
        return $scope.selected === section;
    }

    $scope.auth = $window.sessionStorage.getItem('auth');

    
    $scope.logout = function () {
        console.log("logout");
        $window.sessionStorage.setItem('auth', null);
        $window.location.reload();
    }
})

app.config(function($routeProvider) { 
    $routeProvider
    .when("/",{
        redirectTo: "/home"
    })
    .when("/contact", {
        templateUrl: "lien-he.html"
    })
    .when("/home",{
        templateUrl: "home.html",
        controller: 'homeController'
    })
    .when("/category",{
        templateUrl: "danh-muc.html",
        controller: "categoryController"
    })
    .when("/ask", {
        templateUrl: "hoi-dap.html"
    })
    .when("/login", {
        templateUrl: "dang-nhap.html",
        controller: 'authenticationController'
    })
    .when("/logon", {
        templateUrl: "dang-ky.html",
        controller: 'authenticationController'
    })
    .when("/fogot", {
        templateUrl: "quen-mat-khau.html",
        controller: 'authenticationController'
    })
    .when("/changePass", {
        templateUrl: "doi-mat-khau.html",
        controller: 'authenticationController'
    })
    .when("/ChangeInfo", {
        templateUrl: "doi-thong-tin.html",
        controller: 'authenticationController'
    })
    .when("/test/:id", {
        templateUrl: "thi.html",
        controller: "testController"
    })
    .otherwise({
		redirectTo: "/home"
	})
 })
 
app.run(function($rootScope){
	$rootScope.$on('$routeChangeStart', function(){
		$rootScope.loading = true;
	});

	$rootScope.$on('$routeChangeSuccess', function(){
		$rootScope.loading = false;
	});

	$rootScope.$on('$routeChangeError', function(){
		$rootScope.loading = false;
		alert("Lỗi, không tải được trang");
	});
});