import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { env } from "../../../env";

const signInSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const Route = createFileRoute("/(public)/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const from = Route.useSearch() as { from?: string };
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function handleSignIn(data: SignInFormValues) {
    const callbackURL = from?.from
      ? `${env.CLIENT_URL}${from.from}`
      : `${env.CLIENT_URL}/dashboard`;
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL,
      },
      {
        onError: (context) => {
          if (context.error.message) {
            alert(context.error.message);
          } else {
            alert("Erro ao fazer login");
          }
        },
      }
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <h1 className="text-3xl md:text-4xl font-bold">Bem-vindo de volta</h1>
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Entrar</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Digite seu email abaixo para fazer login na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="senha"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Entrar </p>
                )}
              </Button>
            </form>
          </Form>
          <CardFooter className="flex justify-center">
            <p className="mt-2">
              Não tem uma conta?{" "}
              <Link to="/sign-up" className="text-blue-500">
                Cadastrar aqui
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
