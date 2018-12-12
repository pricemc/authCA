(function () {
    'use strict';

    angular
        .module('app')
        .factory('PostService', PostService);

    PostService.$inject = ['$http'];
    function PostService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.Create = Create;
        service.Comment = Comment;
        service.Delete = Delete;

        return service;

        function GetAll(config) {
            return $http.get('/api/post', config).then(handleSuccess).catch(handleError('Error getting all posts'));
        }

        function Create(config, post) {
            return $http.post('/api/post', {message: post}, config).then(handleSuccess).catch(handleError('Error creating post'));
        }

        function Comment(config, post, comment) {
            return $http.post('/api/post/comment', { post: post, comment: comment }, config).then(handleSuccess).catch(handleError('Error creating comment'));
        }

        function Delete(config, id) {
            return $http.post('/api/post/delete', id, config).then(handleSuccess).catch(handleError('Error deleting post'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }


    }

})();
