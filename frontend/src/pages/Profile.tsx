import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Bell, 
  Shield,
  LogOut,
  Edit,
  Save
} from 'lucide-react';
import { authService, AuthState } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { mockTasks, mockProjects } from '@/data/mockData';

export default function Profile() {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    deadline: true,
    comments: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: 'Preferences updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  if (!authState.user) {
    return null;
  }

  const user = authState.user;
  const userTasks = mockTasks.filter(task => task.assignee_id === user.id);
  const userProjects = mockProjects.filter(project => 
    project.members.some(member => member.user_id === user.id)
  );
  const completedTasks = userTasks.filter(task => task.status === 'done').length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    defaultValue={user.full_name}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    defaultValue={user.username}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-muted' : ''}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Member since {new Date(user.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Deadline Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming deadlines
                  </p>
                </div>
                <Switch
                  checked={notifications.deadline}
                  onCheckedChange={(checked) => handleNotificationChange('deadline', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Comments & Mentions</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone comments or mentions you
                  </p>
                </div>
                <Switch
                  checked={notifications.comments}
                  onCheckedChange={(checked) => handleNotificationChange('comments', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Active Sessions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Activity Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userTasks.length}</div>
                <p className="text-sm text-muted-foreground">Assigned Tasks</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{completedTasks}</div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userProjects.length}</div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Your Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.members.length} members
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
              ))}
              
              {userProjects.length > 3 && (
                <p className="text-xs text-center text-muted-foreground">
                  +{userProjects.length - 3} more projects
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}