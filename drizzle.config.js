import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  dbCredentials: {
    url: "postgresql://neondb_owner:7q6zKasRviVD@ep-gentle-fire-a5fbamwh-pooler.us-east-2.aws.neon.tech/Expenses-Tracker?sslmode=require",
  }
})