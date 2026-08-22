'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import ProjectShortcut from '../components/ProjectShortcut';
import Mobile from '../components/Mobile';
import { BlurBackground } from '../components/ui/BlurBackground';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  const isViewRoute = pathname.startsWith("/view/") || pathname.startsWith("/preview/");

  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname === "/signup";

  const hideShortcut =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/";

  return (
    <>
      <BlurBackground />
      {!isViewRoute && <Mobile />}
      {!hideNavbar && <Navbar />}
      {!hideShortcut && <ProjectShortcut />}
      <main>{children}</main>
    </>
  );
}
