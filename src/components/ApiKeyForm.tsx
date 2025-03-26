
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ShieldCheck, Key } from 'lucide-react';

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Check if API key exists in sessionStorage
    const storedKey = sessionStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Key Required",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    sessionStorage.setItem('gemini_api_key', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for this session",
    });
    setShowForm(false);
  };

  const handleClearKey = () => {
    sessionStorage.removeItem('gemini_api_key');
    setApiKey('');
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-sm border border-border/30 rounded-xl p-6 shadow-subtle">
      {!showForm && apiKey ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">API Key Configured</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Update Key
            </Button>
            <Button variant="destructive" onClick={handleClearKey}>
              Remove Key
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary mb-4">
            <Key className="h-5 w-5" />
            <h3 className="font-medium">Configure Gemini API Key</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Google Gemini API key to enable content analysis. 
            The key is stored locally in your browser session and is not sent to our servers.
          </p>
          <div className="space-y-3">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveKey} className="w-full">
                Save Key
              </Button>
              {apiKey && !showForm && (
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyForm;
