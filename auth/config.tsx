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
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      active: pathname === '/dashboard',
      position: 'top',
    },
    {
      name: 'Scheduled Tests',
      href: '/dashboard/scheduled-tests',
      icon: <Calendar size={20} />,
      active: isNavItemActive(pathname, '/dashboard/scheduled-tests'),
      position: 'top',
    },
    {
      name: 'All Tests',
      href: '/dashboard/tests',
      icon: <List size={20} />,
      active: isNavItemActive(pathname, '/dashboard/tests'),
      position: 'top',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, '/dashboard/settings'),
      position: 'bottom',
    },
  ];
};