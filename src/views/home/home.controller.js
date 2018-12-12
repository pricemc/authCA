(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'PostService', 'DomainService', 'FlashService', '$rootScope', '$interval'];
    function HomeController(UserService, PostService, DomainService, FlashService, $rootScope, $interval) {
        var vm = this;

        vm.user;
        vm.allPosts = [];
        vm.config = {
            headers: {
                'Authorization': 'JWT '
            }
        };
        vm.Create = Create;
        vm.Comment = Comment;
        vm.loadAllPosts = loadAllPosts;

        initController();

        function initController() {
            vm.config.headers.Authorization = 'JWT ' + $rootScope.globals.currentUser.authdata;
            loadCurrentUser();
            loadAllPosts();
            $interval(loadAllPosts, 1000);

        }

        function loadCurrentUser() {
            vm.user = $rootScope.globals.currentUser.username;
        }

        function loadAllPosts() {
            PostService.GetAll(vm.config)
                .then(function (posts) {
                    console.log(posts);
                    vm.allPosts = posts;
                })
            
        }

        function Create() {
            vm.dataLoading = true;
            PostService.Create(vm.config, vm.message).then(function (response) {
                if (response.success) {
                    FlashService.Success('Post successful', false);
                    $('#newPostModal').modal('hide');
                    vm.dataLoading = false;
                    vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
                    vm.message = "";
                } else {
                    FlashService.Error(response.data.message);
                    vm.dataLoading = false;
                }
            }).catch((error) => {
                console.log(error);
            });
        }

        function setComment(commentId) {
            vm.commentId = commentId;
        }

        function Comment() {
            vm.dataLoading = true;
            console.log(vm.message);
            PostService.Comment(vm.config, vm.commentId, vm.message).then(function (response) {
                if (response.success) {
                    FlashService.Success('Post successful', false);
                    console.log("here");
                    $('#newCommentModal').modal('hide');
                    vm.dataLoading = false;
                    vm.message = "";
                    vm.loadAllPosts().then((res)=>console.log(res)).catch((err)=>console.log(err));
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