import { db } from "../db/client.js"
import { startPostgresTesteDb } from "../db/test-db.js"
import { EventRepositoryDrizzle } from "../resources/EventRepository.js"
import { events } from "../db/schema.js"
import { CreateEvent } from "./CreateEvent.js"

describe("Create Event", () => {
  const makeSut = () => {
    const eventRepository = new EventRepositoryDrizzle(database)
    const sut = new CreateEvent(eventRepository)
    return { sut, eventRepository }
  }

  let database: typeof db

  beforeAll(async () => {
    const testDatabase = await startPostgresTesteDb()
    database = testDatabase.db
  }, 30_000)

  beforeEach(async () => {
    await database.delete(events).execute()
  }, 30_000)


  it("Deve criar um evento com sucesso", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = await sut.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    expect(output.ownerId).toBe(input.ownerId)
  })

  it("Deve retornar 400 se o ownerId não for um UUID", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }

    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ownerId"))
  })

  it("Deve retornar 400 se o ticketPriceInCents for negativo", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: -1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })

  it("Deve retornar 400 se a latitude for inválida", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: -100,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })

  it("Deve retornar 400 se a longitude for inválida", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: -200.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })

  it("Deve retornar 400 se a data não for no futuro", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 180.0,
      date: new Date(new Date().setHours(new Date().getHours() - 2)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = sut.execute(input)
    await expect(output).rejects.toThrow(
      new Error("Date must be in the future")
    )
  })

  it("Deve lançar um erro se já existir um evento para a mesma data, latitude e longitude", async () => {
    const { sut } = makeSut()
    const date = new Date(new Date().setHours(new Date().getHours() + 2))
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 180.0,
      date,
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const output = await sut.execute(input)
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)

    const output2 = sut.execute(input)
    await expect(output2).rejects.toThrow(
      new Error(
        "Event already exisits"
      )
    )
  })

  it(("Deve chamar o repository com o s parâmetros corretos"), async () => {
    const { sut, eventRepository } = makeSut()
    const spy = vi.spyOn(eventRepository, "create")
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: 45.0,
      longitude: 90.0,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    await sut.execute(input)
    expect(spy).toHaveBeenCalledWith({
      id: expect.any(String),
      ...input
    })
  })
})
