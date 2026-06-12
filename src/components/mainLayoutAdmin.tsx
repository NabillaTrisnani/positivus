import Sidebar from "./sidebar";

export default function MainLayoutAdmin({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="flex bg-gray min-h-screen">
            <Sidebar />
            <main className="flex-1 px-6 py-7">
                {children}
            </main>
        </div>
    )
}