"use client";

import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";

import { logout } from "@/actions/logout";

const DEFAULT_ERROR_MESSAGE = "We cannot process your request at the moment";

const ErrorDialog = ({ error }) => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <Dialog open={true}>
      <DialogPopup className="sm:max-w-sm" showCloseButton={false}>
        <Form>
          <DialogHeader>
            <DialogTitle className={"text-lg font-medium opacity-80"}>
              Something went wrong
            </DialogTitle>

            <DialogDescription className={"text-xs"}>
              Error occurred while fetching data. Please try again later.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            readOnly
            rows={5}
            className={"font-mono"}
            aria-label="Error details"
            style={{ resize: "none" }}
            value={error || DEFAULT_ERROR_MESSAGE}
          />

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs"
                  onClick={handleLogout}
                />
              }
            >
              Logout
            </DialogClose>

            <Button
              type="button"
              onClick={() => router.refresh()}
              className="text-background rounded-md border-none text-xs"
            >
              Retry
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};

export default ErrorDialog;
