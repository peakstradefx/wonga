import React from 'react'

function PageContainer({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="lg:pt-20 pt-0 h-full">
            {children}
        </section>
    )
}

export default PageContainer
