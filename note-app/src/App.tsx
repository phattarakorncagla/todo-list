import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useMemo, useEffect, useState } from "react";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";
import axios from "axios";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useState<RawNote[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function fetchData() {
      const notesResponse = await axios.get("http://localhost:3000/notes");
      const tagsResponse = await axios.get("http://localhost:3000/tags");
      setNotes(notesResponse.data);
      setTags(tagsResponse.data);
    }
    fetchData();
  }, []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds?.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  async function onCreateNote({ tags, ...data }: NoteData) {
    const response = await axios.post("http://localhost:3000/notes", {
      ...data,
      tagIds: tags.map((tag) => tag.id),
    });
  
    if (response.status === 201) {
      const newNote = response.data;
      console.log("New note created:", newNote);
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  }

  async function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    const response = await axios.put(`http://localhost:3000/notes/${id}`, {
      ...data,
      tagIds: tags.map((tag) => tag.id),
    });
  
    if (response.status === 200) {
      setNotes((prevNotes) => {
        return prevNotes.map((note) => {
          if (note.id === id) {
            return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
          } else {
            return note;
          }
        });
      });
    }
  }

  async function onDeleteNote(id: string) {
    const response = await axios.delete(`http://localhost:3000/notes/${id}`);

    if (response.status === 200) {
      setNotes((prevNotes) => {
        return prevNotes.filter((note) => note.id !== id);
      });
    }
  }

  async function addTag(tag: Tag) {
    const response = await axios.post("http://localhost:3000/tags", {
      ...tag,
      label: String(tag.label),
    });
  
    if (response.status === 201) {
      const newTag = response.data;
      console.log("New tag created:", newTag);
      setTags((prev) => [...prev, newTag]);
    }
  }

  async function updateTag(id: string, label: string) {
    const response = await axios.put(`http://localhost:3000/tags/${id}`, {
      label: String(label),
    });

    if (response.status === 200) {
      setTags((prevTags) => {
        return prevTags.map((tag) => {
          if (tag.id === id) {
            return { ...tag, label: String(label) };
          } else {
            return tag;
          }
        });
      });
    }
  }

  async function deleteTag(id: string) {
    const response = await axios.delete(`http://localhost:3000/tags/${id}`);

    if (response.status === 200) {
      setTags((prevTags) => {
        return prevTags.filter((tag) => tag.id !== id);
      });
    }
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
