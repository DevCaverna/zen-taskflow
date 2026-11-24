import { useState } from 'react'
import { AlertDialog, Badge, Box, Button, Callout, Card, Dialog, Flex, Grid, Heading, SegmentedControl, Separator, Text } from '@radix-ui/themes'
import { CheckCircledIcon, CheckIcon, CircleIcon, Half2Icon, InfoCircledIcon, PlusIcon, RowsIcon } from '@radix-ui/react-icons'
import TaskForm from './components/TaskForm'
import TaskBoard from './components/TaskBoard'
import { changeStatus, countTasks, createTask, deleteTask, editTask, loadTasks, saveTasks } from './services/task.service'
import { statuses, statusLabels, type Task, type TaskInput, type TaskStatus } from './types/task'

function initialData() {
  try { return { tasks: loadTasks(window.localStorage), error: '' } }
  catch { return { tasks: [], error: 'Não foi possível ler as tarefas salvas. Seus dados não foram substituídos. Verifique o armazenamento do navegador e recarregue a página.' } }
}
export default function App() {
  const [initial] = useState(initialData)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const counts = countTasks(tasks)
  const blocked = !!initial.error
  function commit(next: Task[], message: string) {
    if (blocked) throw new Error(initial.error)
    try { saveTasks(window.localStorage, next) }
    catch { throw new Error('Não foi possível salvar. Verifique se o armazenamento está disponível e tem espaço. A alteração não foi aplicada.') }
    setTasks(next); setNotice(message); setError('')
  }
  function save(input: TaskInput) {
    commit(editing ? editTask(tasks, editing.id, input) : createTask(tasks, input), editing ? 'Tarefa atualizada.' : 'Tarefa criada.')
    setOpen(false)
  }
  function updateStatus(task: Task, status: string) {
    try { commit(changeStatus(tasks, task.id, status), 'Status atualizado.') }
    catch (err) { setError((err as Error).message) }
  }
  function remove() {
    if (!deleting) return
    try { commit(deleteTask(tasks, deleting.id), 'Tarefa excluída.'); setDeleting(null) }
    catch (err) { setError((err as Error).message); setDeleting(null) }
  }
  function newTask() { setEditing(null); setOpen(true) }
  return <>
    <header className="header">
      <Flex align="center" justify="between" gap="3" className="header-inner">
        <a href="./" className="brand" aria-label="ZenTaskFlow — início"><span className="brand-icon"><CheckIcon /></span>ZenTaskFlow</a>
        <Badge color="gray" variant="surface" size="2">Organização pessoal</Badge>
      </Flex>
    </header>
    <main className="main">
      <Flex align="center" justify="between" gap="5" wrap="wrap" className="page-heading">
        <Box><Text as="p" size="2" color="gray" mb="2">SEU DIA, COM MAIS CLAREZA</Text><Heading as="h1" size="8" weight="medium">Minhas tarefas</Heading><Text as="p" color="gray" mt="3">Do primeiro passo à última entrega. Tudo em um só lugar.</Text></Box>
        <Button size="3" onClick={newTask} disabled={blocked}><PlusIcon />Nova tarefa</Button>
      </Flex>
      <Card size="3" className="summary" asChild>
        <section aria-label="Resumo das tarefas">
          <Grid columns={{ initial: '2', sm: '4' }} gap="0">
            {[
              { label: 'Total de tarefas', count: counts.total, icon: RowsIcon, color: 'gray' },
              { label: 'Pendentes', count: counts.pending, icon: CircleIcon, color: 'amber' },
              { label: 'Em andamento', count: counts.in_progress, icon: Half2Icon, color: 'blue' },
              { label: 'Concluídas', count: counts.completed, icon: CheckCircledIcon, color: 'green' },
            ].map(({ label, count, icon: Icon, color }) => <Box className={'stat stat-' + color} key={label}>
              <Flex align="center" gap="2"><Icon /><Text size="2" color="gray">{label}</Text></Flex>
              <Text as="p" size="7" weight="medium" mt="3">{count}</Text>
            </Box>)}
          </Grid>
        </section>
      </Card>
      <section aria-labelledby="board-title" className="board-section">
        <Flex align="center" justify="between" wrap="wrap" gap="4" mb="4">
          <Box><Heading as="h2" size="4" id="board-title">Quadro de tarefas</Heading><Text as="p" size="2" color="gray" mt="1">Arraste os cartões entre as colunas ou use o seletor de status.</Text></Box>
          <SegmentedControl.Root size="1" value={filter} onValueChange={value => setFilter(value as TaskStatus | 'all')} aria-label="Filtrar por status" className="status-filters">
            <SegmentedControl.Item value="all">Todas</SegmentedControl.Item>
            {statuses.map(status => <SegmentedControl.Item key={status} value={status}>{status === 'pending' ? 'Pendentes' : status === 'completed' ? 'Concluídas' : statusLabels[status]}</SegmentedControl.Item>)}
          </SegmentedControl.Root>
        </Flex>
        <div className="feedback">
          {(initial.error || error) && <Callout.Root color="red" role="alert"><Callout.Icon><InfoCircledIcon /></Callout.Icon><Callout.Text>{initial.error || error}</Callout.Text></Callout.Root>}
          <div role="status" aria-live="polite">{notice && !error && <Text size="2" color="indigo"><CheckCircledIcon className="inline-icon" />{notice}</Text>}</div>
        </div>
        <TaskBoard tasks={tasks} filter={filter} disabled={blocked} onCreate={newTask} onMove={updateStatus} onEdit={task => { setEditing(task); setOpen(true) }} onDelete={setDeleting} />
        {tasks.length === 0 && !blocked && <Flex direction="column" align="center" gap="3" mt="6"><Text size="2" color="gray">Tudo começa com uma tarefa. Tire sua primeira ideia do papel.</Text><Button variant="soft" onClick={newTask}><PlusIcon />Criar primeira tarefa</Button></Flex>}
      </section>
      <Separator size="4" mt="7" />
      <Flex justify="between" gap="3" wrap="wrap" className="footer"><Text size="1" color="gray">Um pouco de clareza para o seu dia.</Text><Text size="1" color="gray">Dados salvos neste navegador</Text></Flex>
    </main>
    <Dialog.Root open={open} onOpenChange={setOpen}>{open && <TaskForm task={editing} onSave={save} />}</Dialog.Root>
    <AlertDialog.Root open={!!deleting} onOpenChange={value => { if (!value) setDeleting(null) }}>
      <AlertDialog.Content maxWidth="440px">
        <AlertDialog.Title>Excluir tarefa?</AlertDialog.Title>
        <AlertDialog.Description size="2">A tarefa “{deleting?.title}” será excluída permanentemente. Esta ação não pode ser desfeita.</AlertDialog.Description>
        <Flex gap="3" justify="end" mt="5"><AlertDialog.Cancel><Button variant="soft" color="gray">Cancelar</Button></AlertDialog.Cancel><Button color="red" onClick={remove}>Excluir tarefa</Button></Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </>
}
