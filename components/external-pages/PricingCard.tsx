import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';

interface PricingCardProps {
    planName: string;
    duration: string;
    investmentAmount: string;
    minDeposit: string;
    maxDeposit: string;
    minReturns: string;
    maxReturns: string;
    giftBonus: string;
    isPopular?: boolean;
}

function PricingCard({ planName, investmentAmount, duration, minDeposit, maxDeposit, minReturns, maxReturns, isPopular }: PricingCardProps) {
    return (
        <div className="shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 relative">
            {isPopular && (
                <span className="px-2 py-1 text-[10px] font-semibold text-white bg-orange-400 rounded-lg ml-3 absolute -left-4 top-0">Most popular</span>
            )}
            <div className="h-32 bg-primary text-center p-4">
                <h3 className="text-2xl text-white font-semibold mb-1">{planName}</h3>
                <p className="text-xs text-white">{duration}</p>
            </div>

            <div className="h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-primary text-white border-[3px] flex flex-col items-center justify-center border-white">
                <h3 className="text-xl">${investmentAmount}</h3>
            </div>

            <div className="px-6 py-4 mt-4">
                <ul className="space-y-4">
                    <li className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-3 bg-gray-700 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Min. Deposit: ${minDeposit}
                    </li>
                    <li className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-3 bg-gray-700 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Max. Deposit: ${maxDeposit}
                    </li>
                    <li className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-3 bg-gray-700 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Min. ROI: ${minReturns}
                    </li>
                    <li className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-3 bg-gray-700 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Max. ROI: ${maxReturns}
                    </li>
                    <li className="flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" className="mr-3 bg-gray-700 fill-white rounded-full p-[3px]" viewBox="0 0 24 24">
                            <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z" data-original="#000000" />
                        </svg>
                        Professional Support
                    </li>
                </ul>
                <Link href="/auth/register" className='w-full flex justify-center my-4'><Button className='w-full'>Get started</Button></Link>
            </div>
        </div>
    )
}

export default PricingCard
