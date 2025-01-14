"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const trade = [
    {
        title: "Forex",
        href: "/trade/forex",
    },
    {
        title: "Commodity futures",
        href: "/trade/commodities-futures",
    },
    {
        title: "Shares Indices",
        href: "/trade/shares-indices",
    },
    {
        title: "Energy Carriers",
        href: "/energy-carriers",
    },
]

const educationalAndAnalytics = [
    {
        title: "Webinars",
        href: "/education/webinars",
    },
    {
        title: "E-books",
        href: "/education/ebooks",
    },
    {
        title: "Traders' advice",
        href: "/education/traders-advice",
    },
]

export function NavMenu({ onMobileLinkClick }: { onMobileLinkClick?: () => void }) {
    const [openSections, setOpenSections] = React.useState<string | null>(null)

    const toggleSection = (section: string) => {
        setOpenSections(openSections === section ? null : section)
    }

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Trade</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    {trade.map((item) => (
                                        <ListItem
                                            key={item.title}
                                            title={item.title}
                                            href={item.href}
                                            className="text-primary text-lg bg-none hover:bg-none"
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Education and Analytics</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {educationalAndAnalytics.map((item) => (
                                        <ListItem
                                            key={item.title}
                                            title={item.title}
                                            href={item.href}
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/about" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    About
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/contact-us" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Contact Us
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden w-full">
                <div className="flex flex-col">
                    {/* Trade Section */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('trade')}
                            className="flex w-full items-center justify-between py-4 text-left text-lg font-medium"
                        >
                            Trade
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    openSections === 'trade' ? "rotate-180" : ""
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "transition-[max-height] duration-300 ease-in-out",
                                openSections === 'trade' ? "max-h-64" : "max-h-0 overflow-hidden"
                            )}
                        >
                            <ul className="space-y-2 pb-4">
                                {trade.map((item) => (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className="block py-2 pl-4 text-base text-gray-600 hover:text-primary"
                                            onClick={onMobileLinkClick}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('education')}
                            className="flex w-full items-center justify-between py-4 text-left text-lg font-medium"
                        >
                            Education and Analytics
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    openSections === 'education' ? "rotate-180" : ""
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "transition-[max-height] duration-300 ease-in-out",
                                openSections === 'education' ? "max-h-64" : "max-h-0 overflow-hidden"
                            )}
                        >
                            <ul className="space-y-2 pb-4">
                                {educationalAndAnalytics.map((item) => (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className="block py-2 pl-4 text-base text-gray-600 hover:text-primary"
                                            onClick={onMobileLinkClick}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Static Links */}
                    <Link
                        href="/about"
                        className="block py-4 text-lg font-medium hover:text-primary border-b border-gray-200"
                        onClick={onMobileLinkClick}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact-us"
                        className="block py-4 text-lg font-medium hover:text-primary border-b border-gray-200"
                        onClick={onMobileLinkClick}
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-text text-lg space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:underline focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-base font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"