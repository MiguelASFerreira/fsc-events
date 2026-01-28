import type { EventRepository } from "../application/CreateEvent.js"
import type { OnSiteEvent } from "../application/entities/OnSiteEvent.js"
import { and, eq } from "drizzle-orm"
import * as schema from "../db/schema.js"
import { db } from "../db/client.js"

export class EventRepositoryDrizzle implements EventRepository {
  database: typeof db
  constructor(database: typeof db) {
    this.database = database
  }

  async getByDateLatAndLong(params: { date: Date; latitude: number; longitude: number }): Promise<OnSiteEvent | null> {
    const output = await this.database.query.events.findFirst({
      where: and(
        eq(schema.events.date, params.date),
        eq(schema.events.latitude, params.latitude.toString()),
        eq(schema.events.longitude, params.longitude.toString())
      )
    })

    if (!output) {
      return null
    }

    return {
      id: output.id,
      ownerId: output.owner_id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      ticketPriceInCents: output.ticketPriceInCents,
      date: output.date,
      name: output.name,
    }
  }

  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await this.database
      .insert(schema.events)
      .values({
        // @ts-expect-error - d
        id: input.id,
        owner_id: input.ownerId,
        latitude: input.latitude,
        longitude: input.longitude,
        ticketPriceInCents: input.ticketPriceInCents,
        date: input.date,
        name: input.name,
      })
      .returning()
    return {
      id: output.id,
      ownerId: output.owner_id,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
      ticketPriceInCents: output.ticketPriceInCents,
      date: output.date,
      name: output.name,
    }
  }
}
