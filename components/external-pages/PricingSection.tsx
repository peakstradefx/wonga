import React from 'react'
import PricingCard from './PricingCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { INVESTMENT_PLANS } from '@/data/investmentPlan'

function PricingSection() {
    return (
        <section className="py-12 md:py-24">
            <div className="mx-auto max-w-5xl max-lg:max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal text-center">Our Investment Offers</h2>
                    <p className="text-sm text-gray-500">You can select the best plan that suit your budget</p>
                </div>

                <Tabs defaultValue="regular" className="w-full flex flex-col items-center">
                    <TabsList className='flex justify-center my-8'>
                        <TabsTrigger value="regular">Regular</TabsTrigger>
                        <TabsTrigger value="professional">Professional</TabsTrigger>
                        <TabsTrigger value="veteran">Veteran</TabsTrigger>
                    </TabsList>
                    <TabsContent value="regular" className='w-full'>
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6 max-sm:max-w-sm max-sm:mx-auto">
                            {
                                INVESTMENT_PLANS.slice(0, 3).map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <PricingCard
                                                planName={item.planName}
                                                investmentAmount={item.price}
                                                minDeposit={item.minDeposit}
                                                maxDeposit={item.maxDeposit}
                                                minReturns={item.minReturns}
                                                maxReturns={item.maxReturns}
                                                giftBonus={item.giftBonus}
                                                duration={item.durationInDay}
                                                isPopular={item.isPopular}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="professional" className='w-full'>
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6 max-sm:max-w-sm max-sm:mx-auto">
                            {
                                INVESTMENT_PLANS.slice(3, 6).map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <PricingCard
                                                planName={item.planName}
                                                investmentAmount={item.price}
                                                minDeposit={item.minDeposit}
                                                maxDeposit={item.maxDeposit}
                                                minReturns={item.minReturns}
                                                maxReturns={item.maxReturns}
                                                giftBonus={item.giftBonus}
                                                duration={item.durationInDay}
                                                isPopular={item.isPopular}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="veteran" className='w-full'>
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6 max-sm:max-w-sm max-sm:mx-auto">
                            {
                                INVESTMENT_PLANS.slice(6, 9).map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <PricingCard
                                                planName={item.planName}
                                                investmentAmount={item.price}
                                                minDeposit={item.minDeposit}
                                                maxDeposit={item.maxDeposit}
                                                minReturns={item.minReturns}
                                                maxReturns={item.maxReturns}
                                                giftBonus={item.giftBonus}
                                                duration={item.durationInDay}
                                                isPopular={item.isPopular}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </TabsContent>
                </Tabs>


            </div>
        </section>
    )
}

export default PricingSection
