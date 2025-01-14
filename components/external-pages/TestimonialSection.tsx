import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import Image from 'next/image';

const testimonials = [
    {
        rating: "4.5",
        content: "I started investing in crypto back in 2017. I would say l was 4 on a scale of 1 to 10 when it came to it then! But today, I know all the basics, and already made over 5 million investing with PeakTrade compared to several friends of mine who took their money else where.",
        author: "Jane D",
        country: "USA",
        image: "https://pagedone.io/asset/uploads/1696229969.png"
    },
    {
        rating: "4.0",
        content: "Thanks to pagedone, I feel more informed and confident about my investment decisions than ever before.",
        author: "Harsh Posh.",
        country: "Canada",
        image: "https://pagedone.io/asset/uploads/1696229994.png"
    },
    {
        rating: "5.0",
        content: "I started investing in bitcoin and the crypto trading in January. “A friend showed me how much money he'd made on bitcoin trading with PeakTrade! I needed to give them a trial, to cut the long story short, I am now a crypto millionaire! ",
        author: "Alex K.",
        country: "Norway",
        image: "https://pagedone.io/asset/uploads/1696230027.png"
    },
    {
        rating: "3.9",
        content: "A common myth about investing is that a big fat bank account is required just to get started. In reality, the process of building a solid portfolio can begin with a few thousand—or even a few hundred—dollars.",
        author: "Jane Greg",
        country: "USA",
        image: "https://pagedone.io/asset/uploads/1696229969.png"
    },
    {
        rating: "4.7",
        content: "Thanks to PeakTrade, I feel more informed and confident about my investment decisions than ever before.",
        author: "Gonzalex Peter.",
        country: "Brazil",
        image: "https://pagedone.io/asset/uploads/1696229994.png"
    }
];

const TestimonialSection = () => {
    return (
        <section className="py-12 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <h2 className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal text-center">
                        What our clients are saying!
                    </h2>
                </div>

                <div className="relative">
                    <Carousel
                        className="w-full max-w-[1080px] mx-auto"
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-full md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6"
                                >
                                    <div className="max-w-[340px] w-full mx-auto group bg-white border border-gray-300 rounded-xl p-6 transition-all duration-500 h-full hover:border-indigo-600 hover:shadow-sm">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center mb-7 gap-2 text-amber-500">
                                                <Star className="w-5 h-5 fill-current" />
                                                <span className="text-base font-semibold text-indigo-600">
                                                    {testimonial.rating}
                                                </span>
                                            </div>
                                            <p className="text-base text-gray-600 leading-6 transition-all duration-500 pb-2 group-hover:text-gray-800 flex-grow">
                                                {testimonial.content}
                                            </p>
                                            <div className="flex items-center gap-5 border-t border-solid border-gray-200 pt-5">
                                                <Image
                                                    className="rounded-full h-10 w-10 object-cover"
                                                    src={testimonial.image}
                                                    alt={`${testimonial.author} avatar`}
                                                    width={2000}
                                                    height={2000}
                                                />
                                                <div className="block">
                                                    <h5 className="text-gray-900 font-medium transition-all duration-500 mb-1">
                                                        {testimonial.author}
                                                    </h5>
                                                    <span className="text-sm leading-4 text-gray-500">
                                                        {testimonial.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute hidden md:flex -left-12 top-1/2 transform -translate-y-1/2" />
                        <CarouselNext className="absolute hidden md:flex -right-12 top-1/2 transform -translate-y-1/2" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;