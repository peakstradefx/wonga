import PricingCard from '@/components/PricingCard'
import React from 'react'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { pricingDetails } from '@/data/pricingDetails'

function InvestmentPlanPage() {
    return (
        <DashboardContainer>
            <div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {
                        pricingDetails.map((item) => {
                            return (
                                <div key={item.id}>
                                    <PricingCard
                                        planName={item.planName}
                                        price={item.price}
                                        minDeposit={item.minDeposit}
                                        maxDeposit={item.maxDeposit}
                                        minReturns={item.minReturns}
                                        maxReturns={item.maxReturns}
                                        giftBonus={item.giftBonus}
                                        duration={item.duration}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </DashboardContainer>
    )
}

export default InvestmentPlanPage
