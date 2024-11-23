import { useSettingStore } from "@/stores/setting";
import { ListFilterIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { Button, Dialog, IconButton } from "terra-design-system/react";

export function TodoFilterDialog({ className }: { className?: string }) {
  const { filterOption, changeFilter } = useSettingStore();

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const newOption = e.currentTarget.value as typeof filterOption;
    changeFilter(newOption);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild className={className}>
        <IconButton variant="ghost">
          <ListFilterIcon size={20} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="p-4 w-full max-w-[240px]">
          <Dialog.Title>할 일 보기 방식</Dialog.Title>
          <Dialog.Description>
            <ul>
              {["all", "not-completed", "completed"].map((v) => (
                <li key={v} className="mb-4 last:mb-0">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      className="hidden peer"
                      name="filter"
                      value={v}
                      checked={v === filterOption}
                      onChange={handleChangeFilter}
                    />
                    <div className="px-4 py-3 border rounded-lg peer-checked:text-primary-pressed peer-checked:border-primary peer-checked:bg-primary-subtle ">
                      {v === "all" && "모든 할 일"}
                      {v === "not-completed" && "완료되지 않은 할 일"}
                      {v === "completed" && "완료된 할 일"}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </Dialog.Description>
          <div className="flex flex-row-reverse gap-3">
            <Dialog.CloseTrigger asChild>
              <Button>확인</Button>
            </Dialog.CloseTrigger>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
