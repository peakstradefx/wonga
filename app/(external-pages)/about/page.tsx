import PageContainer from '@/components/external-pages/PageContainer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AboutPage() {
    return (
        <PageContainer>
            <section className="py-8 lg:py-24 relative">
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
                    <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h2 className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal text-center">About Us</h2>
                                <p>PeakTrade FX. was established by a crew of experts in the financial sphere with a clear-sighted perception of making a directed web trading brokerage that would give investments administrations to a wide range of brokers and foundations, all around the world.</p>
                                <p>The organization&apos;s innovative foundation was developed within a profound comprehension of the broker&apos;s progressing needs. Joined with robust associations inside the banking system and with liquidity suppliers, PeakTrade FX. intends to offer a standout amongst the best trading experiences in the market today.</p>
                                <p>Despite offering top of the line innovative arrangements, PeakTrade FX. is focused on giving an expert and transparent trading environment.</p>
                                <p>PeakTrade FX. believes that maintaining the following three pillars: Innovative Trading Platforms, Innovative Trading Tools, & Excellent Trading Conditions to the highest standards enables this.</p>
                                <p>PeakTrade FX. believes the best way to approach this statement is through the foundation of 3 Pillars. The 3 Pillar Concept is based on the idea that informed trading comes from providing Innovative Trading Platforms, Innovative Trading Tools, and Excellent Trading Conditions.</p>
                            </div>
                            <Link href="/auth/register"><Button>Get started</Button></Link>
                        </div>
                        <Image className="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="/assets/images/90941.jpg" alt="about Us image" width={2000} height={2000} />
                    </div>
                </div>
                <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto mt-20">
                    <div className="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                                <h2 className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal text-center">Global Operations</h2>
                                <ul>
                                    <li className='mb-2 list-decimal'>PeakTrade FX is a Maltese regulated investment services provider that operates under European and Maltese regulations. PeakTrade FX. services are oriented to the English, French, German, Italian, and Arabic markets.</li>
                                    <li className='mb-2 list-decimal'>PeakTrade FX is an innovative broker with a global stance. Don&apos;t hesitate to get in touch with us to check whether we can support your investment needs. As P24O moves forward, our significant advances, contributions, and services will always suit.</li>
                                    <li className='mb-2 list-decimal'>Despite offering top of the line innovative solutions, PeakTrade FX. is focused on providing a professional and transparent trading environment.</li>
                                    <li className='mb-2 list-decimal'>PeakTrade FX&apos;s approach to innovation can be put simply as &apos;advancement&apos;. Advancement is incorporated into every structure and system that PeakTrade FX. produces, to create the best, most intuitive products possible.</li>
                                    <li className='mb-2 list-decimal'>PeakTrade FX has built up a flawless data safety foundation, advanced solutions, and capabilities that put our clients&apos; trading experience at the forefront.</li>
                                    <li className='mb-2 list-decimal'>Please review our Technology page to understand in greater detail how PeakTrade FX. Technologies work.</li>
                                </ul>
                            </div>
                        </div>
                        <Image className="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="/assets/images/22454.jpg" alt="about Us image" width={2000} height={2000} />
                    </div>
                </div>
            </section>

        </PageContainer>
    )
}

export default AboutPage
