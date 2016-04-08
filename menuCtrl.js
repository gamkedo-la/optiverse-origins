angular.module('optiverse', [])
    .controller('menuCtrl', ['$http', "$timeout", function($http, $timeout) {
        var ctrl = this;
        ctrl.showMenu = false
        ctrl.showCanvas = false;
        ctrl.showCutScene = true;
        ctrl.showCredits = false;
        ctrl.testText = "this is a test"
        ctrl.levels = level;
        startOpening()

        if(ctrl.debug){
            ctrl.showMenu = true
        }
        $timeout(function(){
            ctrl.showMenu = true
        }, 5500)

        ctrl.load = function(levelStr) {
            //getLevel
            LevelEditor.canEdit = false;
            LoadLevel(levelStr)
            ctrl.showCanvas = true;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;

            LevelEditor.toggle();
            LevelEditor.toggle();

       }
       ctrl.showEditor = function(){
            LevelEditor.canEdit = true;
            ctrl.showCanvas = true;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            LevelEditor.toggle();
       }

       ctrl.goToCredits = function(){
            LevelEditor.canEdit = false;
            ctrl.showCanvas = false;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            ctrl.showCredits = true;
            
       }

        ctrl.goToMenu = function(){
            LevelEditor.canEdit = false;
            ctrl.showMenu = true
            ctrl.showCanvas = false;
            ctrl.showCutScene = true;
            ctrl.showCredits = false;
        }

    }]);
