(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.Register = Register;

        return service;

        function Login(username, password, callback) {

            $http.post('/api/auth/login', { username: username, password: password })
                .then(function (response) {
                    callback(response);
                }).catch(function (response) {
                    callback(response);
                });

        }

        function Register(username, password, callback) {
            $http.post('/api/auth/register', { 'username': username, 'password': password })
                .then((response) => callback(response)).catch((response) =>callback(response));

        }

        function SetCredentials(username, token, userProfile) {

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: token,
                    userProfile: userProfile
                }
            };
            // set default auth header for http requests
            //$http.defaults.headers.common.Authorization = 'JWT ' + authdata;
            $http.defaults.headers.common['Authorization'] = 'JWT ' + $rootScope.globals.currentUser.authdata;


            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'JWT ';
        }
    }

})();