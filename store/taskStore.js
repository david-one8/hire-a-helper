import { create } from 'zustand'

export const useTaskStore = create((set) => ({
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
}))
