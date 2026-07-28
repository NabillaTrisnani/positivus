import Button from "@/components/button";
import Input from "@/components/input";
import Radio from "@/components/radio";
import Textarea from "@/components/textarea";

export default function Contact({
    setName,
    setEmail,
    setMessage,
    setType,
    name,
    email,
    message,
    type,
    loading,
    sendContact,
}: {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setType: React.Dispatch<React.SetStateAction<string>>;
    name: string;
    email: string;
    message: string;
    type: string;
    loading: boolean;
    sendContact: () => void;
}) {

    const typesOptions = [
        { label: "Say Hi", value: "say hi" },
        { label: "Get a Quote", value: "quote" },
    ]

    return (
        <section id="working-process" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-4xl md:text-[40px] text-center bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium shrink-0">Contact Us </h1>
                        <p className="text-lg text-center md:text-left">Connect with Us: Let&apos;s Discuss Your Digital Marketing Needs</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray p-10 lg:p-15 rounded-[2.813rem] relative lg:bg-[url('/contact-illustration.svg')] bg-right bg-no-repeat">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-[1.625rem]">
                        <div className="mb-4">
                            <Radio options={typesOptions} value={type} onChange={setType} disabled={loading} />
                        </div>
                        <Input label="Name" type="text" className="bg-white mb-4" value={name} onChange={setName} disabled={loading} />
                        <Input label="Email" type="text" className="bg-white mb-4" value={email} onChange={setEmail} disabled={loading} />
                        <Textarea label="Message" className="bg-white" value={message} onChange={setMessage} disabled={loading} />
                        <Button className="bg-black text-white hover:bg-green hover:text-black py-3 px-6 rounded-[14px] border border-black text-center w-full" onClick={sendContact} isLoading={loading} loadingColor="#fff">Send Message</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}