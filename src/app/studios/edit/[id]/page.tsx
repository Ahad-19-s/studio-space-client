"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRequireAuth } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { PageLoader } from "@/components/loaders";
import { Container, EmptyState, SectionHeading } from "@/components/shared";
import StudioForm, {
  type StudioFormValues,
} from "@/components/studio-form";
import type { IStudio, IStudioPayload } from "@/lib/types/studio";

export default function EditStudioPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const studioId = params?.id;
  const { user, loading } = useRequireAuth();

  const [studio, setStudio] = useState<IStudio | null>(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!studioId) return;
    let cancelled = false;

    api
      .get<IStudio>(`/my-listing-edit/${studioId}`)
      .then((data) => {
        if (cancelled) return;
        if (data && data._id) {
          setStudio(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [studioId]);

  async function handleUpdate(payload: IStudioPayload) {
    try {
      await api.patch(`/my-listing-update/${studioId}`, payload);
      toast.success("Studio updated successfully.");
      router.push("/my-listings");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to update the studio.";
      toast.error(message);
      throw error; // keep the form's submitting state honest
    }
  }

  if (loading || fetching) return <PageLoader />;

  if (notFound || !studio) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Studio not found"
          description="This listing doesn't exist anymore, or you don't have access to it."
          action={{ label: "Back to my listings", href: "/my-listings" }}
        />
      </Container>
    );
  }

  // Prefill the shared form from the stored document.
  const initialValues: StudioFormValues = {
    title: studio.title || "",
    category: studio.category || "",
    hourlyRate: String(studio.hourlyRate ?? ""),
    securityDeposit: String(studio.securityDeposit ?? ""),
    maxCapacity: String(studio.maxCapacity ?? ""),
    location: studio.location || "",
    image: studio.image || "",
    amenities: Array.isArray(studio.amenities) ? studio.amenities : [],
    overview: studio.overview || "",
  };

  return (
    <Container className="py-12 lg:py-16">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to my listings
      </Link>

      <div className="mt-6">
        <SectionHeading
          eyebrow="Manage listing"
          title="Edit Studio"
          description="Update the details below. Changes go live on your listing immediately after saving."
          align="left"
          className="max-w-2xl"
        />
      </div>

      <div className="mt-10 max-w-3xl">
        <StudioForm
          initialValues={initialValues}
          hostName={studio.ownerName || user?.name || ""}
          hostEmail={studio.ownerEmail || studio.email || user?.email || ""}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      </div>
    </Container>
  );
}
