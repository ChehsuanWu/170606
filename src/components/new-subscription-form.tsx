"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SubscriptionForm, type SubscriptionFormValue } from "@/components/subscription-form";

function NewSubscriptionFormInner() {
  const searchParams = useSearchParams();

  const split = (key: string) => {
    const raw = searchParams.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };

  const initial: SubscriptionFormValue = {
    name: "",
    keywords: split("keywords"),
    matchType: searchParams.get("matchType") === "ALL" ? "ALL" : "ANY",
    places: split("places"),
    languages: split("languages"),
    mediaTypes: split("mediaTypes"),
    frequency: "DAILY",
    isActive: true,
  };

  return <SubscriptionForm mode="create" initial={initial} />;
}

export function NewSubscriptionForm() {
  return (
    <Suspense>
      <NewSubscriptionFormInner />
    </Suspense>
  );
}
