import {
  FC,
  useState,
  useCallback,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  useEffect,
} from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/outline";

const Grid = ({ children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, 100px)`,
        gridGap: 10,
        justifyContent: "center",
        maxWidth: "800px",
        margin: "60px auto",
      }}
    >
      {children}
    </div>
  );
};

type ItemProps = HTMLAttributes<HTMLDivElement> & {
  card: any;
  onRemove: any;
  withOpacity?: boolean;
  isDragging?: boolean;
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ card, onRemove, withOpacity, isDragging, style, ...props }, ref) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      height: "140px",
      width: "100px",
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      position: "relative",
      ...style,
    };

    return (
      <div ref={ref} style={inlineStyles} {...props} className="group">
        {!isDragging && (
          <button
            className="absolute top-1 right-1 hover:text-gray-500 group-hover:block hidden"
            onMouseDown={(e) => {
              e.stopPropagation();
              onRemove(card);
            }}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}

        <Image
          src={card.images.small}
          alt={`${card.name} Card Image`}
          height={120}
          width={80}
        />
      </div>
    );
  }
);

Item.displayName = "Item";

const SortableItem: FC<ItemProps> = (props) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default function ReorderGrid({
  cards,
  onReorder,
  onRemove,
}: {
  cards: any[];
  onReorder: any;
  onRemove: any;
}) {
  const [items, setItems] = useState(cards);
  const [activeCard, setActiveCard] = useState<any>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => setItems(cards), [cards]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveCard(items.find((i) => `${i.id}` == `${event.active.id}`));
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveCard(null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id != over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((card) => card.id == `${active.id}`);
        const newIndex = items.findIndex((card) => card.id == `${over!.id}`);
        const reorderdItems = arrayMove(items, oldIndex, newIndex);
        onReorder(reorderdItems);
        return reorderdItems;
      });
    }

    setActiveCard(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items.map(({ id }) => id)}
        strategy={rectSortingStrategy}
      >
        <Grid>
          {items.map((card, i) => (
            <SortableItem
              key={`sortable-${card.id}-${i}`}
              card={card}
              onRemove={() => onRemove(i)}
            />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeCard ? (
          <Item card={activeCard} onRemove={onRemove} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
