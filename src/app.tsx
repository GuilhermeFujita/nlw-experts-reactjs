import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes, NotesResponse } from "./api/notes";
import { toast } from "sonner";

export function App() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("");

  const { data: notes = [], isError } = useQuery<NotesResponse[]>({
    queryKey: ['notes', search],
    queryFn: () => fetchNotes(search),
  });

  const { mutateAsync: createNoteFn } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const { mutateAsync: deleteNoteFn } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const onNoteCreated = async (content: string) => {
    await createNoteFn(content)
  };

  const onNoteDeleted = async (id: number) => {
    await deleteNoteFn(id)
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
  };

  if (isError) {
    toast.error("Falha ao buscar notas")
    return
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />
      <form className="w-full">
        <input
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onNoteDeleted={() => onNoteDeleted(note.id)}
          />
        ))}
      </div>
    </div>
  );
}
