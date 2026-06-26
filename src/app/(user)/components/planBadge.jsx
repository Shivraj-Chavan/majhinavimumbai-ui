import { MdWorkspacePremium, MdVerified } from "react-icons/md";
import { HiShieldCheck } from "react-icons/hi";

const PlanBadge = ({ plan }) => {
  if (!plan || plan.toLowerCase() === "free") return null;

  const planName = plan.toLowerCase();

  if (planName === "platinum") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold">
        <MdWorkspacePremium className="text-purple-600" />
        Platinum Verified
      </span>
    );
  }

  if (planName === "gold") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-semibold">
        <MdVerified className="text-yellow-600" />
        Gold Verified
      </span>
    );
  }

  if (planName === "silver") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold">
        <HiShieldCheck className="text-gray-600" />
        Silver Verified
      </span>
    );
  }

  return null;
};

export default PlanBadge;