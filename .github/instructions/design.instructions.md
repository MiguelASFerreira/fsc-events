---
applyTo: "**"
---

Seguimos arquitetura hexagonal para desenvolver esse projeto. Portanto, sempre que necessário criar uma noca rota de API, siga **EXATAMENTE** esse padrão:

## Driver (API)

- Crie a rota em @src\api.ts
- SEMPRE use o Fastify e o Zod para validar os tipos de dados da requisição. Exemlo:

```typescript
app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/events",
  schema: {
    tags: ["Events"],
    body: z.object({
      name: z.string(),
      ticketPriceInCents: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      date: z.iso.datetime(),
      ownerId: z.uuid(),
    }),

    response: {
      201: z.object({
        id: z.uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        date: z.iso.datetime(),
        ownerId: z.uuid(),
      }),

      400: z.object({
        code: z.string(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string(),
        message: z.string(),
      }),
      500: z.object({
        code: z.string(),
        message: z.string(),
      }),
    },
  },

  handler: async (req, res) => {},
})
```

- Uma rota de API deve **SEMPRE** chamar um use case.
- SEMPRE trate erros customizados que o use case eventualmente lançar. Exemplo:

```typescript
catch (error) {
  if (
    error instanceof InvalidParameterError ||
    error instanceof EventAlreadyExistsError
  ) {
    return res.status(400).send({ code: error.code, message: error.message })
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send({ code: error.code, message: error.message })
  }
}
```

# Use Case

- TODAS as regras de negócio devem estar contidas no use case.
- Um use case deve SEMPRE receber uma interface Input e retornar uma interface Output, exatamente como é feito em @src\application\CreateEvent.ts.
- Quando necessário lançar uma exceção , **SEMPRE** lance um erro customizado. Esses erros são criados em @src\application\errors\index.ts. **SEMPRE** verifique os erros que já foram criados antes de criar um novo.
- Um use case **NUNCA** deve ter um try catch.
- Sempre que for necessário executar operações em um banco de dados, **SEMPRE** receba o repository correspondente como dependência no construtor da classe, **EXATAMENTE** como é feito em @src\application\CreateEvent.ts. A interface do repository que é recebido como dependência no construtor deve ser definida no arquivo do use case

## Repository

- **SEMPRE** use o Drizzle para interagir com o banco de dados.
- Ao criar um repository, **SEMPRE** receba o client do Drizzle como dependência no construtor da classe, **EXATAMENTE** como é feito em @src\resources\EventRepository.ts.
- **SEMPRE** receba uma interfae de domínio em operações de criação e atualização, assim como é feito em @src\resources\EventRepository.ts.
- **SEMPRE** retorne um objeto de domínio em operação de listagem.
- Ao criar um repository, **SEMPRE** implemente a interface definida no use case, assim como é feito em @src\resources\EventRepository.ts.
