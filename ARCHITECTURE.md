# Documentação de Arquitetura do Projeto MoneyCare

Este documento detalha os principais componentes de UI e a arquitetura geral do aplicativo MoneyCare, servindo como um guia para desenvolvedores e para o entendimento da estrutura do projeto.

---

## 1. Glossário de Componentes (React Native Paper)

Estes são os "blocos de construção" visuais do aplicativo, todos fornecidos pela biblioteca `react-native-paper`.

* ### `<PaperProvider>`
  * **Descrição:** É o componente "pai" que deve envolver todo o aplicativo. Ele é responsável por injetar o tema (cores, fontes, etc.) em todos os outros componentes da biblioteca.
  * **Uso no MoneyCare:** Localizado no arquivo `app/_layout.tsx`, garante que nosso tema escuro seja aplicado em todas as telas.

* ### `useTheme`
  * **Descrição:** Um "hook" do React que permite que qualquer componente acesse as propriedades do tema (como `theme.colors.primary`).
  * **Uso no MoneyCare:** Usado extensivamente para aplicar cores de fundo, texto e bordas de forma consistente.

* ### `<Appbar>`
  * **Descrição:** Cria a barra de cabeçalho no topo das telas.
  * **Uso no MoneyCare:** Utilizado em todas as telas principais para exibir o título e botões de ação.

* ### `<Button>`
  * **Descrição:** Um botão clicável com diferentes estilos (`contained`, `outlined`).
  * **Uso no MoneyCare:** Principal componente para ações do usuário, como "Entrar", "Criar Conta" e "Salvar".

* ### `<TextInput>`
  * **Descrição:** Um campo de formulário para entrada de texto com design Material.
  * **Uso no MoneyCare:** A base de todos os formulários (Login, Cadastro, Adicionar Transação).

* ### `<Card>`
  * **Descrição:** Um contêiner de superfície elevada, ideal para agrupar informações relacionadas.
  * **Uso no MoneyCare:** Elemento de design chave no Dashboard e na tela de Adicionar Transação para organizar o conteúdo em seções.

* ### `<Text>`
  * **Descrição:** Componente para renderizar texto com suporte a variantes de estilo do tema.
  * **Uso no MoneyCare:** Usado para exibir todos os textos do aplicativo.

* ### `<List.Item>`, `<List.Icon>`, `<List.Section>`
  * **Descrição:** Conjunto de componentes para criar listas padronizadas.
  * **Uso no MoneyCare:** Essencial na tela de "Lista de Transações" e no menu da tela de "Perfil".

* ### `<Avatar.Icon>`, `<Avatar.Text>`
  * **Descrição:** Componentes para exibir avatares com ícones ou iniciais de nomes.
  * **Uso no MoneyCare:** Usado no Perfil para exibir as iniciais do usuário e nos cards de resumo do Dashboard.

* ### `<ToggleButton>`
  * **Descrição:** Um grupo de botões onde apenas uma opção pode ser selecionada.
  * **Uso no MoneyCare:** Utilizado na tela "Adicionar Transação" para a escolha entre "Despesa" e "Receita".

* ### `<Chip>`
  * **Descrição:** Um elemento compacto que representa uma entrada, atributo ou ação.
  * **Uso no MoneyCare:** Usado no Dashboard para os filtros de período ("7 dias", "30 dias", etc.).

* ### `<Modal>` e `<Portal>`
  * **Descrição:** `Modal` exibe conteúdo em uma camada sobre o aplicativo. `Portal` garante que o modal seja renderizado corretamente na hierarquia da UI.
  * **Uso no MoneyCare:** Usados no `CategorySelector` para exibir a lista de categorias em um pop-up.

* ### `<Divider>`
  * **Descrição:** Uma linha fina usada para separar conteúdos.
  * **Uso no MoneyCare:** Usado em listas e cards para separar itens.

---

## 2. Diagramas de Arquitetura

### 2.1. Arquitetura de Pastas e Roteamento (Expo Router)

Este diagrama mostra como os arquivos estão organizados e como o Expo Router os transforma em telas e navegação.

```text
MoneyCare/
├── app/                  # <-- O CORAÇÃO DO APP (Roteamento)
│   ├── (auth)/           # Grupo de rotas para telas de autenticação
│   │   ├── _layout.tsx   #  -> Define a navegação em pilha (Iniciar -> Login -> Cadastro)
│   │   ├── index.tsx     #  -> Tela "Iniciar"
│   │   ├── login.tsx     #  -> Tela de Login
│   │   └── register.tsx  #  -> Tela de Cadastro
│   │
│   ├── (tabs)/           # Grupo de rotas para telas principais (após login)
│   │   ├── _layout.tsx   #  -> Define a Barra de Navegação Flutuante (Dock)
│   │   ├── index.tsx     #  -> Tela Dashboard
│   │   ├── add.tsx       #  -> Tela de Adicionar Transação
│   │   ├── list.tsx      #  -> Tela de Lista de Transações
│   │   ├── currencies.tsx#  -> Tela de Moedas
│   │   ├── soon.tsx      #  -> Tela de Metas (Em Breve)
│   │   └── profile/      #  -> Grupo aninhado para o perfil
│   │       ├── _layout.tsx # -> Navegação em pilha (Perfil -> Editar -> Configs)
│   │       ├── index.tsx   # -> Tela Principal do Perfil
│   │       ├── edit.tsx    # -> Tela de Editar Perfil
│   │       └── settings.tsx# -> Tela de Configurações
│   │
│   └── _layout.tsx       # Layout Raiz: Decide se mostra (auth) ou (tabs)
│
├── components/           # <-- Componentes de UI Reutilizáveis
│   ├── Dashboard/        # Componentes específicos da Dashboard
│   ├── Profile/          # Componentes específicos do Perfil
│   └── AddTransaction/   # Componentes específicos de Adicionar Transação
│
├── contexts/             # <-- Gerenciamento de Estado Global
│   ├── AuthContext.tsx   # Lógica de login, cadastro e sessão do usuário
│   └── TransactionContext.tsx # Lógica de adicionar e listar transações
│
├── hooks/                # <-- Hooks Customizados (Lógica Reutilizável)
│   ├── useDashboardAnalytics.ts # Lógica de cálculos da Dashboard
│   └── useTransactionForm.ts    # Lógica de validação do formulário
│
└── constants/            # <-- Dados Estáticos
    ├── categories.ts     # Lista de categorias de despesa/receita
    └── theme.ts          # Definição do tema (cores, fontes, etc.)
```

### 2.2. Arquitetura de Fluxo de Dados

Este diagrama mostra como os dados fluem entre a interface, o estado e o armazenamento.

```text
+-------------------------------------------------+
|               CAMADA DE UI (Telas)              |
|   [Dashboard] [Add.tsx] [Perfil] [Login]...     |
|       |               |               |         |
|       (Usa os hooks para ler/gravar dados)      |
+-----------------------|-------------------------+
                        |
                        V
+-------------------------------------------------+
|      CAMADA DE ESTADO (Contexts & Hooks)        |
|                                                 |
| [AuthContext] <------> [TransactionContext]     |
|   - Gerencia 'user'     - Gerencia 'transactions' |
|   - Funções signIn(),      - Funções addTransaction(),|
|     signOut()               loadTransactions()      |
|                                                 |
+-----------------------|-------------------------+
                        |
                        V
+-------------------------------------------------+
|         CAMADA DE PERSISTÊNCIA (Local)          |
|                                                 |
|      [AsyncStorage (Armazenamento Nativo)]      |
|      - Salva @MoneyCare:auth_token              |
|      - Salva @MoneyCare:transactions            |
|                                                 |
+-------------------------------------------------+
                        |
                        V  (Próximo Passo / Evolução Futura)
...................................................
.               CAMADA DE BACKEND                 .
.                                                 .
.      [Sua API] <-----> [Banco de Dados (Postgres)]
.                                                 .
...................................................
```