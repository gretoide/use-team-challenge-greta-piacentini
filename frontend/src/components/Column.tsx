import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from './Card';

interface ColumnProps {
  id: string;
  title: string;
  cards: Array<{
    id: string;
    title: string;
    content: string;
    userId: string;
  }>;
  onCardClick: (card: { id: string; title: string; content: string; userId: string }) => void;
}

export const Column = ({ id, title, cards, onCardClick }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });



  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-header">
          <h5 className="mb-0">{title}</h5>
        </div>
        <div
          ref={setNodeRef}
          className={`card-body ${isOver ? 'bg-light border-2 border-primary' : ''}`}
          style={{ 
            minHeight: '500px',
            transition: 'all 0.2s ease',
          }}
        >
          <SortableContext
            items={cards.map(card => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {cards && cards.length > 0 ? (
              cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  content={card.content}
                  userId={card.userId}
                  onCardClick={onCardClick}
                />
              ))
            ) : (
              <div className="text-muted">No hay tarjetas</div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};