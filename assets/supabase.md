# Supabase Integration for Todo App

## Table: todos

A table to store todo items with features for adding, updating, marking as completed, deleting, and listing todos.

### Schema

| Column      | Type                        | Nullable | Default                        | Description                |
|-------------|-----------------------------|----------|--------------------------------|----------------------------|
| id          | uuid                        | NO       | gen_random_uuid()              | Unique identifier/Primary Key |
| title       | text                        | NO       |                                | Title of the todo item     |
| completed   | boolean                     | NO       | false                          | Completion status          |
| created_at  | timestamp with time zone    | YES      | timezone('utc', now())         | Timestamp of creation      |
| updated_at  | timestamp with time zone    | YES      | timezone('utc', now())         | Timestamp of last update   |

### Notes

- The `id` uses `gen_random_uuid()` for universally unique identifiers.
- Both `created_at` and `updated_at` use UTC timestamps.
- The table supports: adding, listing, updating, marking as completed, and deleting todos.

### Usage

- Connect to Supabase using:
  - URL: `https://xykqsvzufnkulhfwckmm.supabase.co`
  - Public Key: (See environment or Supabase project settings)

- Use the "todos" table for storing and retrieving todo items.

---

_Last updated: Automatically by agent on table creation/modification._
