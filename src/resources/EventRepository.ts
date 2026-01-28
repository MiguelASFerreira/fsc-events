import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"

import * as schema from "../db/schema.js"
import type { EventRepository } from "../application/CreateEvent.js"
import type { OnSiteEvent } from "../application/entities/OnSiteEvent.js"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class EventRepositoryDrizzle implements EventRepository {
  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await db
      .insert(schema.events)
      .values({
        ownerId: input.ownerId,
        latitude: input.latitude,
        longitude: input.longitude,
        ticketPriceInCents: input.ticketPriceInCents,
        date: input.date,
        name: input.name,
      })
      .returning()
    return {
      id: output.id,
      ownerId: output.ownerId,
      latitude: output.latitude,
      longitude: output.longitude,
      ticketPriceInCents: output.ticketPriceInCents,
      date: output.date,
      name: output.name,
    }
  }
}
