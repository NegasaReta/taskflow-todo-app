/**
 * Application Sidebar Component.
 * Navigation for the dashboard with task views and categories.
 */

import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import type { ViewMode } from '@/types';
import {
  CheckSquare,
  LayoutDashboard,
  Circle,
  CheckCircle2,
  Clock,
  Tag,
  LogOut,
  Plus,
  Settings,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Navigation items for main views
const mainNavItems = [
  { title: 'All Tasks', icon: LayoutDashboard, view: 'all' as ViewMode },
  { title: 'Pending', icon: Clock, view: 'pending' as ViewMode },
  { title: 'Completed', icon: CheckCircle2, view: 'completed' as ViewMode },
];

interface AppSidebarProps {
  onCreateTask: () => void;
}

export function AppSidebar({ onCreateTask }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();
  const location = useLocation();
  const { viewMode, setViewMode, selectedCategory, setSelectedCategory, categories, tasks } = useTasks();
  const { user, logout } = useAuth();

  // Count tasks for each view
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  // Count tasks per category
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = tasks.filter(t => t.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const handleNavClick = (view: ViewMode) => {
    setViewMode(view);
    setSelectedCategory(null);
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSettingsClick = () => {
    toast.info('Settings page coming soon!', {
      description: 'This feature will be available in a future update.',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar
      className={cn(
        'border-r-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <CheckSquare className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-sidebar-foreground">TaskFlow</span>
          )}
          <div className="ml-auto">
            <SidebarTrigger className="text-sidebar-muted hover:text-sidebar-foreground" />
          </div>
        </div>

        {/* Create Task Button */}
        <div className="px-2 pb-3">
          <Button
            onClick={onCreateTask}
            className={cn(
              'w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground',
              collapsed && 'px-0'
            )}
            size={collapsed ? 'icon' : 'default'}
          >
            <Plus className={cn('h-4 w-4', !collapsed && 'mr-2')} />
            {!collapsed && 'New Task'}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-muted">Views</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavClick(item.view)}
                    isActive={viewMode === item.view && !selectedCategory}
                    tooltip={collapsed ? item.title : undefined}
                    className={cn(
                      'transition-colors',
                      viewMode === item.view && !selectedCategory
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        <span className="text-xs text-sidebar-muted">
                          {taskCounts[item.view]}
                        </span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-muted flex items-center gap-2">
              <Tag className="h-3 w-3" />
              Categories
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    onClick={() => handleCategoryClick(category)}
                    isActive={selectedCategory === category}
                    tooltip={collapsed ? category : undefined}
                    className={cn(
                      'transition-colors',
                      selectedCategory === category
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <Circle className="h-3 w-3" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{category}</span>
                        <span className="text-xs text-sidebar-muted">
                          {categoryCounts[category] || 0}
                        </span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSettingsClick}
              tooltip={collapsed ? 'Settings' : undefined}
              className="text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={collapsed ? user?.name || 'Profile' : undefined}
              className="text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <User className="h-4 w-4" />
              {!collapsed && <span className="truncate">{user?.name || 'Demo User'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={collapsed ? 'Logout' : undefined}
              className="text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
