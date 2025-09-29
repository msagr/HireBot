import { usePathname } from 'next/navigation';

import { Bell, Briefcase, Calendar, Home, LayoutDashboard, List, Settings, User } from 'lucide-react';

export const NavItems = () => {
  const pathname = usePathname();

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  return [
    {
      name: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard size={20} />,
      active: pathname === '/',
      position: 'top',
    },
    {
      name: 'Scheduled Interview',
      href: '/dashboard/profile',
      icon: <Calendar size={20} />,
      active: isNavItemActive(pathname, '/dashboard/profile'),
      position: 'top',
    },
    {
      name: 'All Interview',
      href: '/dashboard/notifications',
      icon: <List size={20} />,
      active: isNavItemActive(pathname, '/dashboard/notifications'),
      position: 'top',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, '/dashboard/settings'),
      position: 'bottom',
    },
  ];
};