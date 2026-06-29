"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/button";
import MainLayoutAdmin from "@/components/mainLayoutAdmin";
import Modal from "@/components/modal";
import { CirclePlus } from "lucide-react";
import Input from "@/components/input";
import Textarea from "@/components/textarea";
import ImageInput from "@/components/imageInput";
import DataTable, { Column, DataTableQuery } from "@/components/datatable";
import { initialMeta, type PaginationMeta } from "@/lib/pagination";

type TeamRow = {
    id: number;
    photo: string;
    name: string;
    position: string;
    description: string;
    linkedin: string;
};

type TeamRowDisplay = {
    id: number;
    photo: React.ReactNode;
    name: React.ReactNode;
    position: React.ReactNode;
    description: React.ReactNode;
    linkedin: React.ReactNode;
};

const columns: Column<TeamRowDisplay>[] = [
    { header: "Photo", accessor: "photo" },
    { header: "Name", accessor: "name" },
    { header: "Position", accessor: "position" },
    { header: "Description", accessor: "description" },
    { header: "LinkedIn", accessor: "linkedin" },
];

export default function Team() {
    // Modal states
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    // Form states
    const [name, setName] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);       // ✅ File, bukan string
    const [existingPhoto, setExistingPhoto] = useState<string>(""); // URL foto lama (untuk edit)
    const [linkedin, setLinkedin] = useState<string>("");
    const [id, setId] = useState<number | null>(null);

    // DataTable states
    const [rows, setRows] = useState<TeamRowDisplay[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
    const [loading, setLoading] = useState<boolean>(false);
    const lastQuery = useRef<DataTableQuery>({ page: 1, limit: 10, search: "" });

    function resetForm() {
        setName("");
        setPosition("");
        setDescription("");
        setPhoto(null);
        setExistingPhoto("");
        setLinkedin("");
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

            const res = await fetch(`/api/team?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json: { data: TeamRow[]; meta: PaginationMeta } = await res.json();

            const teamsData: TeamRowDisplay[] = json.data.map((item) => ({
                id: item.id,
                photo: (
                    <img
                        src={item.photo}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                    />
                ),
                name: <p className="line-clamp-2">{item.name}</p>,
                position: <p className="line-clamp-2">{item.position}</p>,
                description: <p className="line-clamp-2">{item.description}</p>,
                linkedin: <p className="line-clamp-2">{item.linkedin}</p>,
            }));

            setRows(teamsData);
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
            const res = await fetch(`/api/team/${id}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json = await res.json();

            setName(json.data.name);
            setPosition(json.data.position);
            setDescription(json.data.description);
            setExistingPhoto(json.data.photo); // simpan URL lama
            setPhoto(null);                    // reset file baru
            setLinkedin(json.data.linkedin);
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
        if (!photo) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("position", position);
            formData.append("description", description);
            formData.append("linkedin", linkedin);
            formData.append("photo", photo);

            const res = await fetch(`/api/team`, {
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
    }, [name, position, description, photo, linkedin, fetchData]);

    // UPDATE
    const editData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("position", position);
            formData.append("description", description);
            formData.append("linkedin", linkedin);

            if (photo) {
                formData.append("photo", photo);
            } else {
                formData.append("photo", existingPhoto);
            }

            const res = await fetch(`/api/team/${id}`, {
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
    }, [id, name, position, description, photo, existingPhoto, linkedin, fetchData]);

    // DELETE
    const deleteData = useCallback(async () => {
        if (id === null) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
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
                <h1 className="text-2xl font-semibold">Team</h1>
                <Button
                    className="bg-green hover:bg-green-hover border border-black px-5 py-2 flex items-center gap-1"
                    onClick={() => setOpenAdd(true)}
                >
                    <CirclePlus size={16} />
                    Add Team
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
                title="Add Team"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenAdd(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={addData} isLoading={loading}>
                            Add Team
                        </Button>
                    </>
                }
            >
                <Input label="Name" type="text" className="bg-white mb-4" value={name} onChange={setName} disabled={loading} />
                <Input label="Position" type="text" className="bg-white mb-4" value={position} onChange={setPosition} disabled={loading} />
                <Input label="LinkedIn Link" type="text" className="bg-white mb-4" value={linkedin} onChange={setLinkedin} disabled={loading} />
                <Textarea label="Description" className="bg-white mb-4" value={description} onChange={setDescription} disabled={loading} />
                <ImageInput label="Photo" onChange={setPhoto} disabled={loading} />
            </Modal>

            {/* Modal Edit */}
            <Modal
                isOpen={openEdit}
                onClose={() => { setOpenEdit(false); resetForm(); }}
                title="Edit Team"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => { setOpenEdit(false); resetForm(); }} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={editData} isLoading={loading}>
                            Update Team
                        </Button>
                    </>
                }
            >
                <Input label="Name" type="text" className="bg-white mb-4" value={name} onChange={setName} disabled={loading} />
                <Input label="Position" type="text" className="bg-white mb-4" value={position} onChange={setPosition} disabled={loading} />
                <Input label="LinkedIn Link" type="text" className="bg-white mb-4" value={linkedin} onChange={setLinkedin} disabled={loading} />
                <Textarea label="Description" className="bg-white mb-4" value={description} onChange={setDescription} disabled={loading} />

                {/* Tampilkan foto lama kalau belum diganti */}
                {existingPhoto && !photo && (
                    <div className="mb-2">
                        <p className="text-sm font-medium mb-1">Current Photo</p>
                        <img
                            src={existingPhoto}
                            alt="current"
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                    </div>
                )}
                <ImageInput label="Change Photo (optional)" onChange={setPhoto} disabled={loading} />
            </Modal>

            {/* Modal Delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Delete Team"
                footer={
                    <>
                        <Button className="border border-black px-5 py-2" onClick={() => setOpenDelete(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button className="bg-green border border-black px-5 py-2" onClick={deleteData} isLoading={loading}>
                            Delete Team
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this team?</p>
            </Modal>
        </MainLayoutAdmin>
    );
}