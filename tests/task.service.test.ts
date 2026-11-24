import { describe, expect, it } from 'vitest'
import { changeStatus, countTasks, createTask, deleteTask, editTask, filterTasks, loadTasks, saveTasks, STORAGE_KEY } from '../src/services/task.service'

function memoryStorage(raw: string | null = null) {
  let value = raw
  return { getItem: () => value, setItem: (_key: string, next: string) => { value = next } }
}
describe('regras reais de tarefas', () => {
  it('cadastra tarefa válida como Pendente, com ID e data automáticos', () => {
    const [task] = createTask([], { title: '  Preparar entrega  ', description: 'Revisar documentação' })
    expect(task).toMatchObject({ title: 'Preparar entrega', description: 'Revisar documentação', status: 'pending' })
    expect(task.id).toBeTruthy()
    expect(Number.isFinite(Date.parse(task.createdAt))).toBe(true)
  })
  it.each(['', '   ', '\n\t'])('rejeita título vazio ou composto por espaços: %j', title => {
    expect(() => createTask([], { title })).toThrow('Informe um título')
  })
  it('rejeita título maior que 100 caracteres', () => {
    expect(() => createTask([], { title: 'a'.repeat(101) })).toThrow('100')
  })
  it('rejeita descrição maior que 500 caracteres', () => {
    expect(() => createTask([], { title: 'Teste', description: 'a'.repeat(501) })).toThrow('500')
  })
  it('aceita limites de 100 e 500 caracteres', () => {
    expect(createTask([], { title: 'a'.repeat(100), description: 'a'.repeat(500) })).toHaveLength(1)
  })
  it('altera o status sem modificar os dados originais', () => {
    const tasks = createTask([], { title: 'Teste' })
    const next = changeStatus(tasks, tasks[0].id, 'in_progress')
    expect(next[0].status).toBe('in_progress')
    expect(tasks[0].status).toBe('pending')
  })
  it('rejeita status inválido', () => {
    const tasks = createTask([], { title: 'Teste' })
    expect(() => changeStatus(tasks, tasks[0].id, 'desconhecido')).toThrow('status válido')
  })
  it('exclui tarefa existente', () => {
    const tasks = createTask([], { title: 'Teste' })
    expect(deleteTask(tasks, tasks[0].id)).toEqual([])
  })
  it('retorna apenas tarefas do status consultado', () => {
    let tasks = createTask(createTask([], { title: 'Pendente' }), { title: 'Concluída' })
    tasks = changeStatus(tasks, tasks[0].id, 'completed')
    expect(filterTasks(tasks, 'completed').map(task => task.title)).toEqual(['Concluída'])
    expect(filterTasks(tasks, 'all')).toHaveLength(2)
  })
  it('edita conteúdo preservando ID, data e status', () => {
    let tasks = createTask([], { title: 'Antes' })
    tasks = changeStatus(tasks, tasks[0].id, 'completed')
    expect(editTask(tasks, tasks[0].id, { title: 'Depois' })[0]).toEqual({ ...tasks[0], title: 'Depois' })
    expect(() => editTask(tasks, tasks[0].id, { title: ' ' })).toThrow()
  })
  it('rejeita operações sobre tarefa inexistente', () => {
    expect(() => editTask([], 'ausente', { title: 'Teste' })).toThrow('não encontrada')
    expect(() => changeStatus([], 'ausente', 'completed')).toThrow('não encontrada')
    expect(() => deleteTask([], 'ausente')).toThrow('não encontrada')
  })
  it('recalcula os indicadores após alterações e exclusão', () => {
    let tasks = createTask(createTask([], { title: 'A' }), { title: 'B' })
    tasks = changeStatus(tasks, tasks[0].id, 'in_progress')
    expect(countTasks(tasks)).toEqual({ total: 2, pending: 1, in_progress: 1, completed: 0 })
    tasks = deleteTask(tasks, tasks[0].id)
    expect(countTasks(tasks).total).toBe(1)
  })
})
describe('persistência', () => {
  it('salva e recupera os registros', () => {
    const storage = memoryStorage()
    const tasks = createTask([], { title: 'Persistir' })
    saveTasks(storage, tasks)
    expect(loadTasks(storage)).toEqual(tasks)
    expect(STORAGE_KEY).toBe('taskflow.tasks.v1')
  })
  it('retorna lista vazia quando ainda não há dados', () => {
    expect(loadTasks(memoryStorage())).toEqual([])
  })
  it.each(['{', '{}', '[{"title":"inválida"}]'])('rejeita dados corrompidos: %s', raw => {
    expect(() => loadTasks(memoryStorage(raw))).toThrow()
  })
  it('não persiste registro inválido', () => {
    const storage = memoryStorage()
    const tasks = createTask([], { title: 'Teste' })
    tasks[0].title = ' '
    expect(() => saveTasks(storage, tasks)).toThrow()
    expect(storage.getItem()).toBeNull()
  })
  it('propaga falha de armazenamento sem alterar dados anteriores', () => {
    const storage = { getItem: () => null, setItem: () => { throw new Error('Sem espaço') } }
    expect(() => saveTasks(storage, createTask([], { title: 'Teste' }))).toThrow('Sem espaço')
  })
  it('rejeita identificadores duplicados', () => {
    const tasks = createTask([], { title: 'Teste' })
    expect(() => saveTasks(memoryStorage(), [tasks[0], tasks[0]])).toThrow('duplicados')
    expect(() => loadTasks(memoryStorage(JSON.stringify([tasks[0], tasks[0]])))).toThrow('duplicados')
  })
})
