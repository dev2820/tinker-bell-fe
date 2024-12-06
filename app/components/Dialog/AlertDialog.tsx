import { Button, Dialog, Portal } from "terra-design-system/react";

import { useAlertStore } from "@/stores/alert-dialog";

export function AlertDialog() {
  const { alert, isOpen, onClose } = useAlertStore();

  return (
    <Dialog.Root
      open={isOpen}
      onInteractOutside={onClose}
      onEscapeKeyDown={onClose}
      trapFocus={false}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            className="min-h-24 w-4/5 max-w-96 rounded-2xl p-4"
            onFocus={(e) => e.preventDefault()}
          >
            <Dialog.Title className="w-full">{alert.title}</Dialog.Title>
            <Dialog.Description>{alert.description}</Dialog.Description>
            <div className="flex flex-row-reverse gap-3">
              <Button variant="ghost" onClick={onClose}>
                닫기
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
