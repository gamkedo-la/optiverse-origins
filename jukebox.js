const NO_SONG = -1;
const SONG_EERIE = 0;
const SONG_POP = 1;
const POP_VOLUME = .25
const EERIE_VOLUME = .4
var lastSongPlaying = NO_SONG;

function prepSongs() {
	intro_song = document.getElementById("intro");
	intro_song.volume = POP_VOLUME;
	eerie_song = document.getElementById("eerie");
	eerie_song.volume = EERIE_VOLUME;

	changeSong(SONG_POP);
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

function loopSong() {
	if(lastSongPlaying == SONG_POP) {
		if (intro_song.ended) {
			changeSong(SONG_EERIE);
		}
	} else if (lastSongPlaying == SONG_EERIE) {
		if (eerie_song.ended) {
			changeSong(SONG_POP);
		}
	}
}

function set_volume_to_low() {
	eerie_song.volume = EERIE_VOLUME/2;
	intro_song.volume = POP_VOLUME/2;
}

function set_volume_to_normal() {
	eerie_song.volume = EERIE_VOLUME;
	intro_song.volume = POP_VOLUME;
}
	