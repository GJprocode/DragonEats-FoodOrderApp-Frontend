import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./dialog";
import { Textarea } from "./textarea";
import { Button } from "./button";

type RejectOrderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onReject: (rejectionMessage: string) => void;
  isPaid: boolean;
};

const RejectOrderDialog = ({
  isOpen,
  onClose,
  onReject,
  isPaid,
}: RejectOrderDialogProps) => {
  const [rejectionMessage, setRejectionMessage] = useState("");

  const handleReject = () => {
    if (!rejectionMessage.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    onReject(rejectionMessage.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Reject Order</DialogTitle>
        <Textarea
          placeholder="Enter reason for rejection"
          value={rejectionMessage}
          onChange={(e) => setRejectionMessage(e.target.value)}
        />
        {isPaid && (
          <p className="text-red-500 mt-2">
            Note: This order has already been paid. Refund is pending.
          </p>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectOrderDialog;
