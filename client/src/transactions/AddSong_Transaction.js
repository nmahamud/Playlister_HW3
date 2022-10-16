import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with adding
 * a song. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Nazif Mahamud
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore) {
        super();
        this.store = initStore;
    }

    doTransaction() {
        this.store.addNewSong();
    }
    
    undoTransaction() {
        this.store.deleteSongByIndex(-1);
    }
}