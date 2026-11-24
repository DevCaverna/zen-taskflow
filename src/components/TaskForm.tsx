import { useState, type FormEvent } from 'react'
import { Button, Callout, Dialog, Flex, Text, TextArea, TextField } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import type { Task, TaskInput } from '../types/task'
import { validateInput } from '../services/task.service'

interface Props { task: Task | null; onSave: (input: TaskInput) => void }
export default function TaskForm({ task, onSave }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    try { validateInput({ title, description }); onSave({ title, description }) }
    catch (error) { setError(error instanceof Error ? error.message : 'Não foi possível salvar a tarefa.') }
  }
  return <Dialog.Content maxWidth="480px">
    <Dialog.Title>{task ? 'Editar tarefa' : 'Nova tarefa'}</Dialog.Title>
    <Dialog.Description size="2" mb="5">{task ? 'Atualize os detalhes da sua tarefa.' : 'Organize o próximo passo. Toda tarefa começa como Pendente.'}</Dialog.Description>
    <form onSubmit={submit} noValidate>
      <Flex direction="column" gap="4">
        <label>
          <Text as="div" size="2" weight="medium" mb="2">Título <Text color="gray">(obrigatório)</Text></Text>
          <TextField.Root size="3" variant="surface" value={title} onChange={e => setTitle(e.target.value)} placeholder="O que precisa ser feito?" aria-required="true" aria-invalid={!!error} aria-describedby={error ? 'form-error' : 'title-count'} autoFocus />
          <Text as="div" id="title-count" size="1" color={title.length > 100 ? 'red' : 'gray'} mt="1">{title.length}/100 caracteres</Text>
        </label>
        <label>
          <Text as="div" size="2" weight="medium" mb="2">Descrição <Text color="gray">(opcional)</Text></Text>
          <TextArea size="3" variant="surface" value={description} onChange={e => setDescription(e.target.value)} placeholder="Adicione contexto ou detalhes importantes…" rows={4} aria-describedby="description-count" />
          <Text as="div" id="description-count" size="1" color={description.length > 500 ? 'red' : 'gray'} mt="1">{description.length}/500 caracteres</Text>
        </label>
        {error && <Callout.Root color="red" role="alert" id="form-error"><Callout.Icon><InfoCircledIcon /></Callout.Icon><Callout.Text>{error}</Callout.Text></Callout.Root>}
        <Flex justify="end" gap="3" mt="2">
          <Dialog.Close><Button type="button" variant="soft" color="gray">Cancelar</Button></Dialog.Close>
          <Button type="submit">{task ? 'Salvar alterações' : 'Criar tarefa'}</Button>
        </Flex>
      </Flex>
    </form>
  </Dialog.Content>
}
