"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";

type ContantRow = {
    id: number;
    name: string;
    email: string;
    message: string;
    type: string;
};
type ContactDisplay = {
    id: number;
    name: React.ReactNode;
    email: React.ReactNode;
    message: React.ReactNode;
    type: React.ReactNode;
};

const columns: Column<ContactDisplay>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Message", accessor: "message" },
    { header: "Type", accessor: "type" },
];

export default function Contact() {
    // Modal states
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [id, setId] = useState<number | null>(null);

    // DataTable states
    const [rows, setRows] = useState<ContactDisplay[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
    const [loading, setLoading] = useState<boolean>(false);
    const lastQuery = useRef<DataTableQuery>({ page: 1, limit: 10, search: "" });

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

            const res = await fetch(`/api/contact?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json: { data: ContantRow[]; meta: PaginationMeta } = await res.json();

            const contactData: ContactDisplay[] = json.data.map((item) => ({
                id: item.id,
                name: <p className="line-clamp-2">{item.name}</p>,
                email: <p className="line-clamp-2">{item.email}</p>,
                message: <p className="line-clamp-2">{item.message}</p>,
                type: <p className="line-clamp-2">{item.type}</p>,
            }));

            setRows(contactData);
            setMeta(json.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    //delete data
    const deleteData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/contact/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete data");
            }

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
                <h1 className="text-2xl font-semibold">Contact</h1>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                meta={meta}
                loading={loading}
                onQueryChange={fetchData}
                getRowId={(row) => row.id}
                onDelete={(row) => {
                    setId(row.id);
                    setOpenDelete(true);
                }}
            />

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Message"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                            Delete Message
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this message?</p>
            </Modal>
        </MainLayoutAdmin>
    )
}