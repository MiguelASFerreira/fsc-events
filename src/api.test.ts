import axios from "axios"

axios.defaults.validateStatus = () => true

describe("POST /events", () => {
  it("Deve criar um evento com sucesso", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "123e4567-e89b-12d3-a456-426614174000",
    }

    const response = await axios.post('http://localhost:3000/events', input)
    expect(response.status).toBe(201)
    expect(response.data.name).toBe(input.name)
    expect(response.data.ticketPriceInCents).toBe(input.ticketPriceInCents)
    // expect(response.data.latitude).toBe(input.latitude.toFixed(6))
    // expect(response.data.longitude).toBe(input.longitude.toFixed(6))
    expect(response.data.ownerId).toBe(input.ownerId)
  })

  it("Deve retornar 400 se o createEvent lançar uma excexão", async () => {
    const input = {
      name: "Evento de Teste",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date().setHours(new Date().getHours() + 1),
      ownerId: "invalid-uuid",
    }

    const response = await axios.post('http://localhost:3000/events', input)
    expect(response.status).toBe(400)
  })
})
