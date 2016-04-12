angular.module('optiverse', [])
    .controller('menuCtrl', ['$http', "$timeout", function($http, $timeout) {
        var ctrl = this;
        ctrl.showMenu = false
        ctrl.showCanvas = false;
        ctrl.showCutScene = true;
        ctrl.showCredits = false;
        ctrl.testText = "this is a test"
        ctrl.levels = level;
        ctrl.LevelEditor = LevelEditor;
        startOpening()
        //ctrl.debug = true;
        ctrl.currentSeries = 'Intro';
        ctrl.index = 0
        ctrl.series = series;
        ctrl.seriesKeys = ['Intro', 'Total Internal Reflection', 'Mixed Mechanics', 'marc', 'erik', 'dan']
    


        ctrl.timer = $timeout(function(){
            ctrl.showMenu = true
            ctrl.reflect_sound = reflect_sound
        }, 3000)

        ctrl.incSeries = function(){
            if(ctrl.index < ctrl.seriesKeys.length - 1){
                ctrl.index += 1;
                ctrl.currentSeries = ctrl.seriesKeys[ctrl.index]
            }
        }

        ctrl.decSeries = function(){
            if(ctrl.index != 0){
                ctrl.index -= 1;
                ctrl.currentSeries = ctrl.seriesKeys[ctrl.index]
            }
        }

        ctrl.load = function(levelStr) {
            //set background 
            if(ctrl.currentSeries == "Intro") {
                background = bg2;
            } else if(ctrl.currentSeries == "Total Internal Reflection") {
                background = bg4;
            } else if(ctrl.currentSeries == "Mixed Mechanics") {
                background = bg1;
            } else {
                background = bg3;
            }

            LevelEditor.selectedBrush = null;
            if(LevelEditor.active)
                LevelEditor.toggle();

            changeSong(SONG_POP);

            isBattleGraphicsLevel = !isBattleGraphicsLevel;
            
            //getLevel
            LevelEditor.canEdit = false;
            lvlFinished_sound.currentTime = 0
            LoadLevel(levelStr)
            ctrl.showCanvas = true;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            ctrl.showlevels = false;
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
            if(LevelEditor.active == false)
                LevelEditor.toggle();
       }

      ctrl.showLevels = function(){            
            lvlFinished_sound.currentTime = 0
            LevelEditor.canEdit = false;
            ctrl.showCanvas = false;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            ctrl.showlevels = true;
       }

       ctrl.goToCredits = function(){
            
            LevelEditor.canEdit = false;
            ctrl.showCanvas = false;
            ctrl.showMenu = false;
            ctrl.showCutScene = false;
            ctrl.showCredits = true;
            
       }

        ctrl.goToMenu = function(){
            console.log("cancel timer")
            $timeout.cancel(ctrl.timer)
            LevelEditor.canEdit = false;
            ctrl.showMenu = true
            ctrl.showCanvas = false;
            ctrl.showCutScene = true;
            ctrl.showCredits = false;
            ctrl.showlevels = false;
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

        if(ctrl.debug){
            ctrl.goToMenu();
            intro.pause();
        }

    }]);
var leakMenu = null
var background = null;
