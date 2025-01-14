import React from 'react'
import TradingViewTickerTape from '../dashboard/TradingViewTickerTape'

function VideoSection() {
    return (
        <section>
            <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                <div className="relative w-full flex justify-center mt-12 md:rounded-3xl overflow-hidden">
                    <video
                        className="w-full min-h-[400px] max-h-[800px] object-cover"
                        poster="https://static.tradingview.com/static/bundles/main-video-preview.6e3d08ce607447e44c84.webp"
                        muted
                        autoPlay
                        loop
                        playsInline
                    >
                        <source
                            src="https://static.tradingview.com/static/bundles/widgets-main-video.hvc1.3010a527240f8051d301.mp4"
                            type="video/mp4;codecs=hvc1.1.0.L150.b0"
                        />
                        <source
                            src="https://static.tradingview.com/static/bundles/widgets-main-video.a3d7152108cd9db92d6c.webm"
                            type="video/webm"
                        />
                        <source
                            src="https://static.tradingview.com/static/bundles/widgets-main-video.avc1.330a059dc17d55b1245c.mp4"
                            type="video/mp4;codecs=avc1"
                        />
                    </video>
                </div>
            </div>
            <div className='mt-4'>
            <TradingViewTickerTape />
            </div>
        </section>
    )
}

export default VideoSection
