app.controller("homeController", function ($scope, service, $window) {

    $scope.categories = [];

    service.getCategories().then(function (res) {
        $scope.categories = res.data;
    });
    //
    $scope.auth = $window.sessionStorage.getItem('auth');
})