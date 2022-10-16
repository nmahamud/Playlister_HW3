import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with deleting
 * a song. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Nazif Mahamud
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, songInfo) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.songTitle = songInfo.title;
        this.songArtist = songInfo.artist;
        this.songID = songInfo.youTubeId
        this.song = { title:this.songTitle, artist:this.songArtist, youTubeId:this.songID }
    }

    doTransaction() {
        this.store.deleteSongByIndex(this.index);
    }
    
    undoTransaction() {
        this.store.addSongAtIndex(this.index, this.song)
    }
}