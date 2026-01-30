/**
 * Settings Page (placeholder).
 * Provides a real route so the Sidebar "Settings" button has an obvious effect.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <header className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-foreground" />
            <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          </div>
        </header>

        <main>
          <Card>
            <CardHeader>
              <CardTitle>Coming soon</CardTitle>
              <CardDescription>
                Settings will include profile details, preferences, and notification options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                For now, this page exists so the sidebar Settings button works and has a clear destination.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
