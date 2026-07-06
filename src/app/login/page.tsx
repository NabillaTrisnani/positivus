"use client";

import Button from "@/components/button";
import Card from "@/components/card";
import Input from "@/components/input";
import Toast from "@/components/toast";
import { useCallback, useState } from "react";

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error">("error");

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    //login function
    const login = useCallback(async () => {
        setLoading(true);

        try {

            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create data");
            }

            setToastMessage("Login successful");
            setToastType("success");
            setShowToast(true);

            setTimeout(() => {
                window.location.href = "/admin/contact";
            }, 1500);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [email, password]);

    const submit = () => {
        if (email === "" || password === "") {
            setToastMessage("Please fill in all fields");
            setToastType("error");
            setShowToast(true);
        } else {
            login();
        }
    }

    return (
        <>
            {showToast && (
                <Toast
                    type={toastType}
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="container flex items-center justify-center h-screen bg-white">
                <Card className="p-6 bg-green">
                    <h1 className="text-3xl text-center font-semibold mb-6">Login</h1>
                    <Input label="Email" type="email" className="bg-gray mb-3" value={email} onChange={setEmail} disabled={loading} />
                    <Input label="Password" isPassword type={showPassword ? "text" : "password"} className="bg-gray mb-6" value={password} onChange={setPassword} togglePassword={togglePassword} disabled={loading} />
                    <Button className="bg-black text-green px-4 py-2 w-full" onClick={submit} isLoading={loading}>
                        Login
                    </Button>
                </Card>
            </div>
        </>
    )
}