<p align="center">
  <img src="src/assets/zen-taskflow-logo.svg" width="80" height="80" alt="Logo do ZenTaskFlow" />
</p>

# ZenTaskFlow

Aplicação acadêmica de gerenciamento de tarefas desenvolvida para a disciplina de Gerência de Configuração e Manutenção de Software.

O ZenTaskFlow ajuda a organizar atividades e acompanhar o progresso em um quadro Kanban simples. O projeto usa versionamento, testes automatizados e integração e entrega contínuas com GitHub Actions.

## Veja o ZenTaskFlow em ação

Uma tarefa passando de **Pendente** para **Em andamento** e depois para **Concluída**, com os indicadores atualizados automaticamente.

![Demonstração do quadro Kanban: uma tarefa é arrastada pelos três status](media/zen-taskflow-demo.gif)

[Ver imagem estática da tela principal](media/zen-taskflow-preview.png).

A demonstração foi capturada na aplicação real, em uma sessão isolada com uma tarefa de exemplo. A aplicação inicia sem tarefas predefinidas.

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

## Integração e entrega contínuas

O workflow [CI/CD](.github/workflows/ci-cd.yml) roda em pull requests para `main`, em pushes para `main` e também pode ser iniciado manualmente. A etapa de qualidade instala as dependências com `npm ci` e executa, nesta ordem, os testes, o ESLint e o build TypeScript/Vite. Qualquer falha interrompe o workflow antes da publicação.

Somente um push em `main` que conclua todas as verificações publica o artefato `dist/` no GitHub Pages. Pull requests validam as alterações sem publicar o site. Para habilitar a primeira publicação, em **Settings > Pages > Build and deployment**, selecione **GitHub Actions** como fonte.

- URL prevista para publicação: https://devcaverna.github.io/zen-taskflow/
- Execuções e evidências: [GitHub Actions](https://github.com/DevCaverna/zen-taskflow/actions)
- Fluxo sugerido: crie uma branch, abra um pull request, corrija eventuais falhas indicadas pelas verificações e integre apenas quando o workflow estiver verde.

## Estrutura

```text
media/                   # GIF e captura da aplicação para este README
src/
├── assets/
│   └── zen-taskflow-logo.svg
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
- Adicionar os nomes dos demais integrantes da equipe.
