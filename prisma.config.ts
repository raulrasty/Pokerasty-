import path from "path"
import { defineConfig } from "prisma/config"
import * as dotenv from "dotenv"
import { PrismaNeon } from "@prisma/adapter-neon"

dotenv.config({ path: ".env" })

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL,
  },
})