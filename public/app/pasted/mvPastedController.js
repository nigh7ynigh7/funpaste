app.controller('mvPastedController', ['$scope','$http', function($scope,$http){
    $scope.paste = {};
    $scope.siteURL = "";
    $scope.normalStyle= "";

    var givePaste = function(id){
        $http.get('/paste/'+id).
            success(function(data, status, headers, config) {
                if (data.success) {
                    $scope.paste = {
                        _id : data.paste._id,
                        language : data.paste.language,
                        content: data.paste.content,
                        removalDate: data.paste.removalDate,
                    };

                    $scope.siteURL = siteURL;
                    var block = document.getElementById('display');
                    block.innerHTML = $scope.paste.content.replace(/ /g, '&nbsp;').replace(/(?:\r\n|\r|\n)/g, '<br />');
                    $scope.normalStyle = {};
                    if($scope.paste.language === 'normal'){
                        $scope.normalStyle = {
                            'padding-left' : '7px',
                            'padding-top' : '7px'
                        };
                        return;
                    }
                    hljs.configure({useBR: true});
                    hljs.highlightBlock(block);
                }else {
                    console.log('Something else went wrong.');
                }
            }).error(function(data, status, headers, config) {
                console.log('Something went wrong!');
            }
        );

    };

    givePaste(pasteId);
}]);
