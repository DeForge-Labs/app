"use client";

import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";

export default function ErrorDialog({ error }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <Dialog open={true}>
        <DialogPopup className="sm:max-w-sm" showCloseButton={false}>
          <Form onSubmit={(e) => {}}>
            <DialogHeader>
              <DialogTitle className={"text-lg font-medium opacity-80"}>
                Something went wrong
              </DialogTitle>
              <DialogDescription className={"text-xs"}>
                Error occured while fetching data, please try again later.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={
                error ? error : "We cannot process your request at the moment"
              }
              style={{ resize: "none" }}
              rows={5}
              readOnly
              className={"font-mono"}
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    className="text-xs"
                    onClick={handleLogout}
                  />
                }
              >
                Logout
              </DialogClose>
              <Button
                className="text-background rounded-md border-none text-xs"
                type="submit"
                onClick={() => router.refresh()}
              >
                Retry
              </Button>
            </DialogFooter>
          </Form>
        </DialogPopup>
      </Dialog>
    </>
  );
}
