import { TodoTitleTextarea } from "@/components/todo/TodoTitleInput";
import { Todo } from "@/types/todo";
import { authAPI } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilterIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useMemo,
  useEffect,
  FormEvent,
} from "react";
import { toTodo, type RawTodo } from "@/utils/api/todo";
import { TodoDraggableItem } from "@/components/todo/TodoDraggableItem";
import {
  Drawer,
  Button,
  IconButton,
  Portal,
  Dialog,
  Toast,
} from "terra-design-system/react";
import { AnimatePresence, Reorder } from "framer-motion";
import {
  formatDate,
  formatKoreanDate,
  getToday,
  calcRelativeDate,
} from "@/utils/date-time";
import { vibrateShort } from "@/utils/device/vibrate";
import Calendar from "@/components/calendar/Calendar";
import {
  changeDateOfTodo,
  delayNextDay,
  delayNextWeek,
  getDateFromTodo,
} from "@/utils/helper/todo";
import { Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Swiper as SwiperType } from "swiper/types";
import { range } from "@/utils/range";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useTodo } from "@/hooks/use-todo";
import { ToastProvider, useToast } from "@/contexts/toast";
import { stackRouterPush } from "@/utils/helper/app";
import { useCurrentTodo } from "@/hooks/use-current-todo";
import { MenubarItem } from "@/components/menubar/MenubarItem";
import { useSettingStore } from "@/stores/setting";

export const meta: MetaFunction = () => {
  return [
    { title: "Ticket bell todo" },
    {
      property: "og:title",
      content: "Ticket bell todo",
    },
    {
      name: "description",
      content: "세상에서 제일 쉬운 Todo",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const rawCookie = request.headers.get("Cookie") ?? "";
  const cookie = new Map<string, string>(
    rawCookie
      .split("; ")
      .map(
        (cookieStr): Readonly<[string, string]> =>
          [...cookieStr.split("=", 2), ""].slice(0, 2) as [string, string]
      )
  );

  /**
   * TODO: accessToken 검사
   * accessToken 없음 -> refreshToken 삭제 후 로그인으로 (이상한 케이스)
   * accessToken 만료 -> refreshToken으로 accessToken 업데이트
   * refreshToken 만료 -> 로그인페이지로 이동
   * accessToken 사용시 refreshToken 업데이트? (고민좀)
   */
  const isLogined = cookie.has("accessToken");
  if (!isLogined) {
    return redirect("/login");
  }

  const accessToken = cookie.get("accessToken");
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return await authAPI
        .get<RawTodo[]>("todos", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        })
        .json()
        .then((rawTodos) => {
          return rawTodos.map((rawTodo) => toTodo(rawTodo));
        });
    },
    initialData: [],
  });

  return json({ dehydratedState: dehydrate(queryClient), accessToken });
};

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ToastProvider>
        <TodoPage />
      </ToastProvider>
    </HydrationBoundary>
  );
}

const slides = range(-500, 500, 1);
const initialSlideIndex = slides.length / 2;

function TodoPage() {
  const navigate = useNavigate();

  const [currentSlideIndex, setCurrentSlideIndex] =
    useState<number>(initialSlideIndex);
  const [baseDate, setBaseDate] = useState<Date>(getToday());
  const currentDate = useMemo(
    () => calcRelativeDate(baseDate, slides[currentSlideIndex]),
    [baseDate, currentSlideIndex]
  );

  const {
    todos,
    updateTodoById,
    debouncedUpdateTodoById,
    toggleTodoById,
    createTodo,
    deleteTodoById,
  } = useTodo(currentDate);
  const { filterOption, changeFilter } = useSettingStore();

  const addTodoDrawer = useDisclosure();
  const completedTodoDrawer = useDisclosure();
  const detailDrawer = useDisclosure();
  const { toaster, showToast } = useToast();
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const [calendarDate, setCalendarDate] = useState<Date>(baseDate);
  const currentTodo = useCurrentTodo();

  const [title, setTitle] = useState<string>("");
  const handleChangeTodoComplete = (todoId: number) => {
    if (!todos) {
      return null;
    }
    const targetTodo = todos.find((todo) => todo.id === todoId);
    if (!targetTodo) {
      return null;
    }

    toggleTodoById(targetTodo.id);
    if (!targetTodo.isCompleted) {
      /**
       * TODO: undo action 만들기
       */
      showToast({
        description: `작업 완료! 🥳`,
      });
    }
    vibrateShort();
  };

  const handleClickTodoItem = (todoId: number) => {
    if (!todos) {
      return;
    }
    // show todo details
    const todo = todos.find((todo) => todo.id === todoId);
    if (todo) {
      currentTodo.update(todo);
    }
    detailDrawer.onOpen();
  };

  const handleClickDeleteCurrentTodo = () => {
    // show todo details
    if (currentTodo.value) {
      deleteTodoById(currentTodo.value.id);
      detailDrawer.onClose();
      showToast({
        description: "삭제 완료 🗑️",
      });
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.currentTarget.value);
  };
  const handleKeydownTitle = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      createTodo({
        title: title,
        date: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
        },
      });

      setTitle("");
    }
  };
  const handleUpdateTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.currentTarget.value;
    if (currentTodo.value) {
      currentTodo.update({
        title: newTitle,
      });
      debouncedUpdateTodoById(currentTodo.value.id, {
        title: newTitle,
      });
    }
  };

  const handleClickCreateTodo = async () => {
    createTodo({
      title: title,
      date: {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
      },
    });
    addTodoDrawer.onClose();
    setTitle("");
  };

  const handleGotoPrevDate = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slidePrev(0);
  };

  const handleGotoNextDate = () => {
    if (!swiperRef) {
      return;
    }
    swiperRef.slideNext(0);
  };

  const handleClickDelayTomorrow = () => {
    const delayedTodo = delayNextDay(currentTodo.value);
    currentTodo.update(delayedTodo);
    updateTodoById(delayedTodo.id, { date: delayedTodo.date });
    detailDrawer.onClose();
  };

  const handleClickDelayWeek = () => {
    const delayedTodo = delayNextWeek(currentTodo.value);
    currentTodo.update(delayedTodo);
    updateTodoById(delayedTodo.id, { date: delayedTodo.date });
    detailDrawer.onClose();
  };

  const handleUpdateCalendarDate = (dateStr: string) => {
    const newDate = new Date(dateStr);
    setCalendarDate(newDate);
  };

  const handleClickUpdateDateConfirm = () => {
    const changedTodo = changeDateOfTodo(currentTodo.value, calendarDate);
    if (currentTodo) {
      currentTodo.update(changedTodo);
      updateTodoById(changedTodo.id, { date: changedTodo.date });
      detailDrawer.onClose();
    }
  };

  const handleClickCalendarIcon = () => {
    setCalendarDate(getDateFromTodo(currentTodo.value));
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlideIndex(swiper.activeIndex);
  };

  const handleClickLoadMore = () => {
    if (!swiperRef) {
      return;
    }

    setBaseDate(currentDate);
    swiperRef.slideTo(initialSlideIndex, 0);
  };

  const handleCloseCreateTodo = () => {
    addTodoDrawer.onClose();
    setTitle("");
  };

  const handleGoToday = () => {
    setBaseDate(new Date());
    swiperRef?.slideTo(initialSlideIndex, 200);
    showToast({
      description: "오늘 날짜로 이동했어요",
    });
  };
  const handleChangeFilter = (e: FormEvent<HTMLInputElement>) => {
    const newOption = e.currentTarget.value as typeof filterOption;
    changeFilter(newOption);
  };
  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <h2 className="h-[72px] text-center pt-4">
        <small className="block">
          {formatKoreanDate(currentDate, "yyyy년 MM월 dd일")}
        </small>
        <div className="relative flex flex-row place-items-center justify-center gap-3">
          <button onClick={handleGotoPrevDate}>
            <ChevronLeftIcon size={28} strokeWidth={1} />
          </button>
          <time
            dateTime={formatDate(currentDate, "yyyy-MM-dd")}
            className="font-bold w-12"
          >
            {formatKoreanDate(currentDate, "EEEE")}
          </time>
          <button onClick={handleGotoNextDate}>
            <ChevronRightIcon size={28} strokeWidth={1} />
          </button>
          <Dialog.Root>
            <Dialog.Trigger asChild className="absolute right-4 -top-1.5">
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
        </div>
      </h2>
      <div className="h-[calc(100%_-_144px)] w-full">
        <Swiper
          modules={[Virtual]}
          className="h-full w-full"
          slidesPerView={1}
          onSwiper={setSwiperRef}
          onSlideChange={handleSlideChange}
          centeredSlides={true}
          spaceBetween={0}
          initialSlide={initialSlideIndex}
          virtual
        >
          {slides.map((slideContent, index) => (
            <SwiperSlide key={slideContent} virtualIndex={index}>
              {[slides[0], slides.at(-1)].some((s) => s === slideContent) && (
                <div className="h-full overflow-y-auto flex flex-col items-center justify-center">
                  <p className="text-center mb-8">
                    다음 날짜의 Todo를 불러오려면 아래 &apos;더 불러오기&apos;
                    버튼을 눌러주세요.
                  </p>
                  <Button theme="primary" onClick={handleClickLoadMore}>
                    더 불러오기
                  </Button>
                </div>
              )}
              {[slides[0], slides.at(-1)].every((s) => s !== slideContent) && (
                <TodoView
                  currentDate={calcRelativeDate(baseDate, slideContent)}
                  onClickTodoCheck={handleChangeTodoComplete}
                  onClickTodo={handleClickTodoItem}
                  onClickAddTodo={addTodoDrawer.onOpen}
                ></TodoView>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <Toast.Toaster toaster={toaster}>
          {(toast) => (
            <Toast.Root
              key={toast.id}
              className="bg-neutral-800 py-3 w-full min-w-[calc(100vw_-_32px)]"
            >
              <Toast.Description className="text-white">
                {toast.description}
              </Toast.Description>
              <Toast.CloseTrigger asChild className="top-1.5">
                <button className="text-md text-primary rounded-md px-2 py-1">
                  확인
                </button>
              </Toast.CloseTrigger>
            </Toast.Root>
          )}
        </Toast.Toaster>
      </div>
      <div className="z-10 h-menubar border-t border-gray-200 rounded-t-xl flex flex-row gap-2 place-items-stretch px-2 py-2">
        <Button
          className="w-full h-full my-auto"
          variant="ghost"
          onClick={handleGoToday}
        >
          <MenubarItem
            icon={<CalendarIcon size={24} />}
            labelText="오늘로 이동하기"
          />
        </Button>
        <Button
          className="w-full h-full my-auto"
          variant="ghost"
          onClick={() => stackRouterPush(navigate, "/setting")}
        >
          <MenubarItem icon={<SettingsIcon size={24} />} labelText="설정" />
        </Button>
      </div>

      {/**
       * todo 생성
       */}
      <Drawer.Root
        variant="bottom"
        open={addTodoDrawer.isOpen}
        onExitComplete={handleCloseCreateTodo}
        onInteractOutside={addTodoDrawer.onClose}
        onEscapeKeyDown={addTodoDrawer.onClose}
        // trapFocus={false}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className="h-full min-h-96 rounded-t-lg pt-4">
              <Drawer.Header className="h-full">
                <div className="flex flex-row">
                  <TodoTitleTextarea
                    value={title}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeydownTitle}
                    className="flex-1"
                    placeholder="할 일을 입력해주세요"
                    enterKeyHint="done"
                  />
                </div>
              </Drawer.Header>
              <Drawer.Body></Drawer.Body>
              <Drawer.Footer>
                <Button
                  variant="outline"
                  className="mr-3"
                  onClick={handleCloseCreateTodo}
                >
                  닫기
                </Button>
                <Button theme="primary" onClick={handleClickCreateTodo}>
                  확인
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/**
       * 완료된 todo 보기
       */}
      <Drawer.Root
        variant="bottom"
        open={completedTodoDrawer.isOpen}
        onInteractOutside={completedTodoDrawer.onClose}
        onEscapeKeyDown={completedTodoDrawer.onClose}
        trapFocus={false}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className="h-96 rounded-t-lg pt-4">
              <Drawer.Body>
                <div className="flex flex-row-reverse mb-2">
                  <Button onClick={completedTodoDrawer.onClose}>닫기</Button>
                </div>
                <CompletedTodoView
                  currentDate={currentDate}
                  onChangeComplete={handleChangeTodoComplete}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      {/**
       * todo 자세히 보기
       */}
      <Drawer.Root
        variant="bottom"
        open={detailDrawer.isOpen}
        onInteractOutside={detailDrawer.onClose}
        onEscapeKeyDown={detailDrawer.onClose}
        trapFocus={false}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content
              className="h-full min-h-96 rounded-t-lg pt-4"
              onFocus={(e) => e.preventDefault()}
            >
              <Drawer.Header>
                <Drawer.Title className="w-full">
                  <div className="flex flex-row place-items-start h-auto">
                    <TodoTitleTextarea
                      value={currentTodo.value.title}
                      onChange={handleUpdateTitle}
                      className="w-full h-8 min-w-0"
                      placeholder="할 일을 입력해주세요"
                    />
                    <IconButton
                      size="md"
                      variant="ghost"
                      onClick={handleClickDeleteCurrentTodo}
                      className="flex-none -mt-1.5"
                    >
                      <Trash2Icon size={24} />
                    </IconButton>
                  </div>
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Description>
                <section className="flex flex-row place-items-center gap-3 px-4">
                  <CalendarIcon size={24} />
                  <Dialog.Root>
                    {/* <Input type="date" onChange={handleUpdateDate} /> */}
                    {`${
                      currentTodo.value.date.year
                    }-${currentTodo.value.date.month
                      .toString()
                      .padStart(2, "0")}-${currentTodo.value.date.day
                      .toString()
                      .padStart(2, "0")}`}
                    <Dialog.Trigger asChild>
                      <IconButton size="sm" onClick={handleClickCalendarIcon}>
                        <CalendarIcon size={24} />
                      </IconButton>
                    </Dialog.Trigger>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content className="w-4/5 min-w-92 h-112 py-6 flex flex-col">
                        <Dialog.Title className="text-center flex-none px-4">
                          날짜 변경
                        </Dialog.Title>
                        <Dialog.Description className="flex-1 px-4">
                          <Calendar
                            today={calendarDate}
                            onSelect={handleUpdateCalendarDate}
                          />
                        </Dialog.Description>
                        <div className="flex flex-row-reverse flex-none px-4 gap-3">
                          <Dialog.CloseTrigger asChild>
                            <Button
                              theme="primary"
                              onClick={handleClickUpdateDateConfirm}
                            >
                              확인
                            </Button>
                          </Dialog.CloseTrigger>
                          <Dialog.CloseTrigger asChild>
                            <Button variant="outline" theme="neutral">
                              취소
                            </Button>
                          </Dialog.CloseTrigger>
                        </div>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Dialog.Root>
                  <Button size="sm" onClick={handleClickDelayTomorrow}>
                    내일로
                  </Button>
                  <Button size="sm" onClick={handleClickDelayWeek}>
                    다음주로
                  </Button>
                </section>
              </Drawer.Description>
              <Drawer.Footer>
                <Button onClick={detailDrawer.onClose}>닫기</Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </main>
  );
}

type TodoViewProps = {
  currentDate: Date;
  onClickTodoCheck: (id: Todo["id"]) => void;
  onClickTodo: (id: Todo["id"]) => void;
  onClickAddTodo: () => void;
};
function TodoView(props: TodoViewProps) {
  const { currentDate, onClickTodoCheck, onClickTodo, onClickAddTodo } = props;
  const { todos } = useTodo(currentDate);
  /**
   * TODO: order api가 생기면 todo 상태를 따로 저장할 필요 없어짐
   */
  const { filterOption } = useSettingStore();
  const [orderedTodos, setOrderedTodos] = useState<Todo[]>(
    todos?.filter((todo) =>
      filterOption === "all"
        ? true
        : filterOption === "completed"
        ? todo.isCompleted
        : !todo.isCompleted
    ) ?? []
  );

  useEffect(() => {
    setOrderedTodos(
      todos?.filter((todo) =>
        filterOption === "all"
          ? true
          : filterOption === "completed"
          ? todo.isCompleted
          : !todo.isCompleted
      ) ?? []
    );
  }, [filterOption, todos]);

  const handleChangeComplete = (e: ChangeEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    onClickTodoCheck(todoId);
  };
  const handleClickTodoItem = (e: MouseEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    onClickTodo(todoId);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="overflow-y-scroll pb-4">
        <Reorder.Group
          axis="y"
          as="ul"
          values={orderedTodos}
          onReorder={setOrderedTodos}
          layoutScroll
          className="px-4 overflow-y-hidden overflow-x-hidden"
        >
          <AnimatePresence>
            {orderedTodos.map((todo) => (
              <TodoDraggableItem
                key={todo.id}
                todo={todo}
                onChangeComplete={handleChangeComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        <div className="px-4">
          <Button
            className="w-full mb-2"
            theme="primary"
            size="lg"
            onClick={onClickAddTodo}
          >
            + 할 일 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompletedTodoView({
  currentDate,
  onChangeComplete,
}: {
  currentDate: Date;
  onChangeComplete: (id: Todo["id"]) => void;
}) {
  const { todos } = useTodo(currentDate);

  const [completedTodos, setCompletedTodos] = useState<Todo[]>(
    todos?.filter((todo) => todo.isCompleted) ?? []
  );

  useEffect(() => {
    setCompletedTodos(todos?.filter((todo) => todo.isCompleted) ?? []);
  }, [todos]);

  const handleChangeComplete = (e: ChangeEvent<HTMLElement>) => {
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);

    onChangeComplete(todoId);
  };

  return (
    <>
      <Reorder.Group
        axis="y"
        as="ul"
        values={completedTodos}
        onReorder={setCompletedTodos}
        layoutScroll
        className="p-4 overflow-y-scroll overflow-x-visible"
      >
        <AnimatePresence>
          {completedTodos.map((todo) => (
            <TodoDraggableItem
              key={todo.id}
              todo={todo}
              onChangeComplete={handleChangeComplete}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </>
  );
}
