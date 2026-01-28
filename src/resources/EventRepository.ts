import type { EventRepository } from "../application/CreateEvent.js"
import type { OnSiteEvent } from "../application/entities/OnSiteEvent.js"
import { and, eq } from "drizzle-orm"
import * as schema from "../db/schema.js"
import { db } from "../db/client.js"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export class EventRepositoryDrizzle implements EventRepository {
  async getByDateLatAndLong(params: { date: Date; latitude: number; longitude: number }): Promise<OnSiteEvent | null> {
    const output = await db.query.events.findFirst({
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
    const [output] = await db
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
