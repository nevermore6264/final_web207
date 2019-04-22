app.service('service', function ($http) {
    
    this.getCategories = function () { 
        return $http.get("db/Subjects.js");
     }

     this.getQuizs = function(index){
         return $http.get("db/Quizs/" + index + ".js");
     }
})