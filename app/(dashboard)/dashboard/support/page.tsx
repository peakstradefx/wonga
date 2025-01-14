import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

function SupportPage() {
    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">PeaksTradeFX Support</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="sr-only">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <p>For inquiries, suggestions or complains. Mail us at</p>
                    <Link href="mailto:support@peakstradefx.com" className="text-primary underline">support@peakstradefx.com</Link>
                </CardContent>
            </Card>
        </DashboardContainer>
    )
}

export default SupportPage
