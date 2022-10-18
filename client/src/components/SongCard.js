import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const [ drag, setDrag ] = useState({isDragging: false, draggedTo: false});

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        setDrag({
            isDragging: true,
            draggedTo: drag.draggedTo
        });
    }
    function handleDragOver(event) {
        event.preventDefault();
        setDrag({
            isDragging: drag.isDragging,
            draggedTo: true
        });
    }
    function handleDragEnter(event) {
        event.preventDefault();
        setDrag({
            isDragging: drag.isDragging,
            draggedTo: true
        });
    }
    function handleDragLeave(event) {
        event.preventDefault();
        setDrag({
            isDragging: drag.isDragging,
            draggedTo: false
        });
    }
    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        if (targetId === "")
            return;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        setDrag({
            isDragging: false,
            draggedTo: false
        });

        // ASK THE MODEL TO MOVE THE DATA
        store.moveSongTransaction(Number(sourceId.substring(0,1)), Number(targetId.substring(0,1)));
    }
    
    function handleRemove(event) {
        event.stopPropagation();
        store.markDeleteSong(index);
    }

    function handleDoubleClick(event) {
        event.stopPropagation();
        store.markEditSong(index);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDoubleClick={handleDoubleClick}
            draggable = "true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemove}
            />
        </div>
    );
}

export default SongCard;