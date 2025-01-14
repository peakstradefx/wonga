import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

function HeroSection() {
    return (
        <div className='lg:pl-8'>
            <div
                className="rounded-2xl bg-indigo-50 py-10 overflow-hidden my-5 lg:m-0 2xl:py-16 xl:py-8  lg:rounded-tl-2xl lg:rounded-bl-2xl ">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12">
                        <div className="w-full xl:col-span-5 lg:col-span-6 2xl:-mx-5 xl:-mx-0">
                            <div className="flex items-center text-sm font-medium text-gray-500 justify-center lg:justify-start">
                                <span className="bg-indigo-600 py-1 px-3 rounded-2xl text-xs font-medium text-white mr-3 ">#1</span>
                                Investment app
                            </div>
                            <h1 className="py-8 text-center text-gray-900 font-bold font-manrope text-4xl md:text-5xl lg:text-left leading-[48px] md:leading-[70px]">
                                Regulated Mining Platform | Forex<span className="text-indigo-600"> Broker Options</span>
                            </h1>
                            <p className=" text-gray-500 text-lg text-center lg:text-left">
                                Start trading with a reliable Mining broker!
                            </p>
                            <div className='my-4 flex justify-center md:justify-start w-full'>
                                <Link href="/auth/login"><Button>Get Started</Button></Link>
                            </div>
                        </div>
                        <div className="w-full xl:col-span-7  lg:col-span-6 block">
                            <div className="w-full  sm:w-auto lg:w-[60.8125rem] xl:ml-16">
                                <Image src="/assets/images/2151871191.jpg" alt="Dashboard image" className="rounded-l-3xl object-cover" width={3400} height={3400} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
