"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import { CirclePlus } from "lucide-react";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";

type WorkingProcessRow = {
    id: number;
    title: string;
    description: string;
};

const columns: Column<WorkingProcessRow>[] = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
];

export default function WorkingProcess() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [id, setId] = useState<number | null>(null);

    // DataTable states
    const [rows, setRows] = useState<WorkingProcessRow[]>([]);
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

            const res = await fetch(`/api/working-process?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json: { data: WorkingProcessRow[]; meta: PaginationMeta } = await res.json();

            const workingProcessesData: WorkingProcessRow[] = json.data.map((item) => ({
                id: item.id,
                title: <p className="line-clamp-2">{item.title}</p>,
                description: <p className="line-clamp-2">{item.description}</p>,
            }));

            setRows(workingProcessesData);
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

            const res = await fetch(`/api/working-process/${id}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json = await res.json();

            setTitle(json.data.title);
            setDescription(json.data.description);
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

            const res = await fetch(`/api/working-process`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create data");
            }

            setTitle("");
            setDescription("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenAdd(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [title, description, fetchData]);

    //edit data
    const editData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/working-process/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update data");
            }

            setTitle("");
            setDescription("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenEdit(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, title, description, fetchData]);

    //delete data
    const deleteData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/working-process/${id}`, {
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
                <h1 className="text-2xl font-semibold">Working Process</h1>
                <Button className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1" onClick={() => setOpenAdd(true)}>
                    <CirclePlus size={16} />
                    Add Process
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
                title="Add Working Process"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenAdd(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={addData}>
                            Add Process
                        </Button>
                    </>
                }
            >
                <Input label="Title" type="text" className="bg-white mb-4" value={title} onChange={setTitle} />
                <Textarea label="Description" className="bg-white" value={description} onChange={setDescription} />
            </Modal>

            {/* Modal Edit */}
            <Modal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                title="Edit Working Process"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenEdit(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={editData}>
                            Update Process
                        </Button>
                    </>
                }
            >
                <Input label="Title" type="text" className="bg-white mb-4" value={title} onChange={setTitle} />
                <Textarea label="Description" className="bg-white" value={description} onChange={setDescription} />
            </Modal>

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Working Process"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData}>
                            Delete Process
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this process?</p>
            </Modal>
        </MainLayoutAdmin>
    )
}