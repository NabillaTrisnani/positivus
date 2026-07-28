"use client"

import Toast from "@/components/toast";
import CallToAction from "@/sections/CallToAction";
import CaseStudies from "@/sections/CaseStudies";
import Contact from "@/sections/Contact";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import Navbar from "@/sections/Navbar";
import Partner from "@/sections/Partner";
import Services from "@/sections/Services";
import Team from "@/sections/Team";
import Testimonial from "@/sections/Testimonial";
import WorkingProcess from "@/sections/WorkingProcess";
import { CaseStudyType, PartnerType, ServiceType, SocialMediaType, TeamType, TestimonialType, WorkingProcessType } from "@/types/landing";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);

  //fot get data
  const [partner, setPartner] = useState<PartnerType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyType[]>([]);
  const [workingProcess, setWorkingProcess] = useState<WorkingProcessType[]>([]);
  const [team, setTeam] = useState<TeamType[]>([]);
  const [testimonial, setTestimonial] = useState<TestimonialType[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMediaType[]>([]);

  //for form contact
  const [name, setName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [type, setType] = useState<string>("say hi");

  //for form subscription
  const [subscribtionEmail, setSubscribtionEmail] = useState<string>("");

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  // GET PARTNER
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

  // GET SERVICES
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

  // GET CASE STUDIES
  const fetchDataCaseStudies = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/case-study");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setCaseStudies(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // GET WORKING PROCESS
  const fetchDataWorkingProcess = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/working-process");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setWorkingProcess(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // GET TEAM
  const fetchDataTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/team");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setTeam(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // GET TESTIMONIAL
  const fetchDataTestimonial = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/testimonial");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setTestimonial(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // GET SOCIAL MEDIA
  const fetchDataSocialMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/landingpage/social-media");
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();

      setSocialMedia(json.data ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // SEND CONTACT
  const sendContact = useCallback(async () => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: contactEmail,
          message: message,
          type: type,
        }),
      });

      if (!res.ok) throw new Error("Failed to send contact");

      setName("");
      setContactEmail("");
      setMessage("");
      setType("say hi");

      setToastMessage("Contact sent successfully");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setToastMessage("Failed to send contact");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, [name, contactEmail, message, type]);

  // SEND SUBSCRIPTION
  const sendSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscribtionEmail,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");

      setSubscribtionEmail("");

      setToastMessage("Subscribed successfully");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setToastMessage("Failed to send email");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }, [contactEmail]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchDataPartner(),
        fetchDataServices(),
        fetchDataCaseStudies(),
        fetchDataWorkingProcess(),
        fetchDataTeam(),
        fetchDataTestimonial(),
        fetchDataSocialMedia(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [fetchDataPartner, fetchDataServices, fetchDataCaseStudies, fetchDataWorkingProcess, fetchDataTeam, fetchDataTestimonial, fetchDataSocialMedia]);

  return (
    <>
      {
        loading ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-base lg:text-lg font-semibold">Loading...</p>
          </div>
        ) : (
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
            <Navbar />
            <Hero />
            <Partner data={partner} />
            <Services data={services} />
            <CallToAction />
            <CaseStudies data={caseStudies} />
            <WorkingProcess data={workingProcess} />
            <Team data={team} />
            <Testimonial data={testimonial} />
            <Contact setName={setName} setEmail={setContactEmail} setMessage={setMessage} setType={setType} name={name} email={contactEmail} message={message} type={type} loading={loading} sendContact={sendContact} />
            <Footer data={socialMedia} setEmail={setSubscribtionEmail} email={subscribtionEmail} loading={loading} sendSubscription={sendSubscription} />
          </>
        )
      }
    </>
  );
}
