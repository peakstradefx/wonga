import Footer from '@/components/external-pages/Footer';
import NavBar from '@/components/external-pages/NavBar'
import NotificationBlock from '@/components/external-pages/NotificationBlock';
import React from 'react'

function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <NavBar />
            <NotificationBlock />
            {children}
            <Footer />
        </main>
    )
}

export default layout
