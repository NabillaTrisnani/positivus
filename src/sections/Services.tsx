import { ServiceType } from "@/types/landing";
import { ArrowUpRight } from "lucide-react";

export default function Services({
    data = [],
}: {
    data: ServiceType[];
}) {
    return (
        <section id="services" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-[40px] bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium">Services</h1>
                        <p className="text-lg">At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10">
                {
                    data.map((item) => (
                        <div key={item.id} className={`w-full border border-black bg-${item.cardBackground} rounded-[2.813rem] p-10 lg:p-[3.125rem] shadow-[0_5px_0_0_#191a23]`}>
                            <div className="grid xl:grid-cols-2 gap-4">
                                <div className="flex flex-col justify-between gap-6 xl:gap-[5.813rem]">
                                    <p className={`text-3xl bg-${item.headerBackgroundColor} text-${item.headerTextColor} rounded-[0.438rem] p-[0.438rem] font-medium`}>{item.headerText}</p>
                                    <div className="flex items-end gap-4">
                                        <button className={`flex items-center gap-4 text-xl text-${item.buttonFontColor}`}>
                                            <span className={`w-[2.563rem] h-[2.563rem] rounded-full bg-${item.buttonFontColor} text-white flex items-center justify-center`}>
                                                <ArrowUpRight className={`text-${item.buttonIconColor}`} />
                                            </span>
                                            <span className="hidden xl:inline">Learn more</span>
                                        </button>
                                        <img src={item.serviceIllustration} className="my-auto w-[13.125rem] ml-auto block xl:hidden" alt="" />
                                    </div>
                                </div>
                                <img src={item.serviceIllustration} className="my-auto w-[13.125rem] ml-auto hidden xl:block" alt="" />
                            </div>
                        </div>
                    ))
                }
            </div>

        </section>
    );
}