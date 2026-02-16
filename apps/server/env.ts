import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	BETTER_AUTH_SECRET: z.string(),
	DATABASE_URL: z.url(),
	CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
