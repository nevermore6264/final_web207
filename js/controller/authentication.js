app.controller("authenticationController", function ($scope, $location, $window) {
    $scope.user = {};

    $scope.done = function () {

        var lsUser = getUser();

        if (null == lsUser) {
            lsUser = [];
        }

        var chk = true;

        if (null != lsUser) {
            lsUser.forEach(u => {
                if (u.username == $scope.user.username) {
                    $scope.success = null;
                    $scope.fail = "Tên đăng nhập đã tồn tại, vui lòng kiểm tra lại";
                    chk = false;
                }
            });
        }

        if (chk) {
            lsUser.push(angular.copy($scope.user));
            // save to local storage
            setUser(lsUser);
            $scope.success = "Tạo mới user thành công"
            $scope.fail = null;

            $scope.user = null;
        }

    }

    $scope.login = function () {
        var lsUser = getUser();
        console.log(lsUser);

        var chk = -1;
        // default

        if (null == lsUser) {
            lsUser = [];
            chk = 0;
            // null
        }

        if (null != lsUser) {
            lsUser.forEach(u => {
                console.log(u.username);
                if ($scope.user.username == u.username) {
                    if (u.password == $scope.user.password) {
                        chk = 1;
                        // login
                    } else {
                        chk = -1;
                        // sai pass
                    }
                }
            });
        }

        if (chk === 0) {
            $scope.success = null;
            $scope.fail = "Tài khoản không tồn tại, vui lòng tạo tài khoản rồi tiếp tục";
        } else if (chk === -1) {
            $scope.success = null;
            $scope.fail = "Mật khẩu sai, vui lòng thử lại";
        } else {
            setAuth($scope.user.username, $window);
            $window.location.reload();

            $scope.success = "Đăng nhập thành công";
        }
    }
    $scope.auth = $window.sessionStorage.getItem('auth');

    $scope.his = [];

    var hs = getHistory();
    hs.forEach(item => {
        if (item.username == $scope.auth) {
            $scope.his.push(item);
        }
    });

    $scope.changePass = function () {
        var lsUser = getUser();
        var chk = -1;
        console.log(lsUser);
        lsUser.forEach(item => {
            if (item.username == $scope.user.username) {
                if (item.password == $scope.user.prePassword) {
                    item.password = $scope.user.newPassword;
                    chk = 1;
                } else {
                    chk = 0;
                }
            }
        });

        setUser(lsUser);

        if (chk === 1) {
            $scope.success = "Đổi mật khẩu thành công";
            $scope.fail = null;
            $scope.user = null;
        } else if (chk === -1) {
            $scope.success = null;
            $scope.fail = "Đổi mật khẩu thất bại, Xem lại tên truy cập hoặc lỗi khác";
        } else if (chk === 0) {
            $scope.success = null;
            $scope.fail = "Mật khẩu cũ không đúng";
        }
    }

    $scope.fogot = function () {
        var lsUser = getUser();
        var chk = -1;
        var value = "";
        console.log(lsUser);
        lsUser.forEach(item => {
            if (item.username == $scope.user.username) {
                if (item.email == $scope.user.email) {
                    value = item.password;
                    chk = 1;
                } else {
                    chk = 0;
                }
            }
        });

        if (chk === 1) {
            $scope.success = value;
            $scope.fail = null;
            $scope.user = null;
        } else if (chk === -1) {
            $scope.success = null;
            $scope.fail = "Lấy mật khẩu thất bại, Xem lại tên truy cập hoặc lỗi khác";
        } else if (chk === 0) {
            $scope.success = null;
            $scope.fail = "Email không đúng";
        }
    }

    var us = getUser();
    $scope.em = "";
    us.forEach(item => {
        if (item.username == $scope.auth) {
            $scope.em = item.email;
        }
    });

    $scope.changeInfo = function () {
        var lsUser = getUser();
        var chk = -1;
        console.log(lsUser);
        lsUser.forEach(item => {
            if (item.username == $scope.auth) {
                item.email = $scope.em;
                chk = 1;
            }
        });

        setUser(lsUser);

        if (chk === 1) {
            $scope.success = "Đổi email thành công";
            $scope.fail = null;
            $scope.user = null;
        } else if (chk === -1) {
            $scope.success = null;
            $scope.fail = "Đổi email thất bại, Xem lại tên truy cập hoặc lỗi khác";
        }
    }
})

app.directive("compareTo", function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});

function getUser() {
    if (!localStorage.user) {
        localStorage.user = JSON.stringify([]);
    }

    return JSON.parse(localStorage.user);
}

function setUser(user) {
    localStorage.user = JSON.stringify(user);
}

function getAuth($window) {
    return $window.sessionStorage.getItem('auth');
}

function setAuth(auth, $window) {
    $window.sessionStorage.setItem('auth', auth);
}

function getHistory() {
    if (!localStorage.history) {
        localStorage.history = JSON.stringify([]);
    }

    return JSON.parse(localStorage.history);
}

function setHistory(history) {
    localStorage.history = JSON.stringify(history);
}