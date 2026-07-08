"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>
            <nav className="py-6 md:py-15 px-4 md:px-16 lg:px-25 flex justify-between items-center gap-x-4">
                <img src="/logo-black.svg" alt="logo" className="h-5 md:h-[36px]" />
                <Menu className="xl:hidden" onClick={toggleMenu} />
                <div className="hidden xl:flex justify-between items-center">
                    <div className="flex items-center gap-x-10">
                        <a href="#home" className="text-black hover:underline text-base lg:text-xl">About us</a>
                        <a href="#services" className="text-black hover:underline text-base lg:text-xl">Services</a>
                        <a href="#use-cases" className="text-black hover:underline text-base lg:text-xl">Use Cases</a>
                        <a href="#pricing" className="text-black hover:underline text-base lg:text-xl">Pricing</a>
                        <a href="#blog" className="text-black hover:underline text-base lg:text-xl">Blog</a>
                        <a href="#contact" className="text-black text-base lg:text-xl text-center rounded-[14px] py-5 px-9 border border-black hover:cursor-pointer hover:bg-green">Request a quote</a>
                    </div>
                </div>
            </nav>

            {isOpen && (
                <div className="xl:hidden flex flex-col gap-y-4 px-4 md:px-16 lg:px-25 pb-6">
                    <a href="#home" className="text-black hover:underline text-base lg:text-xl">About us</a>
                    <a href="#services" className="text-black hover:underline text-base lg:text-xl">Services</a>
                    <a href="#use-cases" className="text-black hover:underline text-base lg:text-xl">Use Cases</a>
                    <a href="#pricing" className="text-black hover:underline text-base lg:text-xl">Pricing</a>
                    <a href="#blog" className="text-black hover:underline text-base lg:text-xl">Blog</a>
                    <a href="#contact" className="text-black text-base text-center rounded-[14px] py-3 px-6 w-fit border border-black hover:cursor-pointer hover:bg-green">Request a quote</a>
                </div>
            )}
        </>
    );
}
