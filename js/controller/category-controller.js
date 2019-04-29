app.controller("categoryController", function ($scope, service, $window) {

    $scope.categories = [];

    service.getCategories().then(function (res) {
        $scope.categories = res.data;
    });

    // phan trang

    $scope.viewby = 4;
    $scope.totalItems = $scope.categories.length;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 3; //Number of pager buttons to show

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first page
    }
    //
    $scope.auth = $window.sessionStorage.getItem('auth');
})
