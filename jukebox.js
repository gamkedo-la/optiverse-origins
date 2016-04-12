const NO_SONG = -1;
const SONG_EERIE = 0;
const SONG_POP = 1;
var lastSongPlaying = NO_SONG;

function prepSongs() {
	intro_song = document.getElementById("intro");
	intro_song.volume = .25;
	eerie_song = document.getElementById("eerie");
	eerie_song.volume = .4;

	changeSong(SONG_EERIE);
}

function stopMusic() {
	switch(lastSongPlaying) {
		case SONG_EERIE:
			eerie_song.pause();
			break;
		case SONG_POP:
			intro_song.pause();
			break;
	}
	lastSongPlaying = NO_SONG;
}

function changeSong(toSong) {
	if(lastSongPlaying != toSong) {
		lastSongPlaying = toSong;
	} else {
		return;
	}

	var songFrom = (toSong == SONG_EERIE ? intro_song : eerie_song);
	var songTo = (toSong == SONG_EERIE ? eerie_song : intro_song);
	
	songFrom.pause();
	songFrom.controls = false;
    songTo.currentTime = 0;
    songTo.play();
    songTo.controls = true;
}