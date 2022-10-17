import React, { Component, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

const EditSongModal = () => {
        const { store } = useContext(GlobalStoreContext);
        let title = "";
        let artist = "";
        let id = "";
        let index = null;
        if (store.indexEdit)
            index = store.indexEdit.index;
        if (store.currentList) {
            if (store.indexEdit) {
                title = store.currentList.songs[index].title;
                artist = store.currentList.songs[index].artist;
                id = store.currentList.songs[index].youTubeId;
            }
        }
        return (
            <div 
                class="modal" 
                id="edit-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-dialog" id='verify-edit-song-root'>
                        <div class="modal-header">
                            Edit song
                        </div>
                        <div class="dialog-header">
                            <span id="title-prompt" class="modal-prompt">Title: </span> <input type="text" defaultValue={title} id="title-input" class="modal-textfield" /> <br />
                            <span id="artist-prompt" class="modal-prompt">Artist: </span> <input type="text" defaultValue={artist} id="artist-input" class="modal-textfield" /><br />
                            <span id="you-tube-id-prompt" class="modal-prompt">You Tube Id: </span> <input type="text" defaultValue={id} id="youtube-input" class="modal-textfield" />
                        </div>
                        <div id = "confirm-cancel-container" class="modal-footer">
                            <input type="button" 
                                id="edit-song-confirm-button" 
                                class="modal-control" 
                                onClick={store.editSongTransaction}
                                value='Confirm' />
                            <input type="button" 
                                id="edit-song-cancel-button" 
                                class="modal-control" 
                                onClick={store.hideEditSongModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }

export default EditSongModal;