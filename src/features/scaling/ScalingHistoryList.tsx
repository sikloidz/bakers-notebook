import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Scaling } from "@/types";

interface ScalingHistoryListProps {
  scalings: Scaling[];
  onDelete: (id: string) => void;
}

export function ScalingHistoryList({ scalings, onDelete }: ScalingHistoryListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Scaling | null>(null);

  return (
    <>
      <div className="space-y-3">
        {scalings.map((scaling) => {
          const actualTotal = scaling.scaledIngredients.reduce(
            (sum, si) => sum + si.scaledWeight,
            0
          );
          return (
            <div
              key={scaling.id}
              className="rounded-lg border border-wheat bg-white p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-brown-dark">
                    Target: {scaling.desiredWeight}g &middot; Actual: {actualTotal}g
                  </div>
                  <div className="text-xs text-brown-light">
                    {new Date(scaling.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(scaling)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {scaling.scaledIngredients.map((si) => (
                    <tr key={si.ingredientId} className="border-b border-wheat/30 last:border-0">
                      <td className="py-1 text-brown-dark">{si.ingredientName}</td>
                      <td className="py-1 text-right tabular-nums text-brown-light">
                        {si.percentage.toFixed(1)}%
                      </td>
                      <td className="py-1 text-right tabular-nums font-medium text-brown-dark w-20">
                        {si.scaledWeight}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Scaling"
        message="Are you sure you want to delete this scaling record?"
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
