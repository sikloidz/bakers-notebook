import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Toggle } from "@/components/Toggle";

interface IngredientFormProps {
  initialName?: string;
  initialIsFlour?: boolean;
  onSubmit: (name: string, isFlour: boolean) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function IngredientForm({
  initialName = "",
  initialIsFlour = false,
  onSubmit,
  onCancel,
  submitLabel = "Add",
}: IngredientFormProps) {
  const [name, setName] = useState(initialName);
  const [isFlour, setIsFlour] = useState(initialIsFlour);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, isFlour);
    if (!initialName) {
      setName("");
      setIsFlour(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          id="ingredient-name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bread Flour"
        />
      </div>
      <Toggle label="Flour" checked={isFlour} onChange={setIsFlour} />
      <Button type="submit" size="sm">
        {submitLabel}
      </Button>
      {onCancel && (
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  );
}
