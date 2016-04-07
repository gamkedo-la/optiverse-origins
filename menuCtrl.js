angular.module('optiverse', [])
    .controller('menuCtrl', ['$http', function($http) {
        var ctrl = this;
        ctrl.showMenu = true
        ctrl.testText = "this is a test"
        ctrl.levels = level;
        ctrl.load = function(levelStr) {
            //getLevel
            LoadLevel(levelStr)
            ctrl.showMenu = false;

            LevelEditor.toggle();
            LevelEditor.toggle();

        }
    }]);
