import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default async function DashboardSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Redirect teachers to their settings
  if (session.user.role === "TEACHER") {
    redirect("/teacher/settings");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Parametres</h1>
          <p className="text-gray-600">Gerez les parametres de votre compte.</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <CardTitle>Profil</CardTitle>
              </div>
              <CardDescription>Informations de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  defaultValue={session.user.name || ""}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session.user.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  L&apos;email ne peut pas etre modifie
                </p>
              </div>
              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Gerez vos preferences de notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels d&apos;apprentissage</p>
                    <p className="text-sm text-gray-500">
                      Recevez des rappels pour maintenir votre serie
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activer
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveaux cours</p>
                    <p className="text-sm text-gray-500">
                      Soyez informe des nouveaux cours disponibles
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-gray-500" />
                <CardTitle>Apparence</CardTitle>
              </div>
              <CardDescription>Personnalisez l&apos;affichage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mode sombre</p>
                  <p className="text-sm text-gray-500">Bientot disponible</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Bientot
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-500" />
                <CardTitle>Securite</CardTitle>
              </div>
              <CardDescription>
                Parametres de securite du compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Changer le mot de passe</p>
                  <p className="text-sm text-gray-500">
                    Mettez a jour votre mot de passe
                  </p>
                </div>
                <Link href="/forgot-password">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </Link>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">
                    Supprimer le compte
                  </p>
                  <p className="text-sm text-gray-500">
                    Cette action est irreversible
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
