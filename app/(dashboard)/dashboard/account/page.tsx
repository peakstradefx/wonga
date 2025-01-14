import DashboardContainer from '@/components/dashboard/DashboardContainer'
import ProfileCard from '@/components/dashboard/ProfileCard';
import React from 'react'

function ProfilePage() {
    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Profile</h2>
            <div className='text-sm'>
                View and manage your profile information.
            </div>
            <ProfileCard />
        </DashboardContainer>
    );
}

export default ProfilePage;
