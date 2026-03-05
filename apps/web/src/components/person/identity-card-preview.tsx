"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IdentityCardPreviewProps {
  photoUrl?: string | null;
  personName?: string;
  className?: string;
}

const PHOTO_ASPECT_RATIO = 3 / 4; // 3:4
const PHOTO_WIDTH = 90;
const PHOTO_HEIGHT = Math.round(PHOTO_WIDTH / PHOTO_ASPECT_RATIO);

export function IdentityCardPreview({
  photoUrl,
  personName,
  className,
}: IdentityCardPreviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border-2 border-border bg-card shadow-md",
        className,
      )}
    >
      <div className="border-b border-border bg-muted/30 px-4 py-2">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Documento de identidade
        </p>
      </div>
      <div className="flex flex-1 gap-4 p-4">
        <div
          className="flex shrink-0 items-center justify-center overflow-hidden rounded border-2 border-dashed border-muted-foreground/30 bg-muted/20"
          style={{
            width: PHOTO_WIDTH,
            height: PHOTO_HEIGHT,
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Foto 3×4"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <ImageIcon className="size-8" />
              <span className="text-[10px]">Foto 3×4</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          <p className="truncate text-sm font-medium text-foreground">
            {personName || "—"}
          </p>
          <p className="text-xs text-muted-foreground">Nome completo</p>
        </div>
      </div>
    </div>
  );
}
