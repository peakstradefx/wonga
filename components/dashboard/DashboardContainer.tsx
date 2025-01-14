import React from 'react'

function DashboardContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='bg-[#f8f9fa] h-full'>
            <div className="flex-col">
                <div className="flex-1 space-y-4 py-8 px-4 sm:px-6 lg:px-8 pt-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardContainer
