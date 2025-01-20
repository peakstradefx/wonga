"use client"
import React from 'react'
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import useGetInvestments from '@/hooks/queries/useGetInvestments'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Investment {
    _id: string;
    amount: number;
    createdAt: string;
    currentReturn: number;
    lastProfitUpdate: string;
    percentageReturn: string;
    plan: string;
    status: string;
    updatedAt: string;
    totalReturnsEarned: string;

}

function PackagesPage() {
    const { data } = useGetInvestments()
    const activeInvestments = data?.data?.investments?.active
    const completedInvestments = data?.data?.investments?.completed

    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Your packages</h2>
            <div className="my-6">
                <Link href={"/dashboard/investment-plan"}>
                    <Button className='rounded-md'>
                        <Plus />
                        Add plan
                    </Button>
                </Link>
            </div>
            <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                {
                    activeInvestments?.map((investment: Investment) => {
                        return (
                            <div className="flex flex-col p-6 mx-auto w-full max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-5 dark:bg-gray-800 dark:text-white" key={investment?._id}>
                                <div className="my-6">
                                    <h3 className="mr-2 text-4xl font-bold">{investment?.plan}</h3>
                                    <span className='text-sm text-gray-700'>Activated on: {new Date(investment?.createdAt).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <ul role="list" className="mb-8 space-y-4 text-left">
                                    <li className="flex items-center justify-between space-x-3 text-sm">
                                        <span>Amount Invested:</span>
                                        <span className="font-semibold">${investment?.amount}</span>
                                    </li>
                                    <li className="flex items-center justify-between space-x-3 text-sm">

                                        <span>Incremental interval: </span>
                                        <span className="font-semibold">Daily</span>
                                    </li>
                                    <li className="flex items-center justify-between space-x-3 text-sm">

                                        <span>Percentage returns: </span>
                                        <span className="font-semibold">${investment?.percentageReturn}</span>
                                    </li>
                                    <li className="flex items-center justify-between space-x-3 text-sm">

                                        <span>Duration: </span>
                                        <span className="font-semibold">7 days</span>
                                    </li>
                                </ul>
                                <div className='text-blue-700 border border-blue-700 bg-blue-50 rounded-full py-1'>Active</div>
                            </div>
                        )
                    })
                }
            </div>
            {completedInvestments?.length > 0 && (
                <div className='mt-8'>
                    <div className='my-4'>
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Completed Packages</h2>
                    </div>
                    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                        {
                            completedInvestments?.map((investment: Investment) => {
                                return (
                                    <div className="flex flex-col p-6 mx-auto w-full max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-5 dark:bg-gray-800 dark:text-white" key={investment?._id}>
                                        <div className="my-6">
                                            <h3 className="mr-2 text-4xl font-bold">{investment?.plan} Plan</h3>
                                            <span className='text-sm text-gray-700'>Activated on: {new Date(investment?.createdAt).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        <ul role="list" className="mb-8 space-y-4 text-left">
                                            <li className="flex items-center justify-between space-x-3 text-sm">
                                                <span>Amount Invested:</span>
                                                <span className="font-semibold">${investment?.amount}</span>
                                            </li>
                                            <li className="flex items-center justify-between space-x-3 text-sm">

                                                <span>Incremental interval: </span>
                                                <span className="font-semibold">Daily</span>
                                            </li>
                                            <li className="flex items-center justify-between space-x-3 text-sm">

                                                <span>Percentage returns: </span>
                                                <span className="font-semibold">${investment?.percentageReturn}</span>
                                            </li>
                                            <li className="flex items-center justify-between space-x-3 text-sm">

                                                <span>Duration: </span>
                                                <span className="font-semibold">7 days</span>
                                            </li>
                                        </ul>
                                        <div className='text-green-700 border border-green-700 bg-green-50 rounded-full py-1'>Completed!</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )}
        </DashboardContainer>
    )
}

export default PackagesPage
