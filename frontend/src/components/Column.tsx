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

  console.log(`📂 Columna "${title}":`, {
    id,
    cardsCount: cards?.length || 0,
    cards: cards
  });

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
            {cards && cards.length > 0 ? (
              cards.map((card) => {
                console.log(`🃏 Renderizando tarjeta:`, card);
                return (
                  <Card
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    content={card.content}
                    userId={card.userId}
                  />
                );
              })
            ) : (
              <div className="text-muted">No hay tarjetas</div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};