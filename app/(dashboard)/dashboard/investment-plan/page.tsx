import PricingCard from '@/components/PricingCard'
import React from 'react'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import { INVESTMENT_PLANS } from '@/data/investmentPlan'

function InvestmentPlanPage() {
    return (
        <DashboardContainer>
            <div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {
                        INVESTMENT_PLANS.map((item) => {
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
                                        duration={item.durationInDay}
                                        min={item.min}
                                        max={item.max}
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
