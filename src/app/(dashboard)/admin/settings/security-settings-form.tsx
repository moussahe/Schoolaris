"use client";

import { useState } from "react";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function SecuritySettingsForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Default security settings
  const [settings, setSettings] = useState({
    // Rate limiting
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 60, // seconds

    // Session
    sessionDuration: 7, // days
    forceLogoutInactive: true,
    inactiveTimeout: 30, // minutes

    // Content moderation
    autoModerationEnabled: true,
    requireApprovalForCourses: true,

    // RGPD
    gdprCompliance: true,
    parentalConsentRequired: true,
    minAgeParentalConsent: 15,
    dataRetentionDays: 365,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Parametres de securite enregistres");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* RGPD Warning */}
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Protection des mineurs</p>
          <p className="opacity-90">
            Cette plateforme traite des donnees de mineurs. Les parametres RGPD
            sont critiques.
          </p>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Rate Limiting</h4>
          <Badge variant="outline" className="text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Securite
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="rateLimitEnabled">Activer le rate limiting</Label>
            <p className="text-xs text-muted-foreground">
              Limite les requetes par IP
            </p>
          </div>
          <Switch
            id="rateLimitEnabled"
            checked={settings.rateLimitEnabled}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, rateLimitEnabled: checked })
            }
          />
        </div>

        {settings.rateLimitEnabled && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rateLimitRequests">Requetes max</Label>
              <Input
                id="rateLimitRequests"
                type="number"
                value={settings.rateLimitRequests}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    rateLimitRequests: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rateLimitWindow">Fenetre (secondes)</Label>
              <Input
                id="rateLimitWindow"
                type="number"
                value={settings.rateLimitWindow}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    rateLimitWindow: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Content Moderation */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Moderation du contenu</h4>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="requireApprovalForCourses">
              Approbation requise
            </Label>
            <p className="text-xs text-muted-foreground">
              Les cours doivent etre approuves avant publication
            </p>
          </div>
          <Switch
            id="requireApprovalForCourses"
            checked={settings.requireApprovalForCourses}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, requireApprovalForCourses: checked })
            }
          />
        </div>
      </div>

      <Separator />

      {/* RGPD */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">RGPD & Protection des donnees</h4>
          <Badge className="bg-red-100 text-red-700 text-xs">Critique</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="parentalConsentRequired">
              Consentement parental
            </Label>
            <p className="text-xs text-muted-foreground">
              Requis pour les enfants sous l age limite
            </p>
          </div>
          <Switch
            id="parentalConsentRequired"
            checked={settings.parentalConsentRequired}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, parentalConsentRequired: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAgeParentalConsent">
            Age minimum sans consentement
          </Label>
          <Input
            id="minAgeParentalConsent"
            type="number"
            min={13}
            max={18}
            value={settings.minAgeParentalConsent}
            onChange={(e) =>
              setSettings({
                ...settings,
                minAgeParentalConsent: parseInt(e.target.value) || 15,
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            En France, 15 ans pour les donnees personnelles (RGPD)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataRetentionDays">
            Retention des donnees (jours)
          </Label>
          <Input
            id="dataRetentionDays"
            type="number"
            min={30}
            value={settings.dataRetentionDays}
            onChange={(e) =>
              setSettings({
                ...settings,
                dataRetentionDays: parseInt(e.target.value) || 365,
              })
            }
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer
      </Button>
    </div>
  );
}
