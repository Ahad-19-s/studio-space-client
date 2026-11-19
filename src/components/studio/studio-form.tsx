"use client";

import { useState } from "react";
import { Check, ImagePlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/loaders";
import { AMENITY_OPTIONS, CATEGORY_OPTIONS } from "@/lib/constants";
import type { IStudioPayload } from "@/lib/types/studio";
import { cn } from "cn";

export interface StudioFormValues {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
}

export const EMPTY_STUDIO: StudioFormValues = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  amenities: [],
  overview: "",
};

// Converts form strings into the payload the Express API expects.
export function toPayload(values: StudioFormValues): IStudioPayload {
  return {
    title: values.title.trim(),
    category: values.category,
    hourlyRate: values.hourlyRate,
    securityDeposit: values.securityDeposit || 0,
    maxCapacity: values.maxCapacity || 1,
    location: values.location.trim(),
    image: values.image.trim(),
    amenities: values.amenities,
    overview: values.overview.trim(),
  };
}

function validate(values: StudioFormValues): string | null {
  if (!values.title.trim()) return "Studio title is required.";
  if (!values.category) return "Please choose a category.";
  if (!values.hourlyRate || Number(values.hourlyRate) <= 0)
    return "Hourly rate must be a positive number.";
  if (values.securityDeposit && Number(values.securityDeposit) < 0)
    return "Security deposit cannot be negative.";
  if (values.maxCapacity && Number(values.maxCapacity) < 1)
    return "Max capacity must be at least 1.";
  if (!values.location.trim()) return "Location is required.";
  if (
    values.image.trim() &&
    !/^https?:\/\//i.test(values.image.trim())
  )
    return "Image URL must start with http:// or https://";
  if (!values.overview.trim()) return "Please write a short overview.";
  return null;
}

// Shared Add/Edit studio form. Read-only host info is rendered by the
// parent so this stays a pure controlled form.
export default function StudioForm({
  initialValues = EMPTY_STUDIO,
  hostName,
  hostEmail,
  submitLabel,
  onSubmit,
}: {
  initialValues?: StudioFormValues;
  hostName: string;
  hostEmail: string;
  submitLabel: string;
  onSubmit: (payload: IStudioPayload) => Promise<void>;
}) {
  const [values, setValues] = useState<StudioFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Optional imgbb upload — falls back silently to a plain URL when no key.
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof StudioFormValues>(key: K, value: StudioFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setError(null);
  }

  function toggleAmenity(amenity: string) {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toastFallback();
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        { method: "POST", body: form }
      );
      const data = await response.json();
      if (data?.data?.display_url) {
        set("image", data.data.display_url);
      } else {
        setError("Image upload failed — paste an image URL instead.");
      }
    } catch {
      setError("Image upload failed — paste an image URL instead.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function toastFallback() {
    setError(
      "Image upload isn't configured yet (no IMGBB key) — paste a direct image URL below."
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toPayload(values));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="studio-title">Title</Label>
          <Input
            id="studio-title"
            placeholder="Sunlit Cyc Wall Studio — Downtown"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-category">Category</Label>
          <select
            id="studio-category"
            value={values.category}
            onChange={(event) => set("category", event.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">Select a category…</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-location">Location</Label>
          <Input
            id="studio-location"
            placeholder="Brooklyn, New York"
            value={values.location}
            onChange={(event) => set("location", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-rate">Hourly Rate ($)</Label>
          <Input
            id="studio-rate"
            type="number"
            min={1}
            step="1"
            placeholder="85"
            value={values.hourlyRate}
            onChange={(event) => set("hourlyRate", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-deposit">Security Deposit ($)</Label>
          <Input
            id="studio-deposit"
            type="number"
            min={0}
            step="1"
            placeholder="250"
            value={values.securityDeposit}
            onChange={(event) => set("securityDeposit", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-capacity">Max Capacity</Label>
          <Input
            id="studio-capacity"
            type="number"
            min={1}
            step="1"
            placeholder="12"
            value={values.maxCapacity}
            onChange={(event) => set("maxCapacity", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="studio-image">Image URL</Label>
          <Input
            id="studio-image"
            type="url"
            placeholder="https://…/studio.jpg"
            value={values.image}
            onChange={(event) => set("image", event.target.value)}
          />
        </div>
      </div>

      {/* Optional image upload (imgbb) with graceful fallback */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted">
          {uploading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
        <span className="text-xs text-muted-foreground">
          Or paste a direct image URL above.
        </span>
      </div>

      {/* Live preview keeps images/spacing uniform */}
      {values.image.trim() && /^https?:\/\//i.test(values.image.trim()) && (
        <div className="overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={values.image}
            alt="Studio preview"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => {
            const selected = values.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                aria-pressed={selected}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  selected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {selected && <Check className="size-3" />}
                {amenity}
              </button>
            );
          })}
        </div>
        {values.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {values.amenities.map((amenity) => (
              <Badge key={amenity} variant="amber">
                {amenity}
                <button
                  type="button"
                  aria-label={`Remove ${amenity}`}
                  onClick={() => toggleAmenity(amenity)}
                  className="ml-0.5 rounded-full hover:text-primary"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="studio-overview">Overview</Label>
        <Textarea
          id="studio-overview"
          rows={5}
          placeholder="Describe the space, the light, the gear included and what kind of production it suits best…"
          value={values.overview}
          onChange={(event) => set("overview", event.target.value)}
        />
      </div>

      {/* Read-only host info (from the verified session) */}
      <div className="grid gap-5 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="host-name">Host Name</Label>
          <Input id="host-name" value={hostName} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="host-email">Host Email</Label>
          <Input id="host-email" value={hostEmail} readOnly disabled />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {submitting && <Spinner className="h-4 w-4" />}
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
