import { Eye, EyeOff } from "lucide-react";

export const EyeIcon = ({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={show ? "Hide password" : "Show password"}
  >
    {show ? (
      <Eye className="h-5 w-5 text-gray-400" />
    ) : (
      <EyeOff className="h-5 w-5 text-gray-400" />
    )}
  </button>
);
