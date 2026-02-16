import { z } from "zod";

const envSchema = z.object({
	API_URL: z.url().default("http://localhost:3333"),
	CLIENT_URL: z.url().default("http://localhost:3000"),
	VITE_ENABLE_API_DELAY: z.string().transform((value) => value === "true"),
});

export const env = envSchema.parse(import.meta.env);
