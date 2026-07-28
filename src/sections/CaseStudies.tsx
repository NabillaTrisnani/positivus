import { CaseStudyType } from "@/types/landing";
import { ArrowUpRight } from "lucide-react";

export default function CaseStudies({
    data = [],
}: {
    data: CaseStudyType[];
}) {
    return (
        <section id="use-cases" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-4xl md:text-[40px] text-center bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium shrink-0">Case Studies</h1>
                        <p className="text-lg text-center md:text-left">Explore Real-Life Examples of Our Proven Digital Marketing Success through Our Case Studies</p>
                    </div>
                </div>
            </div>

            <div className="bg-black px-10 lg:px-15 lg:py-[4.375rem] rounded-[2.813rem] hidden lg:block">
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-y-10">
                    {data.map((item, index) => {
                        const isLastInRow = (index + 1) % 3 === 0;
                        const isFirstInRow = index % 3 === 0;
                        const isLastItem = index === data.length - 1;
                        const showBorder = !isLastInRow && !isLastItem;

                        return (
                            <div
                                key={item.id}
                                className={`flex flex-col gap-[1.625rem] px-8 ${isFirstInRow ? 'pl-0' : ''} ${showBorder ? 'sm:border-r sm:border-white' : ''}`}
                            >
                                <p className="text-base lg:text-lg text-white">{item.text}</p>
                                <button className="flex items-center gap-4 text-xl text-green">
                                    <ArrowUpRight className="text-green" />
                                    <span>Learn more</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4">
                {data.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="bg-black p-10 rounded-[2.813rem] w-[90%] flex-shrink-0 snap-start"
                        >
                            <div className="flex flex-col gap-[1.625rem]">
                                <p className="text-base lg:text-lg text-white">{item.text}</p>
                                <button className="flex items-center gap-4 text-xl text-green">
                                    <ArrowUpRight className="text-green" />
                                    <span>Learn more</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}