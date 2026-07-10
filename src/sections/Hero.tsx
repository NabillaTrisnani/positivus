export default function Hero() {
    return (
        <section id="home" className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-10 px-4 md:px-16 lg:px-25">
            <div className="flex flex-col justify-center gap-y-4 md:gap-y-6 lg:gap-y-8">
                <h1 className="text-3xl lg:text-6xl font-semibold lg:font-medium">Navigating the digital landscape for success</h1>
                <img src="/hero.svg" alt="Hero image" className="w-full object-cover block md:hidden" />
                <p className="text-sm lg:text-xl">Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.</p>
                <a href="#contact" className="bg-black text-white hover:bg-green hover:text-black py-3 px-6 rounded-[14px] border border-black text-center w-fit">Book a consultation</a>
            </div>
            <div className="hidden md:block">
                <img src="/hero.svg" alt="Hero image" className="w-full object-cover" />
            </div>
        </section>
    );
}
