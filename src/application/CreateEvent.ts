import type { OnSiteEvent } from "./entities/OnSiteEvent.js"

interface Input {
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
  name: string
}

export interface EventRepository {
  create: (input: OnSiteEvent) => Promise<OnSiteEvent>
}

export class CreateEvent {
  eventRepository: EventRepository
  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository
  }
  async execute(input: Input) {
    const { ownerId, latitude, longitude, ticketPriceInCents, date, name } =
      input

    // ownerId é um UUID?
    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        ownerId
      )
    ) {
      throw new Error("Invalid ownerId")
    }

    // ticketPriceInCents é um número positivo?
    if (ticketPriceInCents < 0) {
      throw new Error("Invalid ticket price")
    }

    // latitude é entre -90 e +90?
    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude")
    }

    // longitude é entre -180 e +180?
    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude")
    }

    // BUSINESS RULE
    // a data é no futuro?
    const now = new Date()
    if (date < now) {
      throw new Error("Date must be in the future")
    }

    // não posso criar um evento na mesma data (dia e horario), latitude e longitude
    // const events = await db.query.events.findFirst({})

    const event = await this.eventRepository.create({
      id: crypto.randomUUID(),
      name,
      date,
      latitude,
      longitude,
      ownerId,
      ticketPriceInCents,
    })

    return event
  }
}
