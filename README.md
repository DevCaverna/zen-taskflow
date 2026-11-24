# ZenTaskFlow

Aplicação acadêmica de gerenciamento de tarefas desenvolvida para a disciplina de Gerência de Configuração e Manutenção de Software.

O ZenTaskFlow ajuda a organizar atividades e acompanhar o progresso em um quadro Kanban simples. O projeto permite exercitar versionamento, testes automatizados e, em uma etapa futura, integração e entrega contínuas.

## Funcionalidades

- Cadastro com título obrigatório e descrição opcional.
- Status inicial Pendente.
- Quadro com colunas Pendente, Em andamento e Concluída.
- Movimentação por arrastar no desktop ou pelo seletor de status.
- Edição, exclusão com confirmação e filtros por status.
- Indicadores de quantidade atualizados imediatamente.
- Persistência em LocalStorage.
- Validações na lógica: título de até 100 caracteres, descrição de até 500 e rejeição de status inválidos.
- Interface em português do Brasil, com componentes Radix e layout responsivo.
- Status com texto, ícone e cores: âmbar, azul e verde.

## Tecnologias

Node.js 22 ou superior, React, TypeScript, Vite, Radix Themes, Radix Icons, LocalStorage, Vitest e ESLint.

Não há backend, autenticação, banco remoto ou comunicação com serviços externos.

## Instalação e execução

Clone o repositório e execute:

```bash
git clone https://github.com/DevCaverna/zen-taskflow.git
cd zen-taskflow
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente http://localhost:5173.

## Verificações e build

```bash
npm run test
npm run lint
npm run build
```

Os testes executam uma única vez, sem modo watch, e usam a lógica real da aplicação. O build verifica os tipos e gera os arquivos estáticos em `dist/`.

## Estrutura

```text
src/
├── components/
│   ├── TaskBoard.tsx
│   └── TaskForm.tsx
├── services/task.service.ts
├── types/task.ts
├── App.tsx
├── main.tsx
└── styles.css
tests/
└── task.service.test.ts
```

A lógica de gerenciamento, validação e persistência é independente dos componentes visuais.

## Limitações

Os registros ficam apenas no navegador e na origem em uso. Limpar o armazenamento apaga os dados. Não há sincronização entre abas ou dispositivos, backup, contas ou recuperação. Alterações em abas simultâneas podem sobrescrever dados.

Falhas de gravação não aplicam a alteração na tela. Dados salvos que não possam ser lidos bloqueiam novas gravações para evitar sobrescrever conteúdo potencialmente recuperável. Evite guardar informações sensíveis.

O arrastar usa o recurso nativo do navegador. No celular e por teclado, utilize o seletor de status.

## Próximas etapas

- Integrantes: pendentes.
- GitHub Actions e artefatos de entrega: pendentes.
- Publicação no GitHub Pages e URL da aplicação: pendentes.
- Configuração de bloqueio de publicação quando os testes falharem: pendente.

Nenhum pipeline, publicação ou simulação de falha foi configurado nesta etapa.
