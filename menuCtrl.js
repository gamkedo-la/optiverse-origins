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
        //ctrl.debug = true;

        if(ctrl.debug){
            ctrl.showMenu = true
        }
        $timeout(function(){
            ctrl.showMenu = true
        ctrl.reflect_sound = reflect_sound

        }, 5500)
        ctrl.load = function(levelStr) {
            //getLevel
            LevelEditor.canEdit = false;
            lvlFinished_sound.currentTime = 0
            LoadLevel(levelStr)
            ctrl.showCanvas = true;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            LevelEditor.toggle();
            LevelEditor.toggle();
            //LevelEditor.toggleoff()

       }
       ctrl.showEditor = function(){
            lvlFinished_sound.currentTime = 0
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
        leakMenu = function(){
            $timeout(function(){
                openingSequence = OPENING_SEQUENCE_SHOWING
                ctrl.goToMenu()
            })
            
        }
        ctrl.checkKey = function(e){
            console.log(e.keyCode)
            if(e.keyCode == 27){
                ctrl.goToMenu();
            }
        }

    }]);
var leakMenu = null
