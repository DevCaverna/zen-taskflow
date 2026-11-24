export const statuses = ['pending', 'in_progress', 'completed'] as const
export type TaskStatus = typeof statuses[number]
export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: string
}
export interface TaskInput { title: string; description?: string }
export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendente', in_progress: 'Em andamento', completed: 'Concluída',
}
