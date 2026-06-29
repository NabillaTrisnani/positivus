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

type TestimonialRow = {
    id: number;
    name: string;
    position: string;
    company: string;
    testimony: string;
};
type TestimonialDisplay = {
    id: number;
    name: React.ReactNode;
    position: React.ReactNode;
    company: React.ReactNode;
    testimony: React.ReactNode;
};

const columns: Column<TestimonialDisplay>[] = [
    { header: "Name", accessor: "name" },
    { header: "Position", accessor: "position" },
    { header: "Company", accessor: "company" },
    { header: "Testimony", accessor: "testimony" },
];

export default function Testimonial() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [company, setCompany] = useState<string>("");
    const [testimony, setTestimony] = useState<string>("");
    const [id, setId] = useState<number | null>(null);

    // DataTable states
    const [rows, setRows] = useState<TestimonialDisplay[]>([]);
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

            const res = await fetch(`/api/testimonial?${params.toString()}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json: { data: TestimonialRow[]; meta: PaginationMeta } = await res.json();

            const testimonialsData: TestimonialDisplay[] = json.data.map((item) => ({
                id: item.id,
                name: <p className="line-clamp-2">{item.name}</p>,
                position: <p className="line-clamp-2">{item.position}</p>,
                company: <p className="line-clamp-2">{item.company}</p>,
                testimony: <p className="line-clamp-2">{item.testimony}</p>,
            }));

            setRows(testimonialsData);
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

            const res = await fetch(`/api/testimonial/${id}`);

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const json = await res.json();

            setName(json.data.name);
            setPosition(json.data.position);
            setTestimony(json.data.testimony);
            setCompany(json.data.company);
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

            const res = await fetch(`/api/testimonial`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    position: position,
                    company: company,
                    testimony: testimony,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create data");
            }

            setName("");
            setPosition("");
            setCompany("");
            setTestimony("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenAdd(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [name, position, company, testimony, fetchData]);

    //edit data
    const editData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/testimonial/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    position: position,
                    company: company,
                    testimony: testimony,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update data");
            }

            setName("");
            setPosition("");
            setCompany("");
            setTestimony("");
            setId(null);

            fetchData(lastQuery.current);

            setOpenEdit(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, name, position, company, testimony, fetchData]);

    //delete data
    const deleteData = useCallback(async () => {
        if (id === null) return;

        setLoading(true);

        try {

            const res = await fetch(`/api/testimonial/${id}`, {
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
                <h1 className="text-2xl font-semibold">Testimonial</h1>
                <Button className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1" onClick={() => setOpenAdd(true)}>
                    <CirclePlus size={16} />
                    Add Testimony
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
                title="Add Testimony"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenAdd(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={addData} isLoading={loading}>
                            Add Testimony
                        </Button>
                    </>
                }
            >
                <Input label="Name" type="text" className="bg-white mb-4" value={name} onChange={setName} />
                <Input label="Position" type="text" className="bg-white mb-4" value={position} onChange={setPosition} />
                <Input label="Company" type="text" className="bg-white mb-4" value={company} onChange={setCompany} />
                <Textarea label="Testimony" className="bg-white" value={testimony} onChange={setTestimony} />
            </Modal>

            {/* Modal Edit */}
            <Modal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                title="Edit Testimony"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenEdit(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={editData} isLoading={loading}>
                            Update Testimony
                        </Button>
                    </>
                }
            >
                <Input label="Name" type="text" className="bg-white mb-4" value={name} onChange={setName} />
                <Input label="Position" type="text" className="bg-white mb-4" value={position} onChange={setPosition} />
                <Input label="Company" type="text" className="bg-white mb-4" value={company} onChange={setCompany} />
                <Textarea label="Testimony" className="bg-white" value={testimony} onChange={setTestimony} />
            </Modal>

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Working Process"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                            Delete Testimony
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this tetimonial?</p>
            </Modal>
        </MainLayoutAdmin>
    )
}