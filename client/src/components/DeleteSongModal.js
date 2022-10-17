import React, { Component, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteSongModal = () => {
    {
        const { store } = useContext(GlobalStoreContext);
        let name = "";
        if (store.currentList) {
            if (store.indexDelete)
                name = store.currentList.songs[store.indexDelete.index].title;
        }
        return (
            <div 
                class="modal" 
                id="delete-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-dialog" id='verify-delete-song-root'>
                        <div class="modal-header">
                            Remove song?
                        </div>
                        <div class="dialog-header">
                            <div class="modal-center-content">
                                Are you sure you wish to remove <b>{name}</b> from the playlist?
                            </div>
                        </div>
                        <div id = "confirm-cancel-container" class="modal-footer">
                            <input type="button" 
                                id="delete-song-confirm-button" 
                                class="modal-control" 
                                onClick={store.deleteSongTransaction}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-song-cancel-button" 
                                class="modal-control" 
                                onClick={store.hideDeleteSongModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}

export default DeleteSongModal;