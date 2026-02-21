import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface ScalingFormProps {
  desiredWeight: number;
  onChangeWeight: (weight: number) => void;
  onScale: () => void;
  originalWeight: number;
}

export function ScalingForm({
  desiredWeight,
  onChangeWeight,
  onScale,
  originalWeight,
}: ScalingFormProps) {
  return (
    <div className="rounded-lg border border-wheat bg-white p-4">
      <h2 className="mb-3 font-serif text-lg font-semibold text-brown">
        Scale Recipe
      </h2>
      <p className="mb-3 text-sm text-brown-light">
        Original recipe weight: <strong>{originalWeight}g</strong>. Enter your
        desired total dough weight below.
      </p>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            id="desired-weight"
            label="Desired Total Weight (g)"
            type="number"
            min={1}
            value={desiredWeight || ""}
            onChange={(e) => onChangeWeight(Number(e.target.value))}
            placeholder="e.g. 4080"
          />
        </div>
        <Button onClick={onScale} disabled={!desiredWeight || desiredWeight <= 0}>
          Calculate
        </Button>
      </div>
    </div>
  );
}
