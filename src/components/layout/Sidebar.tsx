import { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Mail, 
  Globe, 
  Send, 
  Settings, 
  UserCheck, 
  Webhook,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  department: string;
  lastLogin: string;
}

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

export function Sidebar({ currentPage, onPageChange, user, onLogout, isMobile = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'campaigns', icon: Target, label: 'Campañas' },
    { id: 'detection', icon: Shield, label: 'Detección' },
    { id: 'users', icon: Users, label: 'Usuarios y Grupos' },
    { id: 'templates', icon: Mail, label: 'Plantillas de Email' },
    { id: 'landing', icon: Globe, label: 'Páginas de Destino' },
    { id: 'sending', icon: Send, label: 'Perfiles de Envío' },
    { id: 'account', icon: Settings, label: 'Configuración de Cuenta' },
  ];

  const adminItems = [
    { id: 'management', icon: UserCheck, label: 'Gestión de Usuarios', badge: 'Admin' },
    { id: 'webhooks', icon: Webhook, label: 'Webhooks', badge: 'Admin' },
  ];

  const helpItems = [
    { id: 'guide', icon: BookOpen, label: 'Guía de Usuario' },
    { id: 'api', icon: FileText, label: 'Documentación API' },
  ];

  // Helper para obtener iniciales de forma segura
  const getUserInitials = () => {
    if (!user?.displayName) return 'U';
    return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`bg-primary text-primary-foreground transition-all duration-300 ${
      isMobile ? 'w-full' : (isCollapsed ? 'w-16' : 'w-64')
    } ${isMobile ? 'h-full' : 'min-h-screen'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-primary-foreground/20 flex items-center justify-between">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">UTEM</span>
              <span className="text-xs text-primary-foreground/70">Ciberseguridad</span>
            </div>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-primary-foreground hover:bg-primary-foreground/20 p-1.5"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* User Info */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-b border-primary-foreground/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-left h-auto p-2 hover:bg-primary-foreground/20"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`} />
                  <AvatarFallback className="bg-secondary text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-foreground truncate">{user?.displayName || 'Usuario'}</p>
                  <p className="text-xs text-primary-foreground/70 truncate">{user?.department || 'Sin asignar'}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none">{user?.displayName || 'Usuario'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || '—'}</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onPageChange('account')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onPageChange('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Collapsed User Avatar */}
      {isCollapsed && !isMobile && (
        <div className="p-2 border-b border-primary-foreground/20 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-1.5 hover:bg-primary-foreground/20"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || 'User'}`} />
                  <AvatarFallback className="bg-secondary text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="start" side="right" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none">{user?.displayName || 'Usuario'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || '—'}</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => onPageChange('account')}>
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => onPageChange('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Menu */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 text-left h-10 ${
                currentPage === item.id 
                  ? "bg-secondary text-white" 
                  : "text-primary-foreground hover:bg-primary-foreground/20"
              } ${(isCollapsed && !isMobile) ? 'px-2' : 'px-3'}`}
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
            </Button>
          ))}
        </div>

        {/* Admin Section */}
        {(!isCollapsed || isMobile) && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70 px-3 mb-2">
              Administración
            </p>
            {adminItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 text-left h-10 ${
                  currentPage === item.id 
                    ? "bg-secondary text-white" 
                    : "text-primary-foreground hover:bg-primary-foreground/20"
                } px-3`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1">{item.label}</span>
                <Badge variant="outline" className="text-xs border-primary-foreground/30 text-primary-foreground/70">
                  {item.badge}
                </Badge>
              </Button>
            ))}
          </div>
        )}

        {/* Help Section */}
        {(!isCollapsed || isMobile) && (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70 px-3 mb-2">
              Ayuda
            </p>
            {helpItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 text-left h-10 ${
                  currentPage === item.id 
                    ? "bg-secondary text-white" 
                    : "text-primary-foreground hover:bg-primary-foreground/20"
                } px-3`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </nav>

      {/* Version */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-primary-foreground/20 text-xs text-primary-foreground/70">
          v1.0.0
        </div>
      )}
    </div>
  );
}