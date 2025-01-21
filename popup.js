const GOLD = "#FFD700";

document.addEventListener("DOMContentLoaded", () => {
    const notesContainer = document.getElementById("notes-container");
    const addNoteButton = document.getElementById("add-note-button");

    // Load saved notes
    chrome.storage.local.get(["notes"], (result) => {
        const savedNotes = result.notes || [];
        savedNotes.forEach((note) => addStickyNote(note.content, note.id, note.colour || GOLD));
    });

    addNoteButton.addEventListener("click", () => {
        console.log("Add Note button clicked");
        const newNoteId = `note-${Date.now()}`;
        addStickyNote("", newNoteId);
        saveNotes();
    });

    function addStickyNote(content = "", noteId, colour = GOLD) {
        console.log("Creating note with ID:", noteId);

        const note = document.createElement("div");
        note.className = "note";
        note.dataset.noteId = noteId;
        note.style.backgroundColor = colour;

        const textarea = document.createElement("textarea");
        textarea.value = content;
        textarea.addEventListener("input", saveNotes);
        note.appendChild(textarea);

        const control = document.createElement("div");
        control.className = "controls-container";

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "✖";
        deleteButton.addEventListener("click", () => {
            note.remove();
            console.log("Deleted note:", noteId);
            saveNotes();
        });

        const colourSelect = document.createElement("input");
        colourSelect.type = "color";
        console.log(colour);
        colourSelect.value = GOLD;
        colourSelect.className = "colour-picker";
        colourSelect.addEventListener("input", (e) => {
            note.style.backgroundColor = e.target.value;
            saveNotes();
        });

        const colourPickerContainer = document.createElement("div");
        colourPickerContainer.className = "colour-picker-container";
        colourPickerContainer.appendChild(colourSelect);

        control.appendChild(deleteButton);
        control.appendChild(colourPickerContainer);
        note.appendChild(control);
        notesContainer.appendChild(note);
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll(".note").forEach((note) => {
            notes.push({
                id: note.dataset.noteId,
                content: note.querySelector("textarea").value,
                colour: note.style.backgroundColor,
            });
        });

        chrome.storage.local.set({ notes }, () => {
            console.log("Notes saved");
        });
    }
});