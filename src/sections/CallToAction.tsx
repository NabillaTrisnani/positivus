export default function CallToAction() {
    return (
        <section id="cta" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="bg-gray p-10 lg:p-15 rounded-[2.813rem] relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-[1.625rem]">
                        <h3 className="text-3xl font-medium">Let’s make things happen</h3>
                        <p className="text-lg">Contact us today to learn more about how our digital marketing services can help your business grow and succeed online.</p>
                        <a href="#contact" className="bg-black text-white hover:bg-green hover:text-black py-3 px-6 rounded-[14px] border border-black text-center w-fit">Get your free proposal</a>
                    </div>
                    <div className="hidden lg:block">
                        <img src="/cta.svg" className="absolute heigt-[110%] top-[-5%] right-15" alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}