
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ShieldCheck, Key, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if API key exists in Supabase
    const checkApiKey = async () => {
      try {
        setIsChecking(true);
        const { data, error } = await supabase.functions.invoke('get-gemini-key');
        
        if (error) {
          console.error("Error checking API key:", error);
          setHasKey(false);
        } else {
          setHasKey(!!data?.key);
        }
      } catch (error) {
        console.error("Error checking API key:", error);
        setHasKey(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkApiKey();
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

    // This is just for demonstration since we're using Supabase secrets
    // In a real implementation, we would send the key to a secure backend
    toast({
      title: "Using Supabase Secrets",
      description: "Your Gemini API key is securely stored in Supabase secrets",
    });
    setShowForm(false);
  };

  if (isChecking) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-gray-300">Checking API key configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 shadow-lg">
      {!showForm && hasKey ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">API Key Configured</span>
          </div>
          <p className="text-sm text-gray-300">
            Your Gemini API key is securely stored in Supabase secrets with name 'Gemini_key'
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary mb-4">
            <Key className="h-5 w-5" />
            <h3 className="font-medium">Gemini API Key Information</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            The Google Gemini API key is securely stored in Supabase secrets and used for content analysis.
            {hasKey ? " The key is already configured with name 'Gemini_key'." : " Please check your Supabase secrets configuration."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiKeyForm;
