(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['AuthenticationService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(AuthenticationService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function register() {
            vm.dataLoading = true;
            AuthenticationService.Register(vm.username, vm.password, function (response) {
                if (response.data.success) {
                    AuthenticationService.SetCredentials(vm.username, response.data.token, response.data.userProfile);
                    FlashService.Success('Registration successful', true);
                    $location.path('/');
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            });
        }


    }

})();
