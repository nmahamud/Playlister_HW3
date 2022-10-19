import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api, { getAllPlaylists, getPlaylistById, deletePlaylistById, editPlaylistById } from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
// import { deletePlaylistById } from '../../../server/controllers/playlist-controller';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    DELETE_MARKED_LIST: "DELETE_MARKED_LIST",
    MARK_INDEX_FOR_DELETION: "MARK_INDEX_FOR_DELETION",
    ADD_SONG: "ADD_SONG",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listForDeletion: null,
        indexDelete: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listForDeletion: payload.playlist
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listForDeletion: null
                });
            }
            case GlobalStoreActionType.MARK_INDEX_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    indexDelete: payload
                });
            }
            case GlobalStoreActionType.ADD_SONG: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    indexDelete: null
                });
            }
            case GlobalStoreActionType.MARK_INDEX_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    indexDelete: payload
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    indexEdit: payload
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
        tps.clearAllTransactions();
    }

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let newList = {name: "Untitled-"+store.newListCounter, songs:[]};
            let playlist = await api.createPlaylist(newList);
            if (playlist.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist.data.playlist
                });
                store.history.push("/playlist/"+ playlist.data.playlist._id);
            }
        }
        asyncCreateNewList();
    }

    store.markDeleteList = function (id) {
        async function asyncMarkDeleteList() {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {
                        playlist: playlist
                    }
                })
                // store.history.push("/playlist/"+playlist._id);
                store.showDeleteListModal();
            }
        }
        asyncMarkDeleteList();
    }

    store.deleteList = function () {
        async function asyncDeleteList() {
            let response = await deletePlaylistById(store.listForDeletion._id);
            if (response.data.success) {
                // let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.DELETE_MARKED_LIST
                });
                store.loadIdNamePairs();
            }
            store.hideDeleteListModal();
        }
        asyncDeleteList();
    }

    store.addNewSong = function() {
        async function asyncAddNewSong() {
            let response = await getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.push({title: "Untitled", artist: "Unknown", youTubeId: 'dQw4w9WgXcQ'});
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.ADD_SONG,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncAddNewSong();
    }
    
    store.addSongAtIndex = function(index, song) {
        async function asyncAddSongAtIndex() {
            let response = await getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index, 0, song);
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.ADD_SONG,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);

                    }
                }
                updateList(playlist);
            }
        }
        asyncAddSongAtIndex();
    }

    store.markDeleteSong = function (index) {
        async function asyncMarkDeleteSong() {
            storeReducer({
                type:GlobalStoreActionType.MARK_INDEX_FOR_DELETION,
                payload:{
                    index: index
                }
            })
            // store.history.push("/playlist/"+store.currentList._id);
            store.showDeleteSongModal();
        }
        asyncMarkDeleteSong();
    }

    store.markEditSong = function (index) {
        async function asyncMarkEditSong() {
            storeReducer({
                type:GlobalStoreActionType.MARK_SONG_FOR_EDIT,
                payload:{
                    index: index
                }
            })
            let title = store.currentList.songs[index].title;
            let artist = store.currentList.songs[index].artist;
            let id = store.currentList.songs[index].youTubeId;
            document.getElementById("title-input").value = title;
            document.getElementById("artist-input").value = artist;
            document.getElementById("youtube-input").value = id;
            store.showEditSongModal();
        }
        asyncMarkEditSong();
    }

    store.deleteSongByIndex = function (index) {
        async function asyncDeleteSong() {
            if (index < 0)
                index = store.currentList.songs.length
            let response = await getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.splice(index,1);
                async function updateList(playlist) {
                    let response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.ADD_SONG,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
            store.hideDeleteSongModal();
        }
        asyncDeleteSong();
    }

    store.editSong = function (index, title, artist, youTubeId) {
        async function asyncEditSong() {
            let response = await getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs[index] = {title: title, artist: artist, youTubeId: youTubeId};
                async function updateList(playlist) {
                    let response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.ADD_SONG,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
            store.hideEditSongModal();
        }
        asyncEditSong();
    }

    store.moveSong = function (start, end) {
        async function asyncMoveSong() {
            let list = store.currentList;

            // WE NEED TO UPDATE THE STATE FOR THE APP
            if (start < end) {
                let temp = list.songs[start];
                for (let i = start; i < end; i++) {
                    list.songs[i] = list.songs[i + 1];
                }
                list.songs[end] = temp;
            }
            else if (start > end) {
                let temp = list.songs[start];
                for (let i = start; i > end; i--) {
                    list.songs[i] = list.songs[i - 1];
                }
                list.songs[end] = temp;
            }
            async function updateList(playlist) {
                let response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    async function getListPairs(playlist) {
                        response = await api.getPlaylistPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.ADD_SONG,
                                payload: {
                                    idNamePairs: pairsArray,
                                    playlist: playlist
                                }
                            });
                        }
                    }
                    getListPairs(playlist);
                }
            }
            updateList(store.currentList);   
        }
        asyncMoveSong();
    }


    // const canAddList = store.currentList === null;
    // const canAddSongOrCloseList = store.currentList !== null;
    // const canUndo = tps.hasTransactionToUndo();
    // const canRedo = tps.hasTransactionToRedo();
    store.canAddList = function () { 
        return (store.currentList === null) && (store.listNameActive === false);
    }
    store.canAddSongOrCloseList = function () {
        return store.currentList !== null;
    }
    store.canUndo = function () {
        return tps.hasTransactionToUndo();
    }
    store.canRedo = function () {
        return tps.hasTransactionToRedo();
    }

    // store.toggleButtons = function () {
    //     if (store.canAddList()) {
    //         document.getElementById("")
    //     }
    // }

    store.showDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    store.showDeleteSongModal = function () {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteSongModal = function () {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }

    store.showEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        if (tps.hasTransactionToUndo())
            tps.undoTransaction();
    }
    store.redo = function () {
        console.log("Did redo")
        if (tps.hasTransactionToRedo())
            tps.doTransaction();
    }

    store.addSongTransaction = () => {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.deleteSongTransaction = () => {
        let index = Number(store.indexDelete.index);
        let transaction = new DeleteSong_Transaction(store, index, store.currentList.songs[index]);
        tps.addTransaction(transaction);
    }

    store.editSongTransaction = () => {
        let index = store.indexEdit.index;
        let title = document.getElementById("title-input").value;
        let artist = document.getElementById("artist-input").value;
        let youTubeId = document.getElementById("youtube-input").value;
        let transaction = new EditSong_Transaction(store, index, store.currentList.songs[index], title, artist, youTubeId);
        tps.addTransaction(transaction);
    }

    store.moveSongTransaction = (start, endpoint) => {
        if (start != endpoint) {
            let transaction = new MoveSong_Transaction(store, start, endpoint);
            tps.addTransaction(transaction);
        }
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}