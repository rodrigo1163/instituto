import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/app/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Rocket,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "Rápido e Eficiente",
      description:
        "Performance otimizada para uma experiência fluida e responsiva.",
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description:
        "Seus dados estão protegidos com as melhores práticas de segurança.",
    },
    {
      icon: Rocket,
      title: "Fácil de Usar",
      description: "Interface intuitiva e moderna para máxima produtividade.",
    },
  ];

  return (
    <div className="min-h-screen from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="size-4" />
            <span>Bem-vindo ao MyApp</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Gerencie suas tarefas com
            <span className="text-primary"> facilidade</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground">
            Uma plataforma moderna e intuitiva para organizar seu trabalho e
            aumentar sua produtividade. Comece agora e transforme sua forma de
            trabalhar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2">
                    Ir para Dashboard
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/todo">
                  <Button size="lg" variant="outline" className="gap-2">
                    Ver Tarefas
                    <CheckCircle2 className="size-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/sign-up">
                  <Button size="lg" className="gap-2">
                    Começar Agora
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/sign-in">
                  <Button size="lg" variant="outline" className="gap-2">
                    Entrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra as funcionalidades que tornam nossa solução a melhor
            escolha para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-16 md:py-24">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-2">
                Pronto para começar?
              </CardTitle>
              <CardDescription className="text-base">
                Crie sua conta gratuitamente e comece a usar todas as
                funcionalidades hoje mesmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to="/sign-up">
                <Button size="lg" className="gap-2">
                  Criar Conta Grátis
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
