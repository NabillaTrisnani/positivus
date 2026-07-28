import { WorkingProcessType } from "@/types/landing";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function WorkingProcess({
    data = [],
}: {
    data: WorkingProcessType[];
}) {

    const [openedId, setOpenedId] = useState<number | null>(null);

    return (
        <section id="working-process" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-4xl md:text-[40px] text-center bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium shrink-0">Our Working Process </h1>
                        <p className="text-lg text-center md:text-left">Step-by-Step Guide to Achieving Your Business Goals</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-7">
                {
                    data.map((item, index) => (
                        <div key={item.id}>
                            <div className={`${openedId !== item.id ? "block" : "hidden"} rounded-[2.813rem] p-5 lg:py-[2.563rem] lg:px-15 bg-gray border border-black shadow-[0_5px_0_0_#191a23]`}>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-3xl lg:text-6xl font-medium">{index < 10 ? "0" : ""}{index + 1}</h1>
                                        <h3 className="text-xl lg:text-3xl font-medium">{item.title}</h3>
                                    </div>
                                    <button className="rounded-full w-[3rem] lg:w-[3.625rem] h-[3rem] lg:h-[3.625rem] bg-gray border border-black flex items-center justify-center shrink-0" onClick={() => setOpenedId(item.id)}>
                                        <Plus size={30} />
                                    </button>
                                </div>
                            </div>
                            <div className={`${openedId === item.id ? "block" : "hidden"} rounded-[2.813rem] p-5 lg:py-[2.563rem] lg:px-15 bg-green border border-black shadow-[0_5px_0_0_#191a23]`}>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-3xl lg:text-6xl font-medium">{index < 10 ? "0" : ""}{index + 1}</h1>
                                        <h3 className="text-xl lg:text-3xl font-medium">{item.title}</h3>
                                    </div>
                                    <button className="rounded-full w-[3rem] lg:w-[3.625rem] h-[3rem] lg:h-[3.625rem] bg-gray border border-black flex items-center justify-center shrink-0" onClick={() => setOpenedId(null)}>
                                        <Minus size={30} />
                                    </button>
                                </div>
                                <hr className="my-6" />
                                <p className="text-base lg:text-lg">{item.description}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}