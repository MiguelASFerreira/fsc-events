import { CreateEvent, type EventRepository } from "./CreateEvent.js"

describe("Create Event", () => {
  class EventRepositoryInMemory implements EventRepository {
    events: any[] = []
    async create(input: any) {
      this.events = [...this.events, input]
      return input
    }
  }

  const createEvent = new CreateEvent(new EventRepositoryInMemory())
  it("Deve criar um evento com sucesso", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = await createEvent.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
  })

  it("Deve retornar 400 se o ownerId não for um UUID", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ownerId"))
  })

  it("Deve retornar 400 se o ticketPriceInCents for negativo", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: -1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })

  it("Deve retornar 400 se a latitude for inválida", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: -100,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })

  it("Deve retornar 400 se a longitude for inválida", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: -200.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })

  it("Deve retornar 400 se a data não for no futuro", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 180.0,
      date: new Date(new Date().setHours(new Date().getHours() - 2)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(
      new Error("Date must be in the future")
    )
  })
})
