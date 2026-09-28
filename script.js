  let notes = JSON.parse(localStorage.getItem("studentNotes")) || [];
let editingNote = null;
function showNoteForm() {
    document.getElementById("note-form").style.display = "block";
}

function closeNoteForm() {
    document.getElementById("note-form").style.display = "none";
}

function saveNote() {
    const subject = document.getElementById("note-subject").value;
    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    if (subject === "" || title === "" || content === "") {
        alert("Please enter subject, title and note.");
        return;
    }

    if (editingNote) {
        const oldTitle = editingNote.querySelector("h3").textContent;
        const oldContent = editingNote.querySelector("p").textContent;

        const index = notes.findIndex(function(noteData) {
            return noteData.title === oldTitle && noteData.content === oldContent;
        });

        if (index !== -1) {
            notes[index].subject = subject;
            notes[index].title = title;
            notes[index].content = content;
        }

        editingNote.querySelector("small").textContent = "📚 " + subject;
        editingNote.querySelector("h3").textContent = title;
        editingNote.querySelector("p").textContent = content;

        localStorage.setItem("studentNotes", JSON.stringify(notes));

        editingNote = null;
        closeNoteForm();
        return;
    }

    const date = new Date().toLocaleString();

    const note = document.createElement("div");
    note.className = "note-card";

    note.innerHTML = `
        <small>📚 ${subject}</small>
        <small class="note-date">🕒 ${date}</small>
        <h3>${title}</h3>
        <p>${content}</p>
        <button onclick="pinNote(this)">📌 Pin</button>
        <button onclick="editNote(this)">✏️ Edit</button>
        <button onclick="deleteNote(this)">🗑️ Delete</button>
    `;

    document.getElementById("notes-list").appendChild(note);

    notes.push({
        subject: subject,
        title: title,
        content: content,
        date: date,
        pinned: false
    });

    localStorage.setItem("studentNotes", JSON.stringify(notes));

    updateNotesCount();

    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";

    closeNoteForm();
}

function deleteNote(button) {
    const note = button.parentElement;

    const title = note.querySelector("h3").textContent;
    const content = note.querySelector("p").textContent;

    notes = notes.filter(function(noteData) {
        return !(noteData.title === title && noteData.content === content);
    });

    localStorage.setItem("studentNotes", JSON.stringify(notes));

    note.remove();
  updateNotesCount();
}
function editNote(button) {
    const note = button.parentElement;

    const subject = note.querySelector("small").textContent.replace("📚 ", "");
    const oldTitle = note.querySelector("h3").textContent;
    const oldContent = note.querySelector("p").textContent;

    document.getElementById("note-subject").value = subject;
    document.getElementById("note-title").value = oldTitle;
    document.getElementById("note-content").value = oldContent;

    editingNote = note;

    showNoteForm();
}
function loadNotes() {
    notes.forEach(function(noteData) {
        const note = document.createElement("div");
        note.className = "note-card";

        if (noteData.pinned) {
            note.classList.add("pinned");
        }

        note.innerHTML = `
            <small>📚 ${noteData.subject}</small>
            ${noteData.date ? `<small class="note-date">🕒 ${noteData.date}</small>` : ""}
            <h3>${noteData.title}</h3>
            <p>${noteData.content}</p>
            <button onclick="pinNote(this)">
                ${noteData.pinned ? "📌 Unpin" : "📌 Pin"}
            </button>
            <button onclick="editNote(this)">✏️ Edit</button>
            <button onclick="deleteNote(this)">🗑️ Delete</button>
        `;

        document.getElementById("notes-list").appendChild(note);
    });
}

loadNotes();const searchInput = document.querySelector(".search-box input");
checkEmptyNotes();
searchInput.addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();
    const allNotes = document.querySelectorAll(".note-card");

    allNotes.forEach(function (note) {
        const title = note.querySelector("h3").textContent.toLowerCase();
        const content = note.querySelector("p").textContent.toLowerCase();

        if (title.includes(searchText) || content.includes(searchText)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    });
});
function filterBySubject(subject) {
    const allNotes = document.querySelectorAll(".note-card");

    allNotes.forEach(function (note) {
        const noteSubject = note.querySelector("small").textContent;

        if (noteSubject.includes(subject)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    });
}
if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark-mode");
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    const button = document.getElementById("dark-mode-btn");

    if (document.body.classList.contains("dark-mode")) {
        button.textContent = "☀️ Light Mode";
      localStorage.setItem("darkMode", "on");
    } else {
        button.textContent = "🌙 Dark Mode";
      localStorage.setItem("darkMode", "off");
    }
}
function updateNotesCount() {
    const count = document.querySelectorAll(".note-card").length;
    document.getElementById("notes-count").textContent = "Total Notes: " + count;
}

updateNotesCount();
function pinNote(button) {
    const note = button.parentElement;

    note.classList.toggle("pinned");

    const title = note.querySelector("h3").textContent;

    const index = notes.findIndex(function(noteData) {
        return noteData.title === title;
    });

    if (index !== -1) {
        notes[index].pinned = note.classList.contains("pinned");
        localStorage.setItem("studentNotes", JSON.stringify(notes));
    }

    if (note.classList.contains("pinned")) {
        button.textContent = "📌 Unpin";
        document.getElementById("notes-list").prepend(note);
    } else {
        button.textContent = "📌 Pin";
    }
}
function checkEmptyNotes() {
    const notesList = document.getElementById("notes-list");

    let message = document.getElementById("empty-message");

    if (notes.length === 0) {
        if (!message) {
            message = document.createElement("p");
            message.id = "empty-message";
            message.textContent = "📝 अभी कोई note नहीं है";
            notesList.appendChild(message);
        }
    } else if (message) {
        message.remove();
    }
}
function addSubject() {
    const subject = prompt("Enter subject name:");

    if (subject === null) {
        return;
    }

    const name = subject.trim();

    if (name === "") {
        alert("Please enter subject name.");
        return;
    }

    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    if (subjects.includes(name)) {
        alert("Subject already exists!");
        return;
    }

    subjects.push(name);
    localStorage.setItem("subjects", JSON.stringify(subjects));

    const subjectsDiv = document.querySelector(".subjects");
    const button = document.createElement("button");

    button.textContent = "📚 " + name;

    button.onclick = function() {
        filterBySubject(name);
    };

    subjectsDiv.insertBefore(button, subjectsDiv.lastElementChild);
}
function loadCustomSubjects() {
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const subjectsDiv = document.querySelector(".subjects");

    subjects.forEach(function(subject) {
        const button = document.createElement("button");
        button.textContent = "📚 " + subject;

        button.onclick = function() {
            filterBySubject(subject);
        };

        subjectsDiv.insertBefore(button, subjectsDiv.lastElementChild);
    });
}

loadCustomSubjects();
function showSubjectForm() {
    const form = document.getElementById("subject-form");

    if (form) {
        form.style.display = "block";
    }
}

function closeSubjectForm() {
    const form = document.getElementById("subject-form");

    if (form) {
        form.style.display = "none";
    }

    document.getElementById("new-subject").value = "";
}

function saveSubject() {
    const input = document.getElementById("new-subject");
    const name = input.value.trim();

    if (name === "") {
        alert("Please enter subject name.");
        return;
    }

    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    if (subjects.includes(name)) {
        alert("Subject already exists!");
        return;
    }

    subjects.push(name);
    localStorage.setItem("subjects", JSON.stringify(subjects));

    // ऊपर Subjects में button जोड़ना
    const subjectsDiv = document.querySelector(".subjects");

    const button = document.createElement("button");
    button.textContent = "📚 " + name;

    button.onclick = function() {
        filterBySubject(name);
    };

    subjectsDiv.appendChild(button);

    // Note के Subject dropdown में option जोड़ना
    const select = document.getElementById("note-subject");

    const option = document.createElement("option");
    option.value = name;
    option.textContent = "📚 " + name;

    select.appendChild(option);

    closeSubjectForm();
}
function loadSubjectsIntoDropdown() {
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];
    const select = document.getElementById("note-subject");

    subjects.forEach(function(subject) {
        if (!Array.from(select.options).some(function(option) {
            return option.value === subject;
        })) {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = "📚 " + subject;
            select.appendChild(option);
        }
    });
}

loadSubjectsIntoDropdown();
function loadAllNotes() {
    const notesList = document.getElementById("notes-list");

    notesList.innerHTML = "";

    notes.forEach(function(noteData) {
        const note = document.createElement("div");
        note.className = "note-card";

        if (noteData.pinned) {
            note.classList.add("pinned");
        }

        note.innerHTML = `
            <small>📚 ${noteData.subject}</small>
            ${noteData.date ? `<small class="note-date">🕒 ${noteData.date}</small>` : ""}
            <h3>${noteData.title}</h3>
            <p>${noteData.content}</p>
            <button onclick="pinNote(this)">
                ${noteData.pinned ? "📌 Unpin" : "📌 Pin"}
            </button>
            <button onclick="editNote(this)">✏️ Edit</button>
            <button onclick="deleteNote(this)">🗑️ Delete</button>
        `;

        notesList.appendChild(note);
    });
}
function deleteCustomSubject(subject) {
    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    const updatedSubjects = subjects.filter(function(item) {
        return item !== subject;
    });

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    location.reload();
}
function showDeleteSubjectForm() {
    const form = document.getElementById("delete-subject-form");
    const select = document.getElementById("delete-subject-select");

    select.innerHTML = '<option value="">Select Subject</option>';

    const subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    subjects.forEach(function(subject) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = "📚 " + subject;
        select.appendChild(option);
    });

    form.style.display = "block";
}

function closeDeleteSubjectForm() {
    document.getElementById("delete-subject-form").style.display = "none";
}

function confirmDeleteSubject() {
    const select = document.getElementById("delete-subject-select");
    const subject = select.value;

    if (subject === "") {
        alert("Please select a subject.");
        return;
    }

    deleteCustomSubject(subject);
    closeDeleteSubjectForm();
}