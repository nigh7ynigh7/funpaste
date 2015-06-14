app.controller('mvMainController', ['$http',function($http){
    this.lang = 'normal';
    this.content = '';
    this.timeUp = 5;

    this.paste = function(content, language, time){
        $http.post('/create', {
            content:content,
            language:language,
            upTime:time
        }).then(
            function(persisted){
                if (persisted) {
                    console.log('its in');
                }
                else {
                    console.log("it's not in.");
                }
            }
        )
    };
}]);
