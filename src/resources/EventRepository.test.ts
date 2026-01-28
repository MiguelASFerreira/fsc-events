import { EventRepositoryDrizzle } from "./EventRepository.js"

describe("Event Repository Drizzle", () => {
  it("Deve criar um evento no banco de dados", async () => {
    const repository = new EventRepositoryDrizzle()
    const id = crypto.randomUUID()
    const output = await repository.create({
      id,
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    })

    expect(output.id).toBe(id)
  })
})
