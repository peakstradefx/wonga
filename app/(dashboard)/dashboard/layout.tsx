"use client"
import AnnouncementModal from '@/components/dashboard/AnnouncementModal';
import { AppSidebar } from '@/components/dashboard/AppSideBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <nav className='relative p-3 bg-primary text-white'>
                    <SidebarTrigger />
                    <span className='font-bold text-xl ml-4 md:ml-10'>
                        PeaksTrade FX
                    </span>
                </nav>
                {children}
            </main>
            <AnnouncementModal />
        </SidebarProvider>
    )
}

export default DashboardLayout
