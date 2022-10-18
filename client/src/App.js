import './App.css';
import { React, useContext, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar, DeleteListModal, DeleteSongModal, EditSongModal } from './components'
import { GlobalStoreContext } from './store'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const { store } = useContext(GlobalStoreContext);
    const onKeyPress = (event) => {
        console.log(`key pressed: ${event.key}`);
    };
    const useKeyPress = (callback, node = null) => {
        const callbackRef = useRef(callback);
        useLayoutEffect(() => {
            callbackRef.current = callback;
        });
        const handleKeyPress = useCallback((event) => {
                if (event.ctrlKey && (event.key === 'z' || event.key === 'Z') && !(document.getElementById("delete-list-modal").classList.contains("is-visible")) && !(document.getElementById("delete-song-modal").classList.contains("is-visible")) && !(document.getElementById("edit-song-modal").classList.contains("is-visible"))) {store.undo()}
                if (event.ctrlKey && (event.key === 'y' || event.key === 'Y') && !(document.getElementById("delete-list-modal").classList.contains("is-visible")) && !(document.getElementById("delete-song-modal").classList.contains("is-visible")) && !(document.getElementById("edit-song-modal").classList.contains("is-visible"))) {store.redo()}
        }, []);

        useEffect(() => {
            const targetNode = node ?? document;
            targetNode &&
            targetNode.addEventListener("keydown", handleKeyPress);
            return () =>
                targetNode &&
                targetNode.removeEventListener("keydown", handleKeyPress);
        }, [handleKeyPress, node]);
    };
    useKeyPress(onKeyPress);

    return (
        <Router>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector} />
                <Route path="/playlist/:id" exact component={PlaylistCards} />
            </Switch>
            <Statusbar />
            <DeleteListModal />
            <DeleteSongModal />
            <EditSongModal />
        </Router>
    )
}

export default App