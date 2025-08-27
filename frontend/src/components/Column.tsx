import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from './Card';

interface ColumnProps {
  id: string;
  title: string;
  cards: any[];
}

export const Column = ({ id, title, cards }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="mb-0">{title}</h5>
        </div>
        <div
          ref={setNodeRef}
          className="card-body"
          style={{ minHeight: '500px' }}
        >
          <SortableContext
            items={cards.map(card => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                content={card.content}
                userId={card.userId}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};