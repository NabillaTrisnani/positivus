import { TeamType } from "@/types/landing";
import Link from "next/link";

export default function Team({
    data = [],
}: {
    data: TeamType[];
}) {

    return (
        <section id="working-process" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-4xl md:text-[40px] text-center bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium shrink-0">Team </h1>
                        <p className="text-lg text-center md:text-left">Meet the skilled and experienced team behind our successful digital marketing strategies</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 md:gap-10">
                {
                    data.map((item) => (
                        <div key={item.id} className="border border-black rounded-[2.813rem] p-10 lg:px-9 lg:py-10 shadow-[0_5px_0_0_#191a23]">
                            <div className="flex gap-5">
                                <img src={item.photo} className="shrink-0 w-[6.603rem] h-[6.603rem]" alt="profile picture" />
                                <div className="flex flex-col gap-2 justify-between">
                                    <Link href={item.linkedin} target="_blank">
                                        <img src="/linkedin-icon.svg" className="ml-auto" alt="linkedin icon" />
                                    </Link>
                                    <div>
                                        <h4 className="text-xl font-medium">{item.name}</h4>
                                        <p className="text-lg">{item.position}</p>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-6" />
                            <p className="text-lg">{item.description}</p>
                        </div>
                    ))
                }
            </div>
            <button className="block bg-black text-white hover:bg-green hover:text-black py-3 px-19 mt-10 ml-auto rounded-[14px] border border-black text-center w-fit">See all team</button>
        </section>
    );
}