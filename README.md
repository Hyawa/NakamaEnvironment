# Nakama Environment

Servidor multiplayer autoritativo desenvolvido sobre Heroic Labs Nakama.

Este repositório serve como base para o desenvolvimento de múltiplos jogos multiplayer utilizando uma arquitetura compartilhada.

---

# Objetivo

Este projeto não representa apenas um único jogo.

Ele define toda a infraestrutura reutilizável para futuros jogos multiplayer utilizando Nakama.

Exemplos:

- BasketClone
- Pong
- Hockey
- Soccer
- Outros jogos competitivos

Todos compartilham a mesma arquitetura.

---

# Filosofia

Este projeto segue obrigatoriamente uma arquitetura **Server Authoritative**.

Toda regra do jogo deve ser executada no servidor.

O cliente nunca possui autoridade sobre o estado da partida.

O cliente apenas:

- renderiza
- captura inputs
- envia ações para o servidor
- recebe snapshots do estado

Toda decisão da partida acontece no servidor.

---

# Arquitetura Geral

```
Client
    │
    ▼
Nakama Match
    │
    ▼
GameplayEngine
    │
    ▼
MatchState
```

O Match do Nakama é responsável apenas pelo ciclo de vida da partida.

Toda regra do jogo deve permanecer dentro da GameplayEngine.

---

# Fluxo Geral

```
Input do jogador
        │
        ▼
MatchData
        │
        ▼
GameplayEngine.update()
        │
        ▼
Atualiza MatchState
        │
        ▼
GameplayEngine.buildSnapshot()
        │
        ▼
Broadcast para clientes
```

---

# Princípios Arquiteturais

## 1. Server Authoritative

Sempre.

Nunca mover regras para o cliente.

Nunca confiar em posições enviadas pelo cliente.

O cliente envia intenções.

Exemplos:

```
andar esquerda

andar direita

pular

arremessar
```

Nunca:

```
minha posição é X
```

---

## 2. Estado puro (POJO)

Toda a GameplayEngine trabalha exclusivamente com estruturas de dados.

Exemplos:

```
PlayerState
BallState
ScoreState
MatchState
```

Esses objetos representam apenas dados.

Eles não possuem comportamento.

---

## 3. Sem lógica dentro dos estados

Estados nunca possuem métodos como:

```
getState()

setState()

update()

tick()

move()
```

Toda lógica permanece em funções externas.

---

## 4. Funções puras

A engine deve ser organizada em módulos de funções.

Exemplos:

```
Physics

Collision

Possession

Scoring

Snapshot

GameplayEngine
```

Esses módulos recebem estado e produzem novo estado.

---

## 5. GameplayEngine

A GameplayEngine representa toda a lógica da partida.

Ela é independente do Nakama.

Idealmente deve ser possível executar toda a engine em testes utilizando apenas Vitest.

---

## 6. MatchState

Toda a partida deve estar representada em um único objeto.

Exemplo:

```
MatchState

    player1

    player2

    ball

    score

    possession

    timers

    phase
```

O MatchState deve conter absolutamente tudo necessário para reconstruir uma partida.

---

## 7. Snapshot

Snapshots são construídos diretamente a partir do MatchState.

Nunca utilizar:

```
getState()

serialize()

toJSON()
```

O snapshot é apenas uma projeção do estado.

---

## 8. Determinismo

A GameplayEngine deve ser determinística.

Mesmo estado inicial + mesmos inputs + mesmos ticks = mesmo resultado.

Evitar:

- Math.random()
- Date.now()
- lógica dependente do cliente

---

## 9. Testabilidade

Toda lógica importante deve possuir testes automatizados.

Prioridade:

- GameplayEngine
- Física
- Colisões
- Possession
- Pontuação
- Snapshot

O objetivo é detectar regressões antes do build.

---

## 10. Ordem de execução

Antes de qualquer build executar:

```
npm run type-check

npm run test

npm run build
```

Nenhum código deve ser enviado ao Nakama caso TypeScript ou testes falhem.

---

# Organização do Projeto

```
src/

    core/

        config/

        constants/

        helpers/

        types/

        utils/

    games/

        basketclone/

            match/

            matchmaking/

            rpc/

            gameplay/

            tests/

            index.ts

    services/

        authentication/

        chat/

        leaderboard/

        ranking/

        friends/

        party/

        storage/

    main.ts
```

---

# Responsabilidades

## main.ts

Composição do servidor.

Responsável apenas por registrar módulos.

---

## games/

Contém somente código específico de um jogo.

---

## services/

Infraestrutura reutilizável entre todos os jogos.

---

## GameplayEngine

Responsável por toda a lógica da partida.

Não deve conhecer Nakama.

---

## Match

Responsável apenas por conectar Nakama à GameplayEngine.

---

# Arquitetura de Rede

Cliente

↓

Input

↓

Nakama Match

↓

GameplayEngine.update()

↓

MatchState

↓

Snapshot

↓

Broadcast

↓

Cliente

---

# Objetivos futuros

Esta arquitetura foi escolhida para permitir:

- rollback
- replay
- espectador
- bots
- IA
- gravação de partidas
- sincronização determinística
- múltiplos jogos utilizando a mesma infraestrutura

---

# Regras para futuros agentes de código

Ao modificar este projeto:

- respeite a arquitetura Server Authoritative;
- não mova regras do jogo para o cliente;
- mantenha a GameplayEngine independente do Nakama;
- mantenha MatchState composto apenas por dados;
- não introduza orientação a objetos nos estados;
- mantenha funções puras sempre que possível;
- não adicione gambiarras para corrigir problemas arquiteturais;
- toda alteração deve preservar a simplicidade da serialização e dos testes;
- qualquer nova funcionalidade deve seguir estes princípios antes de ser implementada.