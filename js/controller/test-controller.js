app.controller("testController", function ($scope, service, $routeParams, $timeout, $location, $window) {
    $scope.quizs = [];
    $scope.mark = 0;
    $scope.anws;
    $scope.title = "";

    $scope.showSt = true;
    $scope.showQs = false;
    $scope.showAs = false;
    $scope.showFs = false;

    $scope.selectedListItem = false;

    service.getQuizs($routeParams.id).then(function (res) {
        $scope.quizs = res.data;
    });

    service.getCategories().then(function (res) {
        res.data.forEach(item => {
            if (item.Id == $routeParams.id) {
                $scope.title = item.Name;
            }
        });
    })

    // start test
    $scope.start = function () {
        $scope.showSt = false;
        $scope.showQs = true;

        // clear all
        localStorage.ans = null;
        localStorage.clock = null;

        // set time
        setClock(600);
        $scope.counter = 600;
    }

    // phan trang
    $scope.viewby = 1;
    $scope.totalItems = 10;
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

    // dong ho

    var tim = getClock();

    if (null != tim) {
        $scope.counter = tim;
    } else {
        $scope.counter = 600;
    }
    $scope.onTimeout = function () {
        if ($scope.counter > 0) {
            $scope.counter--;
            //
            setClock($scope.counter);
        } else {
            localStorage.clock = null;

            // save
            var lsAns = getAns();
            var mk = 0;
            lsAns.forEach(item => {
                $scope.quizs.forEach(q => {
                    if (item.dataAns == q.AnswerId) {
                        mk++;
                    }
                });

            });

            $scope.mark = mk;

            var history = getHistory();
            var hs = {};
            // 
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '/' + mm + '/' + yyyy;
            // 
            hs.username = getAuth($window);
            hs.date = today;
            hs.mark = mk;
            hs.category = lsAns[0].category;

            if (null != history) {
                history.push(hs);
            }

            setHistory(history);

            $scope.showAs = false;
            $scope.showFs = true;

            return;
        }

        mytimeout = $timeout($scope.onTimeout, 1000);
    }
    var mytimeout = $timeout($scope.onTimeout, 1000);

    // count mark
    $scope.listAnswer = [];
    model = {};

    $scope.answerQuestion = function (index, data, category) {
        console.log("qs: " + index + ", aws: " + data.selected);
        model.indexAns = index;
        model.dataAns = data.selected;
        model.category = category;
        var lsAns = getAns();

        if (null == lsAns) {
            lsAns = [];
        }

        var chk = false;

        if (null != lsAns) {
            for (var i = 0; i < lsAns.length; i++) {
                if (lsAns[i].indexAns === index) {
                    lsAns[i].dataAns = data.selected;
                    chk = true;
                    break;
                }
            }
        }

        if (chk == false) {
            lsAns.push(model);
        }
        // save to local storage
        setAns(lsAns);
    }

    // checked
    $scope.chkchks = function (index) {
        var lsAns = getAns();
        if (null != lsAns) {
            lsAns.forEach(item => {
                if (item.indexAns === index) {
                    $scope.selectedListItem = item.dataAns;
                }
            });
        }
    }

    //
    $scope.count = function () {
        $scope.showQs = false;
        $scope.showAs = true;

        if (null == getAns()) {
            $scope.lsns = [];
        } else {
            $scope.lsns = getAns();
        }
    }

    $scope.cancel = function () {
        $scope.showQs = true;
        $scope.showAs = false;
    }

    $scope.finish = function () {
        var lsAns = getAns();
        var mk = 0;
        lsAns.forEach(item => {
            $scope.quizs.forEach(q => {
                if (item.dataAns == q.AnswerId) {
                    mk++;
                }
            });

        });

        $scope.mark = mk;

        var history = getHistory();
        var hs = {};
        // 
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        // 
        hs.username = getAuth($window);
        hs.date = today;
        hs.mark = mk;
        hs.category = lsAns[0].category;

        if (null != history) {
            history.push(hs);
        }

        setHistory(history);

        $scope.showAs = false;
        $scope.showFs = true;
    }

    // success
    $scope.success = function () {
        // remove
        localStorage.ans = null;
        localStorage.clock = null;

        var url = '#login';
        $location.path(url);
    }
})

app.filter('secondsToDateTime', [function () {
    return function (seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])


function getAns() {
    if (!localStorage.ans) {
        localStorage.ans = JSON.stringify([]);
    }

    return JSON.parse(localStorage.ans);
}

function setAns(ans) {
    localStorage.ans = JSON.stringify(ans);
}

function getClock() {
    if (!localStorage.clock) {
        localStorage.clock = JSON.stringify([]);
    }

    return JSON.parse(localStorage.clock);
}

function setClock(clock) {
    localStorage.clock = JSON.stringify(clock);
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