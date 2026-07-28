import Button from "@/components/button";
import Input from "@/components/input";
import { SocialMediaType } from "@/types/landing";

export default function Footer({
    data = [],
    setEmail,
    email,
    loading,
    sendSubscription,
}: {
    data: SocialMediaType[];
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    loading: boolean;
    sendSubscription: () => void;
}) {
    return (
        <section id="footer" className="md:px-16 lg:px-25 pt-6 md:pt-15">
            <div className="bg-black pt-[3.438rem] pb-[3.125rem] px-6 md:px-15 md:rounded-t-[2.813rem]">
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-4">
                    <img src="/logo-white.svg" alt="logo" className="h-5 md:h-[29px]" />

                    <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-10">
                        <a href="#home" className="text-white underline text-base lg:text-lg">About us</a>
                        <a href="#services" className="text-white underline text-base lg:text-lg">Services</a>
                        <a href="#use-cases" className="text-white underline text-base lg:text-lg">Use Cases</a>
                        <a href="#pricing" className="text-white underline text-base lg:text-lg">Pricing</a>
                        <a href="#blog" className="text-white underline text-base lg:text-lg">Blog</a>
                    </div>

                    <div className="hidden lg:flex items-center gap-x-5">
                        {
                            data.map((item) => (
                                <a href={item.link} key={item.id} target="_blank" rel="noreferrer" className="text-white hover:underline text-base lg:text-lg">
                                    {
                                        <img src={item.platform.toLowerCase() === "twitter" ? "/twitter-white-icon.svg" : item.platform.toLowerCase() === "linkedin" ? "/linkedin-white-icon.svg" : "/facebook-white-icon.svg"} alt={item.platform} className="h-5 md:h-[29px]" />
                                    }
                                </a>
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-[154px] mt-8 lg:mt-17">
                    <div>
                        <h4 className="text-base md:text-xl bg-green text-black rounded-[0.438rem] px-[0.438rem] font-medium w-fit mx-auto lg:mx-0 mb-7">Contact us:</h4>
                        <p className="text-white text-base lg:text-lg text-center lg:text-left mb-3 md:mb-5">Email: info@positivus.com</p>
                        <p className="text-white text-base lg:text-lg text-center lg:text-left mb-3 md:mb-5">Phone: 555-567-8901</p>
                        <p className="text-white text-base lg:text-lg text-center lg:text-left">Address: 1234 Main St
                            Moonstone City, Stardust State 12345</p>
                    </div>
                    <div className="bg-[#292A32] rounded-[0.875rem] px-10 py-14 w-full lg:w-fit h-fit flex-shrink-0">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div>
                                <Input type="text" className="bg-transparent border-white text-white placeholder:text-white py-3" placeholder="Email" value={email} onChange={setEmail} disabled={loading} />
                            </div>
                            <div>
                                <Button className="text-black bg-green hover:text-black py-3 px-6 rounded-[14px] border border-black text-center w-full" onClick={sendSubscription} isLoading={loading}>Subscribe to news</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex lg:hidden items-center justify-center gap-x-5 mt-10">
                    {
                        data.map((item) => (
                            <a href={item.link} key={item.id} target="_blank" rel="noreferrer" className="text-white hover:underline text-base lg:text-lg">
                                {
                                    <img src={item.platform.toLowerCase() === "twitter" ? "/twitter-white-icon.svg" : item.platform.toLowerCase() === "linkedin" ? "/linkedin-white-icon.svg" : "/facebook-white-icon.svg"} alt={item.platform} className="h-8 w-8 lg:h-[29px] lg:w-[29px]" />
                                }
                            </a>
                        ))
                    }
                </div>

                <hr className="border-white my-9 md:my-13" />

                <div className="flex flex-col lg:flex-row gap-4 items-center lg:gap-10">
                    <p className="text-white text-base lg:text-lg">© {new Date().getFullYear()} Positivus. All rights reserved.</p>
                    <p className="text-white underline text-base lg:text-lg">Privacy Policy</p>
                </div>

            </div>
        </section>
    );
}