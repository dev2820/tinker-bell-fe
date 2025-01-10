import { useCallback, useState } from "react";

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const change = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return { isOpen, onOpen, onClose, change };
};
