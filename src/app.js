(function () {
    'use strict';

    var app = angular
        .module('app', ['ngRoute', 'ngCookies', 'angularMoment'])
        .config(config)
        .run(run);

    // app.constant('angularMomentConfig', {
    //     preprocess: 'unix', // optional
    //     timezone: 'America/Denver' // optional
        
    // });
    //app.constant('moment', 'moment-timezone');
    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                name: 'Home',
                controller: 'HomeController',
                templateUrl: 'views/home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                name: 'Login',
                controller: 'LoginController',
                templateUrl: 'views/login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                name: 'Register',
                controller: 'RegisterController',
                templateUrl: 'views/register/register.view.html',
                controllerAs: 'vm'
            })
            .when('/profile', {
                name: 'Profile',
                controller: 'ProfileController',
                templateUrl: 'views/profile/profile.view.html',
                controllerAs: 'vm'
            })
            .when('/404', {
                name: '404',
                templateUrl: 'views/404.view.html'
            })

            .otherwise({
                redirectTo: '/404'
            });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'JWT ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
            var fullRoute = current.$$route.originalPath,
                routeParams = current.params,
                resolvedRoute;

            console.log(fullRoute);
            console.log(routeParams);

            resolvedRoute = fullRoute.replace(/:id/, routeParams.id);
            console.log(resolvedRoute);
            $rootScope.fullRoute = fullRoute;
            $rootScope.fullRoute = routeParams;
            $rootScope.fullRoute = resolvedRoute;

        });

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
        $http.get('/build')
            .then(handleSuccess)
            .catch(handleError);

        function handleSuccess(response) {
            console.log(response);
            $rootScope.build = response.data.build;
            $rootScope.time = response.data.time;

        }

        function handleError(err) {
            console.error(err);
        }
    }

})();