'use client';

import { useSession } from 'next-auth/react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  ChevronRight,
  Plus,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const stats = [
  {
    title: 'Total Tests',
    value: '24',
    icon: <Users className="h-5 w-5" />,
    change: '+12%',
    changeType: 'positive',
  },
  {
    title: 'Upcoming',
    value: '5',
    icon: <Clock className="h-5 w-5" />,
    change: '+2',
    changeType: 'neutral',
  },
  {
    title: 'Completed',
    value: '18',
    icon: <CheckCircle className="h-5 w-5" />,
    change: '+5',
    changeType: 'positive',
  },
  {
    title: 'Pending Feedback',
    value: '3',
    icon: <AlertCircle className="h-5 w-5" />,
    change: '-1',
    changeType: 'negative',
  },
];

const recentActivities = [
  { id: 1, title: 'New test scheduled', time: '10 min ago', status: 'completed' },
  { id: 2, title: 'Test for Alex Johnson', time: '2 hours ago', status: 'upcoming' },
  {
    id: 3,
    title: 'Feedback received for UI/UX position',
    time: '1 day ago',
    status: 'completed',
  },
  { id: 4, title: 'Resume shortlisted for review', time: '2 days ago', status: 'in-progress' },
];

// ✅ Map fixed Tailwind classes instead of dynamic template strings
const shadowMap = {
  positive: 'shadow-green-500/20',
  negative: 'shadow-rose-500/20',
  neutral: 'shadow-amber-500/20',
};

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="relative pt-12 pb-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Welcome to HireBot
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Hello, {session?.user?.name || 'User'}
              <span className="wave">👋</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your hiring process with AI-powered candidate assessments
            </p>
          </div>

          {/* Create New Test Section */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-md transition-all duration-500 animate-gradient-xy" />

              <button className="relative w-full bg-gradient-to-br from-card to-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-1 text-left group-hover:border-primary/30 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-700 group-hover:scale-125" />
                  <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-all duration-700 group-hover:scale-125" />
                </div>

                <div className="relative z-10 p-7">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    {/* Left content */}
                    <div className="flex items-start space-x-5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative flex items-center justify-center h-20 w-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                          <div className="relative z-10 flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                            <ClipboardList className="h-7 w-7" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-xs font-bold border-2 border-card">
                            <Plus className="h-3 w-3" />
                          </div>
                        </div>
                      </div>

                      <div 
                        className="pt-1 cursor-pointer"
                        onClick={() => router.push('/dashboard/create-interview')}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                            Create New Test
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 animate-pulse">
                            New
                          </span>
                        </div>
                        <p className="text-muted-foreground max-w-lg">
                          Launch a fully customized assessment with our AI-powered test builder. Create, customize, and
                          deploy in minutes, not hours.
                        </p>
                      </div>
                    </div>

                    {/* Right content */}
                    <div className="flex-shrink-0">
                      <div className="relative group/btn">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20 group-hover/btn:shadow-xl group-hover/btn:shadow-primary/30 transition-all duration-300 group-hover/btn:scale-110">
                          <Plus className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto -mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const gradientMap = {
              positive: 'from-green-500/10 to-emerald-500/5',
              negative: 'from-rose-500/10 to-pink-500/5',
              neutral: 'from-amber-500/10 to-orange-500/5',
            };

            const iconGradient = {
              positive: 'from-green-500 to-emerald-500',
              negative: 'from-rose-500 to-pink-500',
              neutral: 'from-amber-500 to-orange-500',
            };

            return (
              <div
                key={i}
                className={`relative group overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 hover:shadow-primary/10`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradientMap[stat.changeType]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-500" />

                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-primary/30">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center">
                        {stat.title}
                        <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </p>
                      <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        {stat.value}
                      </h3>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${iconGradient[stat.changeType]} text-white shadow-lg ${shadowMap[stat.changeType]}`}
                    >
                      {React.cloneElement(stat.icon, { className: 'h-5 w-5' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto mt-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Upcoming Tests */}
          <div 
            className="md:col-span-2 group cursor-pointer"
            onClick={(e) => {
              // Don't navigate if the click was on the button (let the button handle it)
              if (!e.target.closest('button')) {
                router.push('/dashboard/create-interview');
              }
            }}
          >
            <div className="relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-500" />
              <Card className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden group-hover:border-primary/30 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/30">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                      Upcoming Tests
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative group/empty">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl blur-md opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 p-8 text-center transition-all duration-300 group-hover/empty:border-primary/30 group-hover/empty:bg-gradient-to-br group-hover/empty:from-card group-hover/empty:to-card/50">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-lg font-semibold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        No upcoming tests
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs">You don&apos;t have any tests scheduled for today.</p>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card's click handler from firing
                          router.push('/dashboard/create-interview');
                        }}
                        className="relative overflow-hidden group/btn w-full"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center justify-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Create New Test
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1 group">
            <div className="relative h-full">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/20 via-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg group-hover:blur-xl transition-all duration-500" />
              <Card className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden group-hover:border-primary/30 transition-all duration-300">
                <CardHeader className="border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        <ClockIcon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        Recent Activity
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">
                      View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const statusColors = {
                        completed: {
                          bg: 'bg-green-500/10',
                          text: 'text-green-600 dark:text-green-400',
                          border: 'border-green-500/20',
                          icon: 'text-green-500'
                        },
                        upcoming: {
                          bg: 'bg-blue-500/10',
                          text: 'text-blue-600 dark:text-blue-400',
                          border: 'border-blue-500/20',
                          icon: 'text-blue-500'
                        },
                        'in-progress': {
                          bg: 'bg-amber-500/10',
                          text: 'text-amber-600 dark:text-amber-400',
                          border: 'border-amber-500/20',
                          icon: 'text-amber-500'
                        }
                      };
                      const colors = statusColors[activity.status] || statusColors.completed;
                      
                      return (
                        <div 
                          key={activity.id} 
                          className="group/item relative p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          <div className="relative flex items-start space-x-3">
                            <div className={`flex-shrink-0 p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                              <ClockIcon className={`h-4 w-4 ${colors.icon}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{activity.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                            </div>
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}
                            >
                              {activity.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <Button 
                      variant="outline" 
                      className="w-full mt-2 relative overflow-hidden group/btn border-border/50 hover:border-primary/30 transition-colors"
                      size="sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">View All Activity</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
