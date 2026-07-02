"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import { CirclePlus } from "lucide-react";
import Input from "@/components/input";
import ImageInput from "@/components/imageInput";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";

type PartnerRow = {
    id: number;
    logo: string;
    name: string;
};

type PartnerRowDisplay = {
    id: number;
    logo: React.ReactNode;
    name: React.ReactNode;
};

const columns: Column<PartnerRowDisplay>[] = [
    { header: "Logo", accessor: "logo" },
    { header: "Name", accessor: "name" },
];

export default function Partner() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    // Form states
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string>("");
    const [logo, setLogo] = useState<File | null>(null);
    const [existingLogo, setExistingLogo] = useState<string>("");



    // DataTable states
    const [rows, setRows] = useState<PartnerRowDisplay[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
    const [loading, setLoading] = useState<boolean>(false);
    const lastQuery = useRef<DataTableQuery>({ page: 1, limit: 10, search: "" });

    function resetForm() {
        setName("");
        setLogo(null);
        setExistingLogo("");
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

            const res = await fetch(`/api/partner?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json: { data: PartnerRow[]; meta: PaginationMeta } = await res.json();

            const servicesData: PartnerRowDisplay[] = json.data.map((item) => ({
                id: item.id,
                logo: <img src={item.logo} alt={item.name} className="h-6" />,
                name: <p className="line-clamp-2">{item.name}</p>,
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
            const res = await fetch(`/api/partner/${id}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json = await res.json();

            setName(json.data.name);
            setExistingLogo(json.data.logo); // simpan URL lama
            setLogo(null);                    // reset file baru
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
        if (!logo) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("logo", logo);

            const res = await fetch(`/api/partner`, {
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
    }, [name, logo, fetchData]);

    // UPDATE
    const editData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);

            if (logo) {
                formData.append("logo", logo);
            } else {
                formData.append("logo", existingLogo);
            }

            const res = await fetch(`/api/partner/${id}`, {
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
    }, [id, name, logo, existingLogo, fetchData]);

    // DELETE
    const deleteData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/partner/${id}`, { method: "DELETE" });
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
                <h1 className="text-2xl font-semibold">Partner</h1>
                <Button
                    className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1"
                    onClick={() => setOpenAdd(true)}
                >
                    <CirclePlus size={16} />
                    Add Partner
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
                title="Add Partner"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenAdd(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={addData} isLoading={loading}>
                            Add Partner
                        </Button>
                    </>
                }
            >
                <Input label="Partner Name" type="text" className="bg-white mb-4" value={name} onChange={setName} disabled={loading} />
                <ImageInput label="Illustration" onChange={setLogo} disabled={loading} />
            </Modal>

            {/* Modal Edit */}
            <Modal
                isOpen={openEdit}
                onClose={() => { setOpenEdit(false); resetForm(); }}
                title="Edit Partner"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenEdit(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={editData} isLoading={loading}>
                            Update Partner
                        </Button>
                    </>
                }
            >
                <Input label="Partner Name" type="text" className="bg-white mb-4" value={name} onChange={setName} disabled={loading} />
                {/* Tampilkan foto lama kalau belum diganti */}
                {existingLogo && !logo && (
                    <div className="mb-2">
                        <p className="text-sm font-medium mb-1">Current Photo</p>
                        <img
                            src={existingLogo}
                            alt="current"
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                    </div>
                )}
                <ImageInput label="Illustration" onChange={setLogo} disabled={loading} />
            </Modal>

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Partner"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                            Delete Partner
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>
        </MainLayoutAdmin>
    );
}