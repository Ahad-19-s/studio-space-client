"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRequireAuth } from "@/lib/session";
import { api } from "@/lib/api";
import { PageLoader } from "@/components/loaders";
import { Container, SectionHeading } from "@/components/shared";
import StudioForm from "@/components/studio/studio-form";
import type { IStudioPayload } from "@/lib/types/studio";

export default function AddStudioPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  async function handleCreate(payload: IStudioPayload) {
    try {
      await api.post("/add-studio", {
        ...payload,
        // Owner identity — the server stores the body as-is, and
        // /my-listing/:email looks listings up by this field.
        email: user?.email || "",
        ownerName: user?.name || "",
        ownerEmail: user?.email || "",
      });
      toast.success("Studio listed! It's now live on StudioSpace.");
      router.push("/my-listings");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add the studio.";
      toast.error(message);
      throw error; // keep the form's submitting state honest
    }
  }

  if (loading) return <PageLoader />;

  return (
    <Container className="py-12 lg:py-16">
      <SectionHeading
        eyebrow="Host your space"
        title="Add New Studio"
        description="Fill in the details below. Your listing appears on the explore page the moment it's saved."
        align="left"
        className="max-w-2xl"
      />

      <div className="mt-10 max-w-3xl">
        <StudioForm
          hostName={user?.name || ""}
          hostEmail={user?.email || ""}
          submitLabel="Publish Studio"
          onSubmit={handleCreate}
        />
      </div>
    </Container>
  );
}
