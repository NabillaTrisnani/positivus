"use client";

import { BookOpenText, Circle, Database, Inbox, Minus, PanelLeft, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
    {
        name: "Master Data",
        icon: <Database size="1.125rem" />,
        children: [
            { name: "Partner", href: "/admin/partner" },
            { name: "Service", href: "/admin/service" },
            { name: "Team", href: "/admin/team" },
            { name: "Testimonial", href: "/admin/testimonial" },
        ],
    },
    {
        name: "Content",
        icon: <BookOpenText size="1.125rem" />,
        children: [
            { name: "Case Study", href: "/admin/case-study" },
            { name: "Working Process", href: "/admin/working-process" },
        ],
    },
    {
        name: "Communication",
        icon: <Inbox size="1.125rem" />,
        children: [
            { name: "Contact", href: "/admin/contact" },
            { name: "Social Media", href: "/admin/social-media" },
            { name: "Subscription", href: "/admin/subscription" },
        ],
    },
];

export default function Sidebar() {

    const pathname = usePathname();
    const [override, setOverride] = useState<{ path: string; menu: string } | null>(null);
    const [sidebar, setSidebar] = useState<boolean>(true);

    const derivedActive = navigation.find((item) =>
        item.children.some((child) => child.href === pathname)
    )?.name ?? "";

    const activeMenu = override && override.path === pathname ? override.menu : derivedActive;

    const openMenu = (name: string) => {
        setOverride({ path: pathname, menu: activeMenu === name ? "" : name });
    }

    const openSidebar = () => {
        setSidebar(!sidebar);
    }

    return (
        <div
            className={`group/sidebar ${sidebar
                ? "w-[250px]"
                : "w-[60px] hover:w-[250px]"
                } bg-black py-8 flex flex-col gap-y-10 h-screen overflow-hidden transition-all duration-300 ease-in-out`}
        >
            <div className="px-5 flex align-center">
                {
                    sidebar ? (
                        <img src="/logo-white.svg" alt="Logo" className="mr-auto h-6" />
                    ) : (
                        <img src="/logo-white.svg" alt="Logo" className="mr-auto h-6 w-0 group-hover/sidebar:w-auto" />
                    )
                }

                <PanelLeft onClick={openSidebar} className="text-white" />
            </div>

            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                {
                    navigation.map((item) => {
                        return (
                            <div key={item.name}>
                                <div onClick={() => openMenu(item.name)} className="px-5 py-4 text-base font-medium text-white hover:text-black hover:bg-green flex items-center gap-x-4 hover:cursor-pointer">
                                    {item.icon}
                                    {sidebar ? item.name : (
                                        <span className="hidden group-hover/sidebar:inline">{item.name}</span>
                                    )}

                                    {
                                        sidebar ? (
                                            activeMenu === item.name ? <Minus className="size-4 ml-auto" /> : <Plus className="size-4 ml-auto" />
                                        ) : (
                                            activeMenu === item.name ? <Minus className="size-4 ml-auto hidden group-hover/sidebar:inline" /> : <Plus className="size-4 ml-auto hidden group-hover/sidebar:inline" />
                                        )
                                    }
                                </div>

                                <div className={`flex flex-col ${activeMenu === item.name ? "block" : "hidden"}`}>
                                    {
                                        item.children.map((child) => {
                                            return (
                                                <a key={child.name} href={child.href} className="px-5 py-4 text-base font-medium text-white hover:text-black hover:bg-green flex items-center gap-x-4 hover:cursor-pointer">
                                                    <Circle size="1.125rem" />
                                                    {sidebar ? child.name : (
                                                        <span className="hidden group-hover/sidebar:inline">{child.name}</span>
                                                    )}
                                                </a>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}