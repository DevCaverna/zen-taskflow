import { statuses, type Task, type TaskInput, type TaskStatus } from '../types/task'

export const STORAGE_KEY = 'taskflow.tasks.v1'
type TaskStorage = Pick<Storage, 'getItem' | 'setItem'>

export function validateInput(input: TaskInput) {
  if (typeof input.title !== 'string' || !input.title.trim()) throw new Error('Informe um título para a tarefa.')
  if (input.title.length > 100) throw new Error('O título deve ter no máximo 100 caracteres.')
  if (input.description !== undefined && typeof input.description !== 'string') throw new Error('A descrição deve ser um texto.')
  if ((input.description ?? '').length > 500) throw new Error('A descrição deve ter no máximo 500 caracteres.')
  return { title: input.title.trim(), description: (input.description ?? '').trim() }
}
export function validateStatus(value: unknown): TaskStatus {
  if (!statuses.includes(value as TaskStatus)) throw new Error('Selecione um status válido.')
  return value as TaskStatus
}
export function validateTask(value: unknown): Task {
  if (!value || typeof value !== 'object') throw new Error('Registro de tarefa inválido.')
  const task = value as Task
  const content = validateInput(task)
  if (typeof task.id !== 'string' || !task.id || typeof task.createdAt !== 'string' || !Number.isFinite(Date.parse(task.createdAt))) throw new Error('Registro de tarefa inválido.')
  return { ...content, id: task.id, createdAt: task.createdAt, status: validateStatus(task.status) }
}
export function createTask(tasks: Task[], input: TaskInput): Task[] {
  const content = validateInput(input)
  return [{ ...content, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'pending' }, ...tasks]
}
function requireTask(tasks: Task[], id: string) {
  if (!tasks.some(task => task.id === id)) throw new Error('Tarefa não encontrada.')
}
export function editTask(tasks: Task[], id: string, input: TaskInput): Task[] {
  requireTask(tasks, id)
  const content = validateInput(input)
  return tasks.map(task => task.id === id ? { ...task, ...content } : task)
}
export function changeStatus(tasks: Task[], id: string, status: unknown): Task[] {
  requireTask(tasks, id)
  const valid = validateStatus(status)
  return tasks.map(task => task.id === id ? { ...task, status: valid } : task)
}
export function deleteTask(tasks: Task[], id: string): Task[] {
  requireTask(tasks, id)
  return tasks.filter(task => task.id !== id)
}
export function filterTasks(tasks: Task[], status: TaskStatus | 'all'): Task[] {
  if (status === 'all') return tasks
  const valid = validateStatus(status)
  return tasks.filter(task => task.status === valid)
}
export function countTasks(tasks: Task[]) {
  return {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    in_progress: tasks.filter(task => task.status === 'in_progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
  }
}
export function loadTasks(storage: TaskStorage): Task[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []
  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data)) throw new Error('Dados salvos inválidos.')
  const tasks = data.map(validateTask)
  if (new Set(tasks.map(task => task.id)).size !== tasks.length) throw new Error('Há tarefas com identificadores duplicados.')
  return tasks
}
export function saveTasks(storage: TaskStorage, tasks: Task[]): void {
  const validated = tasks.map(validateTask)
  if (new Set(validated.map(task => task.id)).size !== validated.length) throw new Error('Há tarefas com identificadores duplicados.')
  storage.setItem(STORAGE_KEY, JSON.stringify(validated))
}
