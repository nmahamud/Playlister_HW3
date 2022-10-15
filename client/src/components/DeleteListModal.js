import React, { Component, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteListModal = () => {
    {
        const { store } = useContext(GlobalStoreContext);
        let name = "";
        if (store.listForDeletion) {
            name = store.listForDeletion.name;
        }
        return (
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-dialog" id='verify-delete-list-root'>
                        <div class="modal-header">
                            Delete playlist?
                        </div>
                        <div class="dialog-header">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete the {name} playlist?
                            </div>
                        </div>
                        <div id = "confirm-cancel-container" class="modal-footer">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-control" 
                                onClick={store.deleteList}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-control" 
                                onClick={store.hideDeleteListModal}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}

export default DeleteListModal;