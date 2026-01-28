import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../db/schema.js"
import { execSync } from "node:child_process"
import path from "node:path"

export const startPostgresTesteDb = async () => {
  const container = await new PostgreSqlContainer("postgres:17")
    .withDatabase("fsc_events_test_db")
    .withUsername("user")
    .withPassword("test_password")
    .start()

  const db = drizzle(container.getConnectionUri(), { schema })
  const schemaPath = path.join(import.meta.dirname, "./schema.ts")

  execSync(
  `npx drizzle-kit push --dialect=postgresql --schema=src/db/schema.ts --url="${container.getConnectionUri()}"`,
  {
    stdio: "inherit",
    cwd: process.cwd(), // garante root do projeto
  }
)


  return { container, db }
}
