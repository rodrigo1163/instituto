"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export interface DocumentUploadValue {
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
}

export interface DocumentUploadZoneProps {
  value?: DocumentUploadValue | null;
  onChange?: (value: DocumentUploadValue | null) => void;
  onValidationError?: (error: string | null) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Tipo de arquivo inválido. Use JPEG ou PNG.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Arquivo muito grande. Máximo 2MB.";
  }
  return null;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

export function DocumentUploadZone({
  value,
  onChange,
  onValidationError,
  error,
  disabled,
  id,
  "aria-invalid": ariaInvalid,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || !onChange) return;

      const file = files[0];
      const validationError = validateFile(file);

      if (validationError) {
        setLocalError(validationError);
        onValidationError?.(validationError);
        return;
      }

      setLocalError(null);
      onValidationError?.(null);

      try {
        const fileUrl = await readFileAsDataUrl(file);
        onChange({
          fileUrl,
          fileName: file.name,
          mimeType: file.type,
        });
      } catch {
        setLocalError("Falha ao processar o arquivo.");
        onValidationError?.("Falha ao processar o arquivo.");
      }
    },
    [onChange, onValidationError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles],
  );

  const displayError = error ?? localError;
  const hasValue = !!value?.fileUrl;

  return (
    <Field data-invalid={!!displayError}>
      <FieldLabel htmlFor={id}>Foto 3×4</FieldLabel>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-invalid={ariaInvalid}
        className={cn(
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors",
          "hover:border-primary/50 hover:bg-accent/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
          isDragging && "border-primary bg-accent/10",
          disabled && "cursor-not-allowed opacity-50",
          hasValue && "border-primary/30 bg-primary/5",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden
        />
        {hasValue ? (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <ImageIcon className="size-6" />
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              Foto selecionada
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Clique ou arraste para substituir
            </p>
          </>
        ) : (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Upload className="size-6" />
            </div>
            <p className="text-center text-sm font-medium text-foreground">
              Arraste a foto aqui ou clique para selecionar
            </p>
            <p className="text-center text-xs text-muted-foreground">
              JPEG ou PNG, máximo 2MB
            </p>
          </>
        )}
      </div>
      {displayError && <FieldError errors={[{ message: displayError }]} />}
    </Field>
  );
}
