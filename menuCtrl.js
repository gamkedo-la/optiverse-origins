angular.module('optiverse', [])
    .controller('menuCtrl', ['$http', "$timeout", function($http, $timeout) {
        var ctrl = this;
        ctrl.showMenu = false
        ctrl.showCanvas = false;
        ctrl.showCutScene = true;
        ctrl.testText = "this is a test"
        ctrl.levels = level;
        startOpening()
        $timeout(function(){
            ctrl.showMenu = true
        }, 6000)

        ctrl.load = function(levelStr) {
            //getLevel
            LoadLevel(levelStr)
            ctrl.showCanvas = true;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;

            LevelEditor.toggle();
            LevelEditor.toggle();

        }
    }]);
