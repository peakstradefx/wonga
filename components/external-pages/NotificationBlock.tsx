"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface NotificationMessage {
    name: string;
    country: string;
    amount: string;
}

const NotificationBlock = () => {
    const [visible, setVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<NotificationMessage | null>(null);


    useEffect(() => {
        const messages: NotificationMessage[] = [
            { name: "Waltz", country: "USA", amount: "$3,890" },
            { name: "Janet", country: "USA", amount: "$2,300" },
            { name: "Markson", country: "Luxemburg", amount: "$23,200" },
            { name: "Sophie", country: "Canada", amount: "$5,450" },
            { name: "Chen Wei", country: "Singapore", amount: "$8,900" },
            { name: "Maria", country: "Spain", amount: "$4,275" },
            { name: "Alexander", country: "Germany", amount: "$12,600" },
            { name: "Yuki", country: "Japan", amount: "$7,830" },
            { name: "Isabella", country: "Italy", amount: "$6,450" },
            { name: "Lars", country: "Sweden", amount: "$9,125" },
            { name: "Olivia", country: "Australia", amount: "$15,700" },
            { name: "Hassan", country: "UAE", amount: "$18,900" },
            { name: "Emma", country: "France", amount: "$5,880" },
            { name: "Viktor", country: "Russia", amount: "$11,450" },
            { name: "Sarah", country: "UK", amount: "$7,600" }
        ];
        let messageIndex = 0;

        const showNotification = () => {
            setCurrentMessage(messages[messageIndex]);
            setVisible(true);

            setTimeout(() => {
                setVisible(false);
                // Update index for next message
                messageIndex = (messageIndex + 1) % messages.length;
            }, 3000);
        };

        // Show first notification after 3 seconds
        const initialTimeout = setTimeout(showNotification, 3000);

        // Set interval for subsequent notifications
        const interval = setInterval(showNotification, 10000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!currentMessage) return null;

    return (
        <div className="fixed inset-0 pointer-events-none flex items-center ml-10 z-50">
            <div
                className={`
                    transform transition-all duration-500 ease-in-out
                    ${visible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-10 opacity-0'
                    }
                    bg-gray-800
                    px-4 md:px-6 py-3
                    rounded-lg shadow-lg text-white
                    text-sm md:text-base
                    font-medium flex items-center gap-2 md:gap-4 max-w-[250px] md:max-w-[280px]
                `}
            >
                <Image src={"/assets/images/btc-logo.png"} alt='BTC logo' width={35} height={35} />
                <div>
                    <p className='text-xs md:text-sm font-bold'>Earnings</p>
                    <p className='text-xs md:text-sm leading-4'>
                        {currentMessage.name} from <span className='uppercase'>{currentMessage.country}</span> <br /> has just earned <span className='font-bold'>{currentMessage.amount}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotificationBlock;