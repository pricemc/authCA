(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['UserService', 'PostService', 'DomainService', 'FlashService', '$rootScope', '$interval'];
    function ProfileController(UserService, PostService, DomainService, FlashService, $rootScope, $interval) {
        var vm = this;

        vm.user;
        vm.allPosts = [];
        vm.config = {
            headers: {
                'Authorization': 'JWT '
            }
        };
        vm.Update = Update;

        initController();

        function initController() {
            vm.config.headers.Authorization = 'JWT ' + $rootScope.globals.currentUser.authdata;
            loadCurrentUser();

            vm.userProfile = $rootScope.globals.currentUser.userProfile;
            console.log(vm);
            console.log($rootScope.globals);
        }

        function loadCurrentUser() {
            UserService.GetCurrentUser(vm.config).then(function (response) {
                if (response.success) {
                    vm.dataLoading = false;
                    //vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            }).catch((error) => {
                console.log(error);
            });
            vm.user = $rootScope.globals.currentUser.username;
        }

        function Update() {
            UserService.UpdateCurrentUser(vm.config, vm.userProfile).then(function (response) {
                if (response.success) {
                    FlashService.Success('Update successful.', false);
                    vm.dataLoading = false;
                    var cookieExp = new Date();
                    cookieExp.setDate(cookieExp.getDate() + 7);
                    $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
                    //vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

})();