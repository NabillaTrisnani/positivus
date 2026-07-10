import InfiniteScroll from "@/components/infiniteScroll";
import { PartnerType } from "@/types/landing";

export default function Partner({
    data = [],
}: {
    data: PartnerType[];
}) {
    return (
        <section id="partner" className="px-4 md:px-16 lg:px-25 py-6 md:py-15">
            <InfiniteScroll
                speed="normal"
                items={data.map((p) => (
                    <img key={p.id} src={p.logo} className="h-12" alt={p.name} />
                ))}
            />
            <div className="lg:hidden mt-4">
                <InfiniteScroll
                    speed="normal"
                    scrollDirection="right"
                    items={data.map((p) => (
                        <img key={p.id} src={p.logo} className="h-12" alt={p.name} />
                    ))}
                />
            </div>
        </section>
    );
}