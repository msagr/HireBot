import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Calendar, User, Zap, CalendarClock, CheckCircle, Clock4, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TestStatus = 'upcoming' | 'in-progress' | 'completed' | 'needs-action';

interface ScheduledTest {
  id: string;
  title: string;
  candidateName: string;
  date: string;
  duration: string;
  status: TestStatus;
  skills: string[];
}

const mockScheduledTests: ScheduledTest[] = [
  {
    id: '1',
    title: 'Frontend Developer Assessment',
    candidateName: 'John Doe',
    date: '2023-11-15T14:30:00Z',
    duration: '60 mins',
    status: 'upcoming',
    skills: ['React', 'TypeScript', 'CSS']
  },
  {
    id: '2',
    title: 'Backend System Design',
    candidateName: 'Jane Smith',
    date: '2023-11-16T10:00:00Z',
    duration: '90 mins',
    status: 'in-progress',
    skills: ['Node.js', 'AWS', 'Docker']
  },
  {
    id: '3',
    title: 'Full Stack Challenge',
    candidateName: 'Alex Johnson',
    date: '2023-11-10T09:15:00Z',
    duration: '120 mins',
    status: 'completed',
    skills: ['React', 'Node.js', 'MongoDB']
  },
  {
    id: '4',
    title: 'UI/UX Design Review',
    candidateName: 'Sarah Williams',
    date: '2023-11-18T13:45:00Z',
    duration: '45 mins',
    status: 'needs-action',
    skills: ['Figma', 'UI Design', 'Prototyping']
  }
];

const getStatusIcon = (status: TestStatus) => {
  switch (status) {
    case 'upcoming':
      return <Clock4 className="w-4 h-4 text-blue-500" />;
    case 'in-progress':
      return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'needs-action':
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: TestStatus) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  switch (status) {
    case 'upcoming':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case 'in-progress':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'needs-action':
      return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200`;
    default:
      return baseClasses;
  }
};

export default function ScheduledTestsPage() {
  const upcomingTests = mockScheduledTests.filter(test => test.status === 'upcoming');
  const inProgressTests = mockScheduledTests.filter(test => test.status === 'in-progress');
  const completedTests = mockScheduledTests.filter(test => test.status === 'completed');
  const needsActionTests = mockScheduledTests.filter(test => test.status === 'needs-action');

  const renderTestCard = (test: ScheduledTest) => (
    <Card key={test.id} className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{test.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="w-4 h-4 mr-1" />
              {test.candidateName}
            </CardDescription>
          </div>
          <span className={getStatusBadgeClass(test.status)}>
            {getStatusIcon(test.status)}
            <span className="ml-1">
              {test.status.replace('-', ' ')}
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {test.skills.map((skill, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-4">
            {new Date(test.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{test.duration}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Tests</h1>
          <p className="text-muted-foreground">
            Manage and track all your candidate assessments in one place
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule New Test
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Upcoming
            <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {upcomingTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            In Progress
            <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
              {inProgressTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="needs-action" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Needs Action
            <span className="ml-1 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-amber-900 dark:text-amber-200">
              {needsActionTests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
            <span className="ml-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">
              {completedTests.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingTests.map(renderTestCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarClock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming tests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Schedule a new test to get started.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inProgressTests.map(renderTestCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tests in progress</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tests currently being taken will appear here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="needs-action" className="space-y-4">
          {needsActionTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {needsActionTests.map(renderTestCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No action needed at this time.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedTests.map(renderTestCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No completed tests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Completed tests will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
