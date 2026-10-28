import { text, sqliteTable, integer, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("verified", { mode: "boolean" }).notNull().default(false),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    dueDate: integer("dueDate", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    },
    (table) => [index("session_user_id").on(table.userId)],
);

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("idToken"),
    accessTokenDueDate: integer("access_token_due_date", { mode: "timestamp" }).notNull(),
    refreshTokenDueDate: integer("refresh_token_due_date", { mode: "timestamp" }).notNull(),
    scope: text("scope"),
    password: text("password"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    },
    (table) => [index("account_user_id").on(table.userId)],
);

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull().unique(),
    dueDate: integer("due_date", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;