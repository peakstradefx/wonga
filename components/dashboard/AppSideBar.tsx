import { BookUp, Home, BookDown, Package2, BookCheck, UserRound, LogOut, History, UserCog, SquareKanban } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { logo } from "@/public/assets/images"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const menuItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Deposits",
        url: "/dashboard/deposit",
        icon: BookDown,
    },
    {
        title: "Withdrawal",
        url: "/dashboard/withdrawal",
        icon: BookUp,
    },
    {
        title: "Transactions history",
        url: "/dashboard/transactions-history",
        icon: History,
    },
    {
        title: "My packages",
        url: "/dashboard/packages",
        icon: Package2,
    },
    {
        title: "Investment plan",
        url: "/dashboard/investment-plan",
        icon: SquareKanban,
    },
    {
        title: "KYC",
        url: "/dashboard/kyc",
        icon: BookCheck,
    },
    {
        title: "Account",
        url: "/dashboard/account",
        icon: UserRound,
    },
    {
        title: "Support",
        url: "/dashboard/support",
        icon: UserCog,
    },
]

export function AppSidebar() {
    const pathName = usePathname()
    const isActive = (url: string) => pathName === url;

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-base font-bold">
                        <Image src={logo} width={200} height={80} alt="Trade Peak FX" />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-8 relative">
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={`inline-flex items-center gap-2 w-full ${isActive(item.url) ? 'text-primary bg-neutral-200' : ''
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <button
                                className="px-4 py-2 text-red-600 font-semibold inline-flex items-center gap-2 rounded-sm hover:bg-sidebar-accent w-full mt-4"
                                onClick={() => signOut()}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
