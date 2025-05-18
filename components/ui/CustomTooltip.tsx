import { TooltipPayload } from "@/types";

const CustomTooltip = ({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  isDark: boolean;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-md border border-border p-2 text-xs ${
          isDark ? "bg-card text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
export default CustomTooltip;
