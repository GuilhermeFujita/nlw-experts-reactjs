import { api } from "../lb/axios";

export interface NotesResponse {
  id: number,
  noteDate: Date
  content: string
}

export async function fetchNotes(search?: string) {
  const { data } = await api.get<NotesResponse[]>('/notes', {
    params: search ? { search } : null
  })
  return data
}

export async function createNote(content: string) {
  const { data } = await api.post<NotesResponse>("/notes", { content })
  return data
}

export async function deleteNote(id: number) {
  await api.delete(`/notes/${id}`)
}