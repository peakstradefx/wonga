import { logo, logoWhite } from "@/public/assets/images";
import Image from "next/image";
import Link from "next/link";

function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden bg-[url(/assets/images/5416978_2647304.jpg)] bg-cover h-full flex-col bg-mute p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-" />
                    <Link href={"/"} className="relative z-20 flex items-center text-lg font-medium">
                        <Image src={logoWhite} width={150} height={82} alt="PeakTrade fx logo" />
                    </Link>
                </div>
                <div className="px-4 pt-10 md:pt-8 lg:p-8">
                    <div className="flex justify-center pb-8">
                        <Image src={logo} width={250} height={82} className="w-[250px] h-auto" alt="PeakTrade fx logo" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout
