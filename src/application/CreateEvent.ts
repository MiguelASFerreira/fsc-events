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
  getByDateLatAndLong: (params: {date: Date, latitude: number, longitude: number}) => Promise<OnSiteEvent | null>
}

export class CreateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(input: Input) {
    const { ownerId, latitude, longitude, ticketPriceInCents, date, name } =
      input

    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        ownerId
      )
    ) {
      throw new Error("Invalid ownerId")
    }

    if (ticketPriceInCents < 0) {
      throw new Error("Invalid ticket price")
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude")
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude")
    }

    // BUSINESS RULE
    const now = new Date()
    if (date < now) {
      throw new Error("Date must be in the future")
    }

    const existingEvents = await this.eventRepository.getByDateLatAndLong(
      { date, latitude, longitude }
    )

    if (existingEvents) {
      throw new Error("Event already exisits")
    }

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
