---
applyTo: '**/*.ts'
---

**NUNCA** use o tipo `any`.
**SEMPRE** use type ao invés de inteface.


## Classes

- Sempre use `private` ou `protected` para propriedades das classes. Exemplo:
```typescript
// ✅ Correto
class UserService {
  private readonly repository: UserRepository;
  protected logger: Logger;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }
}

// ❌ Incorreto
class UserService {
  public repository: UserRepository; // expõe detalhes internos
  logger: Logger; // implicita como public
}
```

## Funções

- **SEMPRE** que uma função receber mais de um parâmetro, receba um objeto como parâmetro. Exemplo:
```typescript
interface Input {
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
  name: string
}

export interface EventRepository {
  create: (input: Input) => Promise<OnSiteEvent>
}
```
