import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminBackButtonProps {
  to?: string;
  label?: string;
}

const AdminBackButton = ({ to = "/admin/dashboard", label = "Back to Dashboard" }: AdminBackButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button variant="outline" size="sm" onClick={() => navigate(to)}>
      <ArrowLeft className="h-4 w-4 mr-2" /> {label}
    </Button>
  );
};

export default AdminBackButton;
