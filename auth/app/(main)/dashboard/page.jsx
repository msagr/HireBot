'use client';

import { Calendar, Clock, Users, CheckCircle, Clock as ClockIcon, AlertCircle, ChevronRight, MessageSquare, PhoneCall, Plus, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
  { title: 'Total Interviews', value: '24', icon: <Users className="h-5 w-5 text-blue-500" />, change: '+12%', changeType: 'positive' },
  { title: 'Upcoming', value: '5', icon: <Clock className="h-5 w-5 text-amber-500" />, change: '+2', changeType: 'neutral' },
  { title: 'Completed', value: '18', icon: <CheckCircle className="h-5 w-5 text-green-500" />, change: '+5', changeType: 'positive' },
  { title: 'Pending Feedback', value: '3', icon: <AlertCircle className="h-5 w-5 text-rose-500" />, change: '-1', changeType: 'negative' },
];

const recentActivities = [
  { id: 1, title: 'New interview scheduled', time: '10 min ago', status: 'completed' },
  { id: 2, title: 'Interview with Alex Johnson', time: '2 hours ago', status: 'upcoming' },
  { id: 3, title: 'Feedback received for UI/UX position', time: '1 day ago', status: 'completed' },
  { id: 4, title: 'Resume shortlisted for review', time: '2 days ago', status: 'in-progress' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl border">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-semibold">Welcome back, <span className="text-primary">Mehul</span> 👋</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your interviews today.
          </p>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* New Interview Card */}
            <button className="group flex items-center p-4 rounded-lg border hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-200">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mr-4 group-hover:bg-primary/20 transition-colors">
                <Video className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">New Interview</h3>
                <p className="text-sm text-muted-foreground">Schedule a video interview</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            
            {/* Phone Screening Card */}
            <button className="group flex items-center p-4 rounded-lg border hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-200">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-4 group-hover:bg-blue-200/70 dark:group-hover:bg-blue-900/50 transition-colors">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Phone Screening</h3>
                <p className="text-sm text-muted-foreground">Schedule a quick call</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Header */}
      <div className="flex items-center justify-between pt-2 pb-1 border-b border-border/40">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your interview activities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-md bg-primary/10 p-2">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 ${
                stat.changeType === 'positive' ? 'text-green-500' : 
                stat.changeType === 'negative' ? 'text-rose-500' : 'text-amber-500'
              }`}>
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar Section */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Schedule</CardTitle>
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No upcoming interviews</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any interviews scheduled for today.
                </p>
                <Button className="mt-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <ClockIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    activity.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {activity.status.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}