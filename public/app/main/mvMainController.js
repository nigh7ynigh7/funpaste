app.controller('mvMainController', ['$http','$scope',function($http, $scope){
    this.lang = 'normal';
    this.content = '';
    this.upTime = 5;

    $scope.showPaste = false;

    $scope.pasted = {};

    this.paste = function(content, language, time){
        $http.post('/create', {
            content:content,
            language:language,
            upTime:time
        }).then(
            function(persisted){
                if (persisted.data.success) {
                    console.log('its in');
                    $scope.pasted = persisted.data.paste;
                    $scope.showPaste = true;

                    console.log($scope.pasted);

                    var block = document.getElementById('display');
                    block.innerHTML = $scope.pasted.content.replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
                    hljs.configure({useBR: true});
                    hljs.highlightBlock(block);
                }
                else {
                    console.log("it's not in.");
                    this.showPaste = false;
                    this.paste = {};
                }
            }
        );
    };
}]);
