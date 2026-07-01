"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import { ArrowUpRight, CirclePlus } from "lucide-react";
import Input from "@/components/input";
import ImageInput from "@/components/imageInput";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";
import ColorInput from "@/components/colorInput";


type ServiceRow = {
    id: number;
    headerText: string;
};

type ServiceRowDisplay = {
    id: number;
    headerText: React.ReactNode;
};

const columns: Column<ServiceRowDisplay>[] = [
    { header: "Header Text", accessor: "headerText" },
];

export default function Service() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    // Form states
    const [id, setId] = useState<number | null>(null);
    const [cardBackground, setCardBackground] = useState<string>("gray");
    const [headerText, setHeaderText] = useState<string>("This is header text");
    const [headerTextColor, setHeaderTextColor] = useState<string>("black");
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState<string>("green");
    const [buttonIconColor, setButtonIconColor] = useState<string>("green");
    const [buttonFontColor, setButtonFontColor] = useState<string>("black");
    const [serviceIllustration, setServiceIllustration] = useState<File | null>(null);
    const [existingServiceIllustration, setExistingServiceIllustration] = useState<string>("");



    // DataTable states
    const [rows, setRows] = useState<ServiceRowDisplay[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
    const [loading, setLoading] = useState<boolean>(false);
    const lastQuery = useRef<DataTableQuery>({ page: 1, limit: 10, search: "" });

    function resetForm() {
        setCardBackground("gray");
        setHeaderText("This is header text");
        setHeaderTextColor("black");
        setHeaderBackgroundColor("green");
        setButtonIconColor("green");
        setButtonFontColor("black");
        setServiceIllustration(null);
        setExistingServiceIllustration("");
        setId(null);
    }

    // GET ALL
    const fetchData = useCallback(async (query: DataTableQuery) => {
        lastQuery.current = query;
        setLoading(true);

        try {
            const params = new URLSearchParams({
                page: String(query.page),
                limit: String(query.limit),
                search: query.search,
            });

            const res = await fetch(`/api/service?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json: { data: ServiceRow[]; meta: PaginationMeta } = await res.json();

            const servicesData: ServiceRowDisplay[] = json.data.map((item) => ({
                id: item.id,
                headerText: <p className="line-clamp-2">{item.headerText}</p>,
            }));

            setRows(servicesData);
            setMeta(json.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // GET ONE (untuk edit)
    const fetchOneData = useCallback(async (id: number) => {
        setLoading(true);

        try {
            const res = await fetch(`/api/service/${id}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json = await res.json();

            setCardBackground(json.data.cardBackground);
            setHeaderText(json.data.headerText);
            setHeaderTextColor(json.data.headerTextColor);
            setHeaderBackgroundColor(json.data.headerBackgroundColor);
            setButtonIconColor(json.data.buttonIconColor);
            setButtonFontColor(json.data.buttonFontColor);
            setExistingServiceIllustration(json.data.serviceIllustration); // simpan URL lama
            setServiceIllustration(null);                    // reset file baru
            setId(json.data.id);

            setOpenEdit(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // CREATE
    const addData = useCallback(async () => {
        if (!serviceIllustration) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("cardBackground", cardBackground);
            formData.append("headerText", headerText);
            formData.append("headerTextColor", headerTextColor);
            formData.append("headerBackgroundColor", headerBackgroundColor);
            formData.append("buttonIconColor", buttonIconColor);
            formData.append("buttonFontColor", buttonFontColor);
            formData.append("serviceIllustration", serviceIllustration);

            const res = await fetch(`/api/service`, {
                method: "POST",
                body: formData,
            });

            const json = await res.json();
            console.log("Response:", json);

            resetForm();
            fetchData(lastQuery.current);
            setOpenAdd(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [cardBackground, headerText, headerTextColor, headerBackgroundColor, buttonIconColor, buttonFontColor, serviceIllustration, fetchData]);

    // UPDATE
    const editData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("cardBackground", cardBackground);
            formData.append("headerText", headerText);
            formData.append("headerTextColor", headerTextColor);
            formData.append("headerBackgroundColor", headerBackgroundColor);
            formData.append("buttonIconColor", buttonIconColor);
            formData.append("buttonFontColor", buttonFontColor);

            if (serviceIllustration) {
                formData.append("serviceIllustration", serviceIllustration);
            } else {
                formData.append("serviceIllustration", existingServiceIllustration);
            }

            const res = await fetch(`/api/service/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update data");

            resetForm();
            fetchData(lastQuery.current);
            setOpenEdit(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, cardBackground, headerText, headerTextColor, headerBackgroundColor, buttonIconColor, buttonFontColor, serviceIllustration, existingServiceIllustration, fetchData]);

    // DELETE
    const deleteData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/service/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete data");

            fetchData(lastQuery.current);
            setOpenDelete(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, fetchData]);

    return (
        <MainLayoutAdmin>
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-semibold">Service</h1>
                <Button
                    className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1"
                    onClick={() => setOpenAdd(true)}
                >
                    <CirclePlus size={16} />
                    Add Service
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                meta={meta}
                loading={loading}
                onQueryChange={fetchData}
                getRowId={(row) => row.id}
                onEdit={(row) => fetchOneData(row.id as number)}
                onDelete={(row) => {
                    setId(row.id as number);
                    setOpenDelete(true);
                }}
            />

            {/* Modal Add */}
            <Modal
                isOpen={openAdd}
                onClose={() => { setOpenAdd(false); resetForm(); }}
                title="Add Service"
                fullScreen
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenAdd(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={addData} isLoading={loading}>
                            Add Service
                        </Button>
                    </>
                }
            >

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Card</h4>
                            <ColorInput label="Card Background Color" onChange={setCardBackground} value={cardBackground} />
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Header</h4>
                            <Input label="Header Text" type="text" className="bg-white mb-4" value={headerText} onChange={setHeaderText} disabled={loading} />
                            <div className="grid grid-cols-2 gap-6">
                                <ColorInput label="Header Font Color" onChange={setHeaderTextColor} value={headerTextColor} />
                                <ColorInput label="Header Background Color" onChange={setHeaderBackgroundColor} value={headerBackgroundColor} />
                            </div>
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">&quot;Learn More&quot; Button</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <ColorInput label="Icon Color" onChange={setButtonIconColor} value={buttonIconColor} />
                                <ColorInput label="Font Color" onChange={setButtonFontColor} value={buttonFontColor} />
                            </div>
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Illustration</h4>
                            <ImageInput label="Illustration" onChange={setServiceIllustration} disabled={loading} />
                        </section>
                    </div>
                    <div className="sticky top-0 self-start">
                        <div className={`w-full border border-black bg-${cardBackground} rounded-[2.813rem] p-[3.125rem]`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col justify-between gap-[5.813rem]">
                                    <p className={`text-3xl bg-${headerBackgroundColor} text-${headerTextColor} rounded-[0.438rem] p-[0.438rem] font-medium`}>{headerText}</p>
                                    <button className={`flex items-center gap-4 text-xl text-${buttonFontColor}`}>
                                        <span className={`w-[2.563rem] h-[2.563rem] rounded-full bg-${buttonFontColor} text-white flex items-center justify-center`}>
                                            <ArrowUpRight className={`text-${buttonIconColor}`} />
                                        </span>
                                        Learn more
                                    </button>
                                </div>
                                {serviceIllustration ? (
                                    <img src={URL.createObjectURL(serviceIllustration)} className="my-auto w-[13.125rem] ml-auto" alt="" />
                                ) : (
                                    <img src="https://placehold.co/210x210" className="my-auto w-[13.125rem] ml-auto" alt="" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Edit */}
            <Modal
                isOpen={openEdit}
                onClose={() => { setOpenEdit(false); resetForm(); }}
                title="Edit Service"
                fullScreen
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenEdit(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={editData} isLoading={loading}>
                            Update Service
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Card</h4>
                            <ColorInput label="Card Background Color" onChange={setCardBackground} value={cardBackground} />
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Header</h4>
                            <Input label="Header Text" type="text" className="bg-white mb-4" value={headerText} onChange={setHeaderText} disabled={loading} />
                            <div className="grid grid-cols-2 gap-6">
                                <ColorInput label="Header Font Color" onChange={setHeaderTextColor} value={headerTextColor} />
                                <ColorInput label="Header Background Color" onChange={setHeaderBackgroundColor} value={headerBackgroundColor} />
                            </div>
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">&quot;Learn More&quot; Button</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <ColorInput label="Icon Color" onChange={setButtonIconColor} value={buttonIconColor} />
                                <ColorInput label="Font Color" onChange={setButtonFontColor} value={buttonFontColor} />
                            </div>
                        </section>
                        <hr className="mb-4" />
                        <section>
                            <h4 className="text-xl font-semibold mb-2">Illustration</h4>

                            {/* Tampilkan foto lama kalau belum diganti */}
                            {existingServiceIllustration && !serviceIllustration && (
                                <div className="mb-2">
                                    <p className="text-sm font-medium mb-1">Current Photo</p>
                                    <img
                                        src={existingServiceIllustration}
                                        alt="current"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                            <ImageInput label="Illustration" onChange={setServiceIllustration} disabled={loading} />
                        </section>
                    </div>
                    <div className="sticky top-0 self-start">
                        <div className={`w-full border border-black bg-${cardBackground} rounded-[2.813rem] p-[3.125rem]`}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col justify-between gap-[5.813rem]">
                                    <p className={`text-3xl bg-${headerBackgroundColor} text-${headerTextColor} rounded-[0.438rem] p-[0.438rem] font-medium`}>{headerText}</p>
                                    <button className={`flex items-center gap-4 text-xl text-${buttonFontColor}`}>
                                        <span className={`w-[2.563rem] h-[2.563rem] rounded-full bg-${buttonFontColor} text-white flex items-center justify-center`}>
                                            <ArrowUpRight className={`text-${buttonIconColor}`} />
                                        </span>
                                        Learn more
                                    </button>
                                </div>
                                {existingServiceIllustration && !serviceIllustration ? (
                                    <img src={existingServiceIllustration} className="my-auto w-[13.125rem] ml-auto" alt="" />
                                ) : serviceIllustration ? (
                                    <img src={URL.createObjectURL(serviceIllustration)} className="my-auto w-[13.125rem] ml-auto" alt="" />
                                ) : (
                                    <img src="https://placehold.co/210x210" className="my-auto w-[13.125rem] ml-auto" alt="" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Service"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                            Delete Service
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this team?</p>
            </Modal>
        </MainLayoutAdmin>
    );
}