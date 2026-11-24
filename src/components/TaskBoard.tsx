import { useState, type DragEvent } from 'react'
import { Badge, Box, Card, Flex, Heading, IconButton, Select, Text, Tooltip } from '@radix-ui/themes'
import { CalendarIcon, CheckCircledIcon, CircleIcon, DragHandleDots2Icon, Half2Icon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { statuses, statusLabels, type Task, type TaskStatus } from '../types/task'

const statusColors = { pending: 'amber', in_progress: 'blue', completed: 'green' } as const
const statusIcons = { pending: CircleIcon, in_progress: Half2Icon, completed: CheckCircledIcon }
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
interface Props {
  tasks: Task[]
  filter: TaskStatus | 'all'
  onMove: (task: Task, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onCreate: () => void
  disabled: boolean
}
export default function TaskBoard({ tasks, filter, onMove, onEdit, onDelete, onCreate, disabled }: Props) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<TaskStatus | null>(null)
  function drop(event: DragEvent, status: TaskStatus) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/taskflow-id')
    const task = tasks.find(task => task.id === id)
    setDragging(null); setOver(null)
    if (!disabled && task && task.status !== status) onMove(task, status)
  }
  return <div className={'board' + (filter !== 'all' ? ' board-filtered' : '')} aria-label="Quadro de tarefas">
    {statuses.filter(status => filter === 'all' || status === filter).map(status => {
      const items = tasks.filter(task => task.status === status)
      const StatusIcon = statusIcons[status]
      return <section key={status} className={'board-column column-' + status + (over === status ? ' column-over' : '')}
        aria-label={'Coluna ' + statusLabels[status]}
        onDragOver={event => {
          if (dragging && !disabled) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setOver(status) }
        }}
        onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(null) }}
        onDrop={event => drop(event, status)}>
        <Flex align="center" justify="between" gap="2" className="column-heading">
          <Flex align="center" gap="2"><Text color={statusColors[status]} as="span"><StatusIcon width="17" height="17" /></Text><Heading as="h3" size="2" weight="medium">{statusLabels[status]}</Heading><Badge color={statusColors[status]} variant="soft" radius="full">{items.length}</Badge></Flex>
          {status === 'pending' && <Tooltip content="Criar tarefa pendente"><IconButton variant="ghost" color="gray" size="1" onClick={onCreate} disabled={disabled} aria-label="Criar tarefa pendente"><PlusIcon /></IconButton></Tooltip>}
        </Flex>
        <div className="column-tasks">
          {items.map(task => <Card key={task.id} asChild size="2" className={'task-card' + (dragging === task.id ? ' task-dragging' : '')}>
            <article draggable={!disabled}
              aria-label={task.title}
              onDragStart={event => {
                event.dataTransfer.setData('text/taskflow-id', task.id)
                event.dataTransfer.effectAllowed = 'move'
                setDragging(task.id)
              }}
              onDragEnd={() => { setDragging(null); setOver(null) }}>
              <Flex align="center" justify="between" mb="3" gap="2">
                <Badge color={statusColors[status]} variant="soft"><StatusIcon />{statusLabels[status]}</Badge>
                <Tooltip content="Arraste o cartão para outra coluna"><Box as="span" className="drag-handle" aria-hidden="true"><DragHandleDots2Icon /></Box></Tooltip>
              </Flex>
              <Heading as="h4" size="3" weight="medium" className="task-title">{task.title}</Heading>
              {task.description && <Text as="p" size="2" color="gray" mt="2" className="description">{task.description}</Text>}
              <Flex align="center" justify="between" mt="4" gap="2" className="task-meta">
                <Text size="1" color="gray" className="task-date"><CalendarIcon /><time dateTime={task.createdAt} title={new Date(task.createdAt).toLocaleString('pt-BR')}>{dateFormatter.format(new Date(task.createdAt))}</time></Text>
                <Flex gap="2">
                  <Tooltip content="Editar tarefa"><IconButton size="1" variant="ghost" color="gray" disabled={disabled} aria-label={'Editar ' + task.title} onClick={() => onEdit(task)}><Pencil1Icon /></IconButton></Tooltip>
                  <Tooltip content="Excluir tarefa"><IconButton size="1" variant="ghost" color="gray" disabled={disabled} aria-label={'Excluir ' + task.title} onClick={() => onDelete(task)}><TrashIcon /></IconButton></Tooltip>
                </Flex>
              </Flex>
              <Box mt="3">
                <Select.Root size="1" value={task.status} onValueChange={value => onMove(task, value as TaskStatus)} disabled={disabled}>
                  <Select.Trigger className="move-select" variant="surface" color="gray" aria-label={'Alterar status de ' + task.title} />
                  <Select.Content position="popper"><Select.Group><Select.Label>Mover tarefa para</Select.Label>{statuses.map(value => <Select.Item key={value} value={value}>{statusLabels[value]}</Select.Item>)}</Select.Group></Select.Content>
                </Select.Root>
              </Box>
            </article>
          </Card>)}
          {items.length === 0 && <div className="column-empty"><Text as="p" size="2" color="gray">Nenhuma tarefa por aqui</Text><Text as="p" size="1" color="gray" mt="1">Arraste uma tarefa para esta coluna ou altere seu status.</Text></div>}
        </div>
      </section>
    })}
  </div>
}
