import { TestimonialType } from "@/types/landing";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    dots: true,
    centerPadding: "200px",
    slidesToShow: 1,
    speed: 500,
    dotsClass: "slick-dots slick-thumb",
    customPaging: function () {
        return (
            <a>
                <div className="w-[14px] h-[14px] bg-gray rounded-full dot"></div>
            </a>
        );
    },
};
const settingsMobile = {
    className: "center",
    centerMode: true,
    infinite: true,
    dots: true,
    centerPadding: "0",
    slidesToShow: 1,
    speed: 500,
    dotsClass: "slick-dots slick-thumb",
    customPaging: function () {
        return (
            <a>
                <div className="w-[14px] h-[14px] bg-gray rounded-full dot"></div>
            </a>
        );
    },
};

export default function Testimonial({
    data = [],
}: {
    data: TestimonialType[];
}) {
    return (
        <section id="testimonial" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <div className="grid grid-cols-3 grid-rows-1">
                <div className="col-span-3 lg:col-span-2">
                    <div className="flex items-center flex-col md:flex-row gap-8 lg:gap-10 mb-8 lg:mb-20">
                        <h1 className="text-4xl md:text-[40px] text-center bg-green text-black rounded-[0.438rem] p-[0.438rem] font-medium shrink-0">Testimonials </h1>
                        <p className="text-lg text-center md:text-left">Hear from Our Satisfied Clients: Read Our Testimonials to Learn More about Our Digital Marketing Services</p>
                    </div>
                </div>
            </div>

            <div className="bg-black py-[4.375rem] rounded-[2.813rem] hidden lg:block">
                <div className="slider-container">
                    <Slider {...settings}>
                        {
                            data.map((item) => (
                                <div key={item.id} className="p-6">
                                    <div className="rounded-[2.813rem] py-12 px-15 text-white border border-green font-lg mb-5">
                                        &quot;{item.testimony}&quot;
                                    </div>
                                    <p className="text-lg text-green">{item.name}</p>
                                    <p className="text-lg text-white">{item.position} {item.company ? `at ${item.company}` : ""}</p>
                                </div>
                            ))
                        }
                    </Slider>
                </div>
            </div>

            <div className="bg-black pb-15 lg:py-[4.375rem] rounded-[2.813rem] block lg:hidden">
                <div className="slider-container">
                    <Slider {...settingsMobile}>
                        {
                            data.map((item) => (
                                <div key={item.id} className="p-6">
                                    <div className="rounded-[2.813rem] py-12 px-15 text-white border border-green font-lg mb-5">
                                        &quot;{item.testimony}&quot;
                                    </div>
                                    <p className="text-lg text-green">{item.name}</p>
                                    <p className="text-lg text-white">{item.position} {item.company ? `at ${item.company}` : ""}</p>
                                </div>
                            ))
                        }
                    </Slider>
                </div>
            </div>
        </section>
    );
}