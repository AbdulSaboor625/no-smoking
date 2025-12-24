import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  X,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const overviewItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/education', label: 'Education', icon: BookOpen },
  { path: '/triggers', label: 'Awareness', icon: AlertTriangle },
  { path: '/milestones', label: 'Quit Date', icon: Calendar },
  { path: '/statistics', label: 'Triggers', icon: BarChart3 },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/emergency', label: 'What to do if', icon: HelpCircle },
];

export function Sidebar({ onClose, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    handleLogout();
  };

  return (
    <motion.div
      initial={isMobile ? { x: -300 } : false}
      animate={{ x: 0 }}
      exit={isMobile ? { x: -300 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col h-full bg-white border-r border-gray-200"
    >
      <div className='p-6 h-full flex flex-col'>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <img
              src="/assets/images/logo.svg"
              alt="QuitSmart Logo"
              className="w-[93px] h-[70px] object-contain"
            />
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Overview Section - Scrollable */}
        <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6">
          <div>
            <span className='block text-sm font-normal text-[#9E9E9E] mb-4 uppercase'>Overview</span>
            <div className="space-y-1">
              {overviewItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && onClose?.()}
                    className={cn(
                      'text-[20px] font-normal flex items-center gap-3 py-3 px-2 rounded transition-colors group',
                      isActive
                        ? 'text-[#561F7A] font-semibold'
                        : 'text-[#000000] hover:text-[#561F7A] hover:font-semibold'
                    )}
                  >
                    <Icon 
                      className={cn(
                        'h-[22px] w-[22px] flex-shrink-0 group-hover:font-semibold',
                        isActive ? 'stroke-[#561F7A]' : 'stroke-[#000000] hover:font-semibold'
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                      {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Settings Section - Fixed at Bottom */}
        <div className="flex-shrink-0">
          <span className='block text-sm font-normal text-[#9E9E9E] mb-4 uppercase'>Settings</span>
          <div className="space-y-1">
            <Link
              to="/settings"
              onClick={() => isMobile && onClose?.()}
              className={cn(
                'text-[20px] flex items-center gap-3 py-3 px-2 rounded transition-colors group',
                location.pathname === '/settings'
                  ? 'text-[#561F7A] !font-semibold'
                  : 'text-[#000000] hover:text-[#561F7A] hover:font-semibold'
              )}
            >
              <Settings 
                className={cn(
                  'h-[22px] w-[22px] group-hover:font-semibold flex-shrink-0',
                  location.pathname === '/settings' ? 'stroke-[#561F7A]' : 'stroke-[#000000]'
                )}
                strokeWidth={location.pathname === '/settings' ? 2 : 1.5}
              />
              <span className="text-[20px] group-hover:font-semibold">
                Settings
              </span>
            </Link>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 py-2 px-2 rounded transition-colors w-full text-left text-[#000000] hover:text-[#561F7A]"
            >
              <LogOut 
                className="h-5 w-5 flex-shrink-0 stroke-[#000000] hover:stroke-[#561F7A]"
                strokeWidth={1.5}
              />
              <span className="text-[20px] hover:font-semibold text-[#000000] hover:text-[#561F7A]">
                Logout
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-center gap-2 md:gap-1'>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogoutConfirm}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
