import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, X } from "lucide-react";

const NotificationDialog = ({ isOpen, onClose, message, type }) => {
  const isSuccess = type === 'success';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center pt-2">
          <div className={`rounded-full p-3 mb-4 ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
            {isSuccess ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-xl font-semibold">
            {isSuccess ? 'Success!' : 'Error!'}
          </DialogTitle>
          <DialogDescription className="mt-3 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogFooter className="mt-6 sm:justify-center">
          <Button
            onClick={onClose}
            className={`w-full sm:w-auto px-8 py-2 ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition-colors duration-200`}
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
