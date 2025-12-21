import { MessageCircle, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '../ui/button';
import { useLocation } from 'react-router-dom';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

// Map routes to page titles
const getPageTitle = (pathname: string): string => {
  const routeTitleMap: Record<string, string> = {
    '/dashboard': 'Stop Smoking Dashboard',
    '/settings': 'Stop Smoking Settings',
    '/education': 'Stop Smoking Education',
    '/progress': 'Stop Smoking Progress',
    '/triggers': 'Stop Smoking Awareness',
    '/milestones': 'Stop Smoking Quit Date',
    '/statistics': 'Stop Smoking Statistics',
    '/emergency': 'Emergency Help',
  };

  return routeTitleMap[pathname] || 'Stop Smoking Dashboard';
};

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';
  const displayLabel = displayName.includes(' ') ? displayName.split(' ')[0] : displayName;
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="px-4 md:py-8 py-3 md:px-6">
      <div className="flex flex-row items-start lg:items-center justify-end md:justify-between gap-4 lg:gap-6 xl:gap-8">
        {/* Hamburger Menu Button - Visible on all screens below xl, hidden on xl+ */}
        <Button
          variant="default"
          className="xl:hidden w-12 h-12 rounded-full border border-[#561F7A] flex items-center justify-center bg-[#fff] hover:bg-[#561F7A]/90 transition-colors text-[#561F7A] hover:text-[#ffffff] flex-shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="w-full lg:flex-1 min-w-0 hidden md:block">
          <Button
            variant="default"
            className="w-full justify-center px-5 sm:px-6 text-[#561F7A] font-semibold  text-base xl:text-xl 2xl:text-[28px] bg-[#F9C015] border border-[#561F7A] rounded-full h-[44px] xl:h-[54px] 2xl:h-[63px] hover:bg-[#dfb330] transition-all duration-200 cursor-pointer"
          >
            {pageTitle}
          </Button>
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 w-auto justify-end ">
          <Button variant="default" className="w-12 h-12 2xl:w-[63px] 2xl:h-[63px] rounded-full border border-[#561F7A] flex items-center justify-center bg-[#fff] hover:bg-[#561F7A]/90 transition-colors text-[#561F7A] hover:text-[#ffffff]">
              <MessageCircle className="!w-5 !h-5 2xl:w-6 2xl:h-6" />
          </Button>

          <Button variant="default" className="relative w-12 h-12 2xl:w-[63px] 2xl:h-[63px] rounded-full border border-[#561F7A] flex items-center justify-center bg-[#fff] hover:bg-[#561F7A]/90 transition-colors text-[#561F7A] hover:text-[#ffffff] group">
            <Bell className="!w-5 !h-5 2xl:w-6 2xl:h-6" />
            <span className="absolute top-2.5 right-3 2xl:top-4 2xl:right-5 bg-[#561F7A] group-hover:bg-[#ffffff] rounded-full w-2 h-2"></span>
          </Button>

          <div className="hidden sm:block w-[1px] h-[48px] 2xl:h-[63px] bg-[#9E9E9E]"></div>

          <div className="flex items-center gap-2 2xl:gap-3">
            <div className="w-12 h-12  2xl:w-[63px] 2xl:h-[63px] border border-[#561F7A] rounded-full bg-[#AE89C7] flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src={user?.avatarUrl || '/assets/images/avatar.svg'} 
                alt={displayName} 
                className="w-[28px] h-[35px] 2xl:w-[36px] 2xl:h-[44px] object-cover"
              />
            </div>
            
            <span
              className="text-[#561F7A] font-semibold text-sm sm:text-base 2xl:text-xl hidden sm:block cursor-pointer max-w-[140px] sm:max-w-[180px] md:max-w-[220px] truncate text-right"
              title={displayName}
            >
              {displayLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;