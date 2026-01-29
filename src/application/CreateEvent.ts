import type { OnSiteEvent } from "./entities/OnSiteEvent.js"
import {
  EventAlreadyExistsError,
  InvalidParameterError,
} from "./errors/index.js"

interface Input {
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
  name: string
}

interface Output {
  id: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
  name: string
}

export interface EventRepository {
  create: (input: OnSiteEvent) => Promise<OnSiteEvent>
  getByDateLatAndLong: (params: {
    date: Date
    latitude: number
    longitude: number
  }) => Promise<OnSiteEvent | null>
}

export class CreateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(input: Input): Promise<Output> {
    const { ownerId, latitude, longitude, ticketPriceInCents, date, name } =
      input

    if (
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        ownerId
      )
    ) {
      throw new InvalidParameterError("ownerId")
    }

    if (ticketPriceInCents < 0) {
      throw new InvalidParameterError("ticketPriceInCents must be positive")
    }

    if (latitude < -90 || latitude > 90) {
      throw new InvalidParameterError("latitude must be between -90 and 90")
    }

    if (longitude < -180 || longitude > 180) {
      throw new InvalidParameterError("longitude must be between -180 and 180")
    }

    // BUSINESS RULE
    const now = new Date()
    if (date < now) {
      throw new InvalidParameterError("Date must be in the future")
    }

    const existingEvents = await this.eventRepository.getByDateLatAndLong({
      date,
      latitude,
      longitude,
    })

    if (existingEvents) {
      throw new EventAlreadyExistsError()
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
