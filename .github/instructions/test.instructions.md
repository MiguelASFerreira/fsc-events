---
applyTo: '**'
---

## Use case

- Ao escrever teste de use cases que recebam repositories como dependência, **SEMPRE** use a função "startPostgresTesteDb", para iniciar um banco de dados de teste, **EXATAMENTE** como é feito em @src\application\CreateEvent.test.ts.
- **SEMPRE** crie uma função `makeSut` que faz a criação do objeto que está sendo testado. Exemplo:

```typescript
  const makeSut = () => {
    const eventRepository = new EventRepositoryDrizzle(database)
    const sut = new CreateEvent(eventRepository)
    return { sut, eventRepository }
  }
```

- Ao testar use cases com bancos de dados de teste, **SEMPRE** limpe as tabelas necessárias antes de cada teste. Exemplo:

```typescript
  beforeAll(async () => {
    const testDatabase = await startPostgresTesteDb()
    database = testDatabase.db
  })

  beforeEach(async () => {
    await database.delete(events).execute()
  })
```

- **SEMPRE** escreva testes para todos os cenários possíveis.
- **SEMPRE** use o arquivo @src\application\CreateEvent.test.ts como referência para criar os testes.
