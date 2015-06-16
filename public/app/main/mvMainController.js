app.controller('mvMainController', ['$http','$scope',function($http, $scope){
    this.lang = 'normal';
    this.content = '';
    this.upTime = 5;

    $scope.showPaste = false;

    $scope.pasted = undefined;

    $scope.removalDate = 0;

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

                    $scope.siteURL = persisted.data.siteURL;

                    $scope.removalDate =new Date($scope.pasted.removalDate);


                    var block = document.getElementById('display');
                    block.innerHTML = $scope.pasted.content.replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
                    $scope.normalStyle = {};
                    if($scope.pasted.language === 'normal'){
                        $scope.normalStyle = {
                            'padding-left' : '7px',
                            'padding-top' : '7px'
                        };
                        return;
                    }
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


    this.forceGo = function(){
        if ($scope.siteURL && $scope.pasted) {
            window.location = $scope.siteURL + $scope.pasted._id;
            window.location.reload();
        }
    };
}]);
