import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Settings,
  X,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/education', label: 'EDUCATION', icon: BookOpen },
  { path: '/triggers', label: 'AWARENESS', icon: AlertTriangle },
  { path: '/milestones', label: 'QUIT DATE', icon: Award },
  { path: '/statistics', label: 'TRIGGERS', icon: BarChart3 },
  { path: '/progress', label: 'PROGRESS', icon: TrendingUp },
  { path: '/emergency', label: 'WHAT TO DO IF', icon: HelpCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ onClose, isMobile }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.div
      initial={isMobile ? { x: -300 } : false}
      animate={{ x: 0 }}
      exit={isMobile ? { x: -300 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col h-full bg-white border-r border-gray-200"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <motion.img
            src="/logo.png"
            alt="QuitSmart Logo"
            className="w-8 h-8 object-contain"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <span className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
            QuitApp
          </span>
        </Link>
        {isMobile && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <Link
                to={item.path}
                onClick={() => isMobile && onClose?.()}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden group',
                  isActive
                    ? 'bg-brand-purple-100 text-brand-purple-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple-600 rounded-r"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span className="group-hover:translate-x-1 transition-transform">
                  {item.label}
                </span>
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 border-t border-gray-200"
      >
        <div className="text-sm text-gray-500 text-center">
          The New Way to Stop Smoking
        </div>
      </motion.div>
    </motion.div>
  );
}
