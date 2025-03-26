
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  BarChart4, 
  Layers, 
  AlertCircle, 
  AlertTriangle, 
  FileText 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmCategory } from '@/utils/analyzeContent';

// Placeholder data for demonstration purposes
const recentScans = [
  { id: 1, content: "Check this website for misinformation...", date: "2 hours ago", category: "misinformation" as HarmCategory, score: 0.87 },
  { id: 2, content: "Is this message potentially harmful?", date: "Yesterday", category: "safe" as HarmCategory, score: 0.12 },
  { id: 3, content: "Analyze this social media post...", date: "3 days ago", category: "cyberbullying" as HarmCategory, score: 0.68 },
];

const StatsCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ActivityItem = ({ 
  content, 
  date, 
  category,
  score 
}: { 
  content: string, 
  date: string, 
  category: HarmCategory, 
  score: number 
}) => {
  const getCategoryColor = (category: HarmCategory) => {
    switch (category) {
      case 'hate_speech': return 'text-red-600';
      case 'misinformation': return 'text-yellow-600';
      case 'cyberbullying': return 'text-orange-600';
      case 'explicit_content': return 'text-pink-600';
      case 'prompt_injection': return 'text-purple-600';
      case 'safe': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const getCategoryIcon = (category: HarmCategory) => {
    switch (category) {
      case 'hate_speech': return <AlertCircle className="h-4 w-4" />;
      case 'misinformation': return <FileText className="h-4 w-4" />;
      case 'cyberbullying': return <AlertTriangle className="h-4 w-4" />;
      case 'explicit_content': return <AlertCircle className="h-4 w-4" />;
      case 'prompt_injection': return <Layers className="h-4 w-4" />;
      case 'safe': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatCategory = (category: HarmCategory) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex items-center space-x-4 rounded-md border p-4">
      <div className={`rounded-full p-2 ${getCategoryColor(category).replace('text-', 'bg-').replace('600', '100')}`}>
        {getCategoryIcon(category)}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{content}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{date}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs font-medium ${getCategoryColor(category)}`}>
          {formatCategory(category)}
        </span>
        <span className="text-xs text-muted-foreground">
          {(score * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, isLoading, getProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    scans: '23',
    threats: '5',
    safe: '18',
    accuracy: '94%'
  });

  useEffect(() => {
    if (user) {
      getProfile().then(data => {
        setProfile(data);
      });
    }
  }, [user, getProfile]);

  // If user is not logged in and not loading, redirect to auth page
  if (!user && !isLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{profile?.full_name || user?.email}</span>
            </div>
            <Avatar>
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard 
                title="Total Scans" 
                value={stats.scans}
                icon={<Layers className="h-4 w-4" />}
                description="Total content scans performed"
              />
              <StatsCard 
                title="Threats Detected" 
                value={stats.threats}
                icon={<AlertTriangle className="h-4 w-4" />}
                description="Harmful content identified"
              />
              <StatsCard 
                title="Safe Content" 
                value={stats.safe}
                icon={<Shield className="h-4 w-4" />}
                description="Verified as non-harmful"
              />
              <StatsCard 
                title="Detection Accuracy" 
                value={stats.accuracy}
                icon={<BarChart4 className="h-4 w-4" />}
                description="Based on user feedback"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <div className="grid gap-4">
                {recentScans.map(scan => (
                  <ActivityItem key={scan.id} {...scan} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <h3 className="text-lg font-medium">All Recent Activity</h3>
            <div className="grid gap-4">
              {recentScans.map(scan => (
                <ActivityItem key={scan.id} {...scan} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <h3 className="text-lg font-medium">Content Analysis Summary</h3>
            <Card>
              <CardHeader>
                <CardTitle>Harm Category Distribution</CardTitle>
                <CardDescription>Breakdown of detected harmful content by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
