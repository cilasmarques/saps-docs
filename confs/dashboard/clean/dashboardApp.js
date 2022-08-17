var app = angular.module('schedulerDashboard', [
    'dashboardControllers',
    'dashboardServices',
    'ngSanitize',
    'ngRoute'
    //'ui.bootstrap'
]);

let scriptsTags =
{
  "inputdownloading":[
    {
      "name":"usgsapis",
      "docker_tag":"usgsapis",
      "docker_repository":"fogbow/inputdownloader",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"googleapis",
      "docker_tag":"googleapis",
      "docker_repository":"fogbow/inputdownloader",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"nop",
      "docker_tag":"nop",
      "docker_repository":"fogbow/inputdownloader",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-fake-files",
      "docker_tag":"nop-fake-files",
      "docker_repository":"fogbow/inputdownloader",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-download-files",
      "docker_tag":"nop-download-files",
      "docker_repository":"fogbow/inputdownloader",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name": "endtoend-test",
      "docker_tag": "endtoend-test",
      "docker_repository": "fogbow/inputdownloader",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    }
  ],
  "preprocessing":[
    {
      "name":"default",
      "docker_tag":"default",
      "docker_repository":"fogbow/preprocessor",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"legacy",
      "docker_tag":"legacy",
      "docker_repository":"fogbow/preprocessor",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"nop",
      "docker_tag":"nop",
      "docker_repository":"fogbow/preprocessor",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-fake-files",
      "docker_tag":"nop-fake-files",
      "docker_repository":"fogbow/preprocessor",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-download-files",
      "docker_tag":"nop-download-files",
      "docker_repository":"fogbow/preprocessor",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name": "endtoend-test",
      "docker_tag": "endtoend-test",
      "docker_repository": "fogbow/preprocessor",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    }
  ],
  "processing":[
    {
      "name":"ufcg-sebal",
      "docker_tag":"ufcg-sebal",
      "docker_repository":"fogbow/worker",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"sebkc-sebal",
      "docker_tag":"sebkc-sebal",
      "docker_repository":"fogbow/worker",
      "memory_usage":"12G",
      "cpu_usage":"1000m"
    },{
      "name":"nop",
      "docker_tag":"nop",
      "docker_repository":"fogbow/worker",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-fake-files",
      "docker_tag":"nop-fake-files",
      "docker_repository":"fogbow/worker",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name":"nop-download-files",
      "docker_tag":"nop-download-files",
      "docker_repository":"fogbow/worker",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    },{
      "name": "endtoend-test",
      "docker_tag": "endtoend-test",
      "docker_repository": "fogbow/worker",
      "memory_usage":"16G",
      "cpu_usage":"1000m"
    }
  ]
};

app.constant("appConfig", {
    "urlSapsService": "http://10.11.19.41:8091/",
    "authPath": "users?auth",
    "authCreatePath":"users?register",
    "submissionPath": "processings",
    "regionDetailsPath": "regions/details",
    "imagesProcessedSearch":"regions/search",
    "emailPath": "email",
    "LOGIN_SUCCEED": "login.succeed",
    "LOGIN_FAILED": "login.failed",
    "LOGOUT_SUCCEED": "logout.succed",
    "DEFAULT_SB_VERSION": "version-001",
    "DEFAULT_SB_TAG": "tag-001",
    "SATELLITE_OPTS": [{
        "label": "Landsat 4",
        "value": "l4"
    }, {
        "label": "Landsat 5",
        "value": "l5"
    }, {
        "label": "Landsat 7",
        "value": "l7"
    }],
    "MODAL_OPENED": "modalOpened",
    "MODAL_CLOSED": "modalClosed",
    "scriptsTags": scriptsTags
});

//Initializing controllers module.
angular.module('dashboardControllers', ['ngTable', 'ngMessages', 'ngMaterial']);

//Global Functions available on pages
app.run(function($rootScope) {

    $rootScope.switchVisibility = function() {
        for (var index = 0; index < arguments.length; index++) {

            var elementId = arguments[index];
            console.log('Changing visibility for : ' + elementId);
            if ("string" === typeof elementId) {
                var element = $("#" + elementId);
                if (element.hasClass("sb-hidden")) {
                    element.removeClass("sb-hidden");
                } else {
                    element.addClass("sb-hidden");
                }
            }
        }
    };
    $rootScope.showHide = function() {
        console.log("CALL: showHide");
        for (var index = 0; index < arguments.length; index++) {
            var elementId = arguments[index];
            if ("string" === typeof elementId) {
                $("#" + elementId).toggle();;
            }
        }
    };

    $rootScope.validateDate = function(date) {

        console.log("Validating " + date)

        re = /^[0-3]?[0-9]\/[01]?[0-9]\/[12][90][0-9][0-9]$/

        if (date == '' || !date.match(re)) {
            console.log("Date " + date + " is invalid")
            return false;
        }
        console.log("Date " + date + " is valid")
        return true;
    };
    $rootScope.parseDate = function(date) {

        var arrDate = date.split("/");

        // console.log("arrDate: "+JSON.stringify(arrDate))

        var d = parseInt(arrDate[0], 10),
            m = parseInt(arrDate[1], 10),
            y = parseInt(arrDate[2], 10);
        // console.log("Creating date: d"+d+" - m"+m+" - y"+y)
        return new Date(y, m - 1, d);
    };
    $rootScope.parseDateUS = function(date) {

        var arrDate = date.split("-");

        // console.log("arrDate: "+JSON.stringify(arrDate))

        var d = parseInt(arrDate[2], 10),
            m = parseInt(arrDate[1], 10),
            y = parseInt(arrDate[0], 10);
        // console.log("Creating date: d"+d+" - m"+m+" - y"+y)
        return new Date(y, m - 1, d);
    };

    $rootScope.validateString = function(str) {
        var isValid = true;

        isValid = !(!str || 0 === str.length);
        if (!isValid) {
            return isValid;
        }
        isValid = !(!str || /^\s*$/.test(str));
        if (!isValid) {
            return isValid;
        }
        isValid = !(str.length === 0 || !str.trim());
        return isValid;
    };

    function loadDefaultLang() {
        $rootScope.languageOptions = langLoader.getLangAvailables();
        //console.log("Lang opt "+JSON.stringify($rootScope.languageOptions))
        var lang = langLoader.getDefault();
        if (lang !== undefined) {
            console.log("Lang chosen " + JSON.stringify($rootScope.languageOptions[langLoader.defaultIndex]))
            $rootScope.languageContent = lang.content;
            $rootScope.languageChosen = $rootScope.languageOptions[langLoader.defaultIndex];
        }
    }
    loadDefaultLang();

    $rootScope.heatMap = {
        transparency: 0.25,
        colours: [{
            "minValue": undefined,
            "maxValue": 0,
            "r": 255,
            "g": 255,
            "b": 178
        }, {
            "minValue": 1,
            "maxValue": 300,
            "r": 254,
            "g": 217,
            "b": 118
        }, {
            "minValue": 301,
            "maxValue": 500,
            "r": 254,
            "g": 178,
            "b": 76
        }, {
            "minValue": 501,
            "maxValue": 700,
            "r": 253,
            "g": 141,
            "b": 60
        }, {
            "minValue": 701,
            "maxValue": 900,
            "r": 240,
            "g": 59,
            "b": 32
        }, {
            "minValue": 901,
            "maxValue": undefined,
            "r": 189,
            "g": 0,
            "b": 38
        }, ]
    }
});

app.config(function($logProvider) {
    $logProvider.debugEnabled(true);
});
app.config(function($routeProvider, $locationProvider) {

    var checkUser = function($location, AuthenticationService) {
        if (!AuthenticationService.getCheckUser()) {
            $location.path("/");
        }
    }

    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl: '/pages/login.html',
        })
        .when('/new-user', {
            templateUrl: '/pages/create_user.html',
        })
        .when('/regions-map', {
            resolve: {
                "check": checkUser
            },
            templateUrl: '/pages/regions_map.html',
        })
        .when('/submissions-list', {
            resolve: {
                "check": checkUser
            },
            templateUrl: '/pages/submissions_list.html',
        })
        .when('/test', {
            resolve: {
                "check": checkUser
            },
            templateUrl: '/pages/teste.html',
        })
        .when('/help', {
            resolve: {
                "check": checkUser
            },
            templateUrl: '/pages/help.html',
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(false);
});
app.config(
    function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            if (date === undefined) {
                return '';
            } else {
                return moment(date).format('YYYY-MM-DD');
            }
        };
    }
);

app.filter('offset', function() {
    return function(input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});
