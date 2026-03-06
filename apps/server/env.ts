import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3335),
	BETTER_AUTH_SECRET: z.string(),
	DATABASE_URL: z.url(),
	CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
	CLOUDFLARE_ENDPOINT: z.string(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
