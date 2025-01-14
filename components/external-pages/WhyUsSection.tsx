import Image from 'next/image'
import React from 'react'

function WhyUsSection() {
  return (
    <section className="py-12 md:py-24 relative xl:mr-0 lg:mr-5 mr-0">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                  <h2
                    className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal">
                    Why Trade Peak FX Platform?</h2>
                  <p
                    className="text-gray-500 text-base font-normal leading-relaxed">
                    Our achievement story is a testament to teamwork and perseverance. Together, we&apos;ve
                    overcome challenges, celebrated victories, and created a narrative of progress and
                    success.</p>
                  <p
                    className="text-gray-500 text-base font-normal leading-relaxed">
                    Traders are purchasers and merchants of the benefits on the Forex advertise. Their fundamental objective is to make the right forecasts in changes in the cost of the advantage they exchange. They base their choice on various strategies and methodologies.</p>
                  <p
                    className="text-gray-500 text-base font-normal leading-relaxed">
                    In case you&apos;re new in exchanging – we prescribe you to have a go at exchanging on the financial market on the demo account without putting your own cash at risk. Here you can test all highlights of the stage, see increasingly about the market and build up your own methodology.</p>
                  <p
                    className="text-gray-500 text-base font-normal leading-relaxed">
                    After you open a record in our organization, you can download the exchanging terminal, check the statements and open your trades. We offer to exchange stages both for PC and cell phones. It will make your Trade Peak FX Company trading as helpful as it can be.</p>
                  <p
                    className="text-gray-500 text-base font-normal leading-relaxed">
                    The best forex broker is Trade Peak FX Company Platform Trading, we have excellent trading conditions, as well as instant execution of transactions and quick payments in the way that is convenient for you.</p>
                </div>
              </div>
            </div>
            {/* <Link href="/auth/register">
            <Button></Button></Link> */}
          </div>
          <div className="w-full lg:justify-start justify-center items-start flex">
            <div
              className="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
              <Image className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                src="/assets/images/33535.jpg" alt="about Us image" width={2000} height={2000} />
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default WhyUsSection
