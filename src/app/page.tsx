"use client"

import CallToAction from "@/sections/CallToAction";
import Hero from "@/sections/Hero";
import Navbar from "@/sections/Navbar";
import Partner from "@/sections/Partner";
import Services from "@/sections/Services";
import { PartnerType, ServiceType } from "@/types/landing";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [partner, setPartner] = useState<PartnerType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // GET ALL
  const fetchDataPartner = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/partner");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setPartner(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // GET ALL
  const fetchDataServices = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/services");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setServices(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchDataPartner(), fetchDataServices()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchDataPartner, fetchDataServices]);

  return (
    <>
      {
        loading ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            <Navbar />
            <Hero />
            <Partner data={partner} />
            <Services data={services} />
            <CallToAction />
          </>
        )
      }
    </>
  );
}
