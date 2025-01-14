import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FloatingContact() {
  return (
    <Button
      size="lg"
      className="fixed bottom-8 right-8 rounded-full shadow-lg z-50"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}