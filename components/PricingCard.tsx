import React from 'react'
import PricingModal from './PricingModal';

type PricingCardProps = {
    planName: string;
    price: string;
    minDeposit: string;
    maxDeposit: string;
    min: number;
    max: number;
    minReturns: string;
    maxReturns: string;
    giftBonus: string;
    duration: number;

}

function PricingCard({ planName, price, minDeposit, maxDeposit, minReturns, maxReturns, giftBonus, duration, min, max }: PricingCardProps) {
    return (
        <div className="flex flex-col p-6 mx-auto w-full max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-5 dark:bg-gray-800 dark:text-white">
            <h3 className="mb- text-xl font-semibold">{planName} Plan</h3>
            <div className="flex justify-center items-baseline my-6">
                <span className="mr-2 text-4xl font-bold">${price}</span>
            </div>

            <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center justify-between space-x-3 text-sm">
                    <span>Minimum Deposit:</span>
                    <span className="font-semibold">${minDeposit}</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Maximum Deposit: </span>
                    <span className="font-semibold">${maxDeposit}</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Minimum Return: </span>
                    <span className="font-semibold">${minReturns}</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Maximum Return: </span>
                    <span className="font-semibold">${maxReturns}</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Gift Bonus:</span>
                    <span className="font-semibold">${giftBonus}</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Duration:</span>
                    <span className="font-semibold">{duration} days</span>
                </li>
                <li className="flex items-center justify-between space-x-3 text-sm">

                    <span>Amount to invest: </span>
                    <span className="font-semibold">{`($${price} default)`}</span>
                </li>
            </ul>
            <PricingModal planName={planName} maxDeposit={max} minDeposit={min} />
        </div>
    )
}

export default PricingCard
