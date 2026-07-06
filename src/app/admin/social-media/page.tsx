"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import { CirclePlus } from "lucide-react";
import Input from "@/components/input";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";
import Toast from "@/components/toast";

type SocialMediaRow = {
    id: number;
    link: string;
    platform: string;
};
type SocialMediaDisplay = {
    id: number;
    link: React.ReactNode;
    platform: React.ReactNode;
};

const columns: Column<SocialMediaDisplay>[] = [
    { header: "Link", accessor: "link" },
    { header: "Platform", accessor: "platform" },
];

export default function SocialMedia() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");
    const [platform, setPlatform] = useState<string>("");
    const [id, setId] = useState<number | null>(null);

    // DataTable states
    const [rows, setRows] = useState<SocialMediaDisplay[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
    const [loading, setLoading] = useState<boolean>(false);
    const lastQuery = useRef<DataTableQuery>({ page: 1, limit: 10, search: "" });

    // Toast states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("error");

    //get data
    const fetchData = useCallback(async (query: DataTableQuery) => {
        lastQuery.current = query;
        setLoading(true);

        try {
            const params = new URLSearchParams({
                page: String(query.page),
                limit: String(query.limit),
                search: query.search,
            });

            const res = await fetch(`/api/social-media?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json: { data: SocialMediaRow[]; meta: PaginationMeta } = await res.json();

            const socialMediaData: SocialMediaDisplay[] = json.data.map((item) => ({
                id: item.id,
                link: <p className="line-clamp-2">{item.link}</p>,
                platform: <p className="line-clamp-2">{item.platform}</p>,
            }));

            setRows(socialMediaData);
            setMeta(json.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    //get one data
    const fetchOneData = useCallback(async (id: number) => {
        setLoading(true);

        try {

            const res = await fetch(`/api/social-media/${id}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json = await res.json();

            setLink(json.data.link);
            setPlatform(json.data.platform);
            setId(json.data.id);

            setOpenEdit(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    //add data
    const addData = useCallback(async () => {
        setLoading(true);

        try {

            const res = await fetch(`/api/social-media`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    link: link,
                    platform: platform,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create data");
            }

            setLink("");
            setPlatform("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenAdd(false);

            setToastMessage("Social media added successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage("Failed to create data");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }, [link, platform, fetchData]);

    //edit data
    const editData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/social-media/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    link: link,
                    platform: platform,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update data");
            }

            setLink("");
            setPlatform("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenEdit(false);

            setToastMessage("Social media updated successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage("Failed to update data");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }, [id, link, platform, fetchData]);

    //delete data
    const deleteData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/social-media/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete data");
            }

            fetchData(lastQuery.current);

            setOpenDelete(false);

            setToastMessage("Social media deleted successfully");
            setToastType("success");
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setToastMessage("Failed to delete data");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }, [id, fetchData]);

    return (
        <>
            {
                showToast && (
                    <Toast
                        type={toastType}
                        message={toastMessage}
                        onClose={() => setShowToast(false)}
                    />
                )
            }
            <MainLayoutAdmin>
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-semibold">Social Media</h1>
                    <Button className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1" onClick={() => setOpenAdd(true)}>
                        <CirclePlus size={16} />
                        Add Social Media
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={rows}
                    meta={meta}
                    loading={loading}
                    onQueryChange={fetchData}
                    getRowId={(row) => row.id}
                    onEdit={(row) => fetchOneData(row.id)}
                    onDelete={(row) => {
                        setId(row.id);
                        setOpenDelete(true);
                    }}
                />

                {/* Modal Add */}
                <Modal
                    isOpen={openAdd}
                    onClose={() => setOpenAdd(false)}
                    title="Add Social Media"
                    footer={
                        <>
                            <Button className="border border-black px-5 py-2" onClick={() => setOpenAdd(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button className="bg-green border border-black px-5 py-2" onClick={addData} isLoading={loading}>
                                Add Social Media
                            </Button>
                        </>
                    }
                >
                    <Input label="Link" type="text" className="bg-white mb-4" value={link} onChange={setLink} disabled={loading} />
                    <Input label="Platform" type="text" className="bg-white mb-4" value={platform} onChange={setPlatform} disabled={loading} />
                </Modal>

                {/* Modal Edit */}
                <Modal
                    isOpen={openEdit}
                    onClose={() => setOpenEdit(false)}
                    title="Edit Social Media"
                    footer={
                        <>
                            <Button className="border border-black px-5 py-2" onClick={() => setOpenEdit(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button className="bg-green border border-black px-5 py-2" onClick={editData} isLoading={loading}>
                                Update Social Media
                            </Button>
                        </>
                    }
                >
                    <Input label="Link" type="text" className="bg-white mb-4" value={link} onChange={setLink} disabled={loading} />
                    <Input label="Platform" type="text" className="bg-white mb-4" value={platform} onChange={setPlatform} disabled={loading} />
                </Modal>

                {/* Modal Delete */}
                <Modal
                    isOpen={openDelete}
                    onClose={() => setOpenDelete(false)}
                    title="Delete Social Media"
                    footer={
                        <>
                            <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                                Delete Social Media
                            </Button>
                        </>
                    }
                >
                    <p>Are you sure you want to delete this social media link?</p>
                </Modal>
            </MainLayoutAdmin>
        </>
    )
}