import { CreateEvent } from "./application/CreateEvent.js"
import { EventRepositoryDrizzle } from "./resources/EventRepository.js"
import { db } from "./db/client.js"
import fastify, { type FastifyReply, type FastifyRequest } from "fastify"

const app = fastify()


app.post("/events", async (req: FastifyRequest, res: FastifyReply) => {
  const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
    req.body as {
      name: string
      ticketPriceInCents: number
      latitude: number
      longitude: number
      date: string
      ownerId: string
    }

  try {
    const eventRepositoryDrizzle = new EventRepositoryDrizzle(db)
    const createEvent = new CreateEvent(eventRepositoryDrizzle)
    const event = await createEvent.execute({
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      date: new Date(date),
      ownerId,
    })

    return res.status(201).send(event)
  } catch (error: any) {
    return res.status(400).send({ message: error?.message })
  }
})

app.listen({ port: 3000 }, () => {
  console.log("Server is running on http://localhost:3000")
})
