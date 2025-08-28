import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';

interface CardProps {
  id: string;
  title: string;
  content: string;
  userId: string;
  onCardClick: (card: { id: string; title: string; content: string; userId: string }) => void;
}

export const Card = ({ id, title, content, userId, onCardClick }: CardProps) => {
  const currentUser = useStore((state) => state.currentUser);
  const users = useStore((state) => state.users);
  
  // Buscar el nombre del usuario que creó la tarjeta
  const cardAuthor = users.find(user => user.id === userId);
  
  const isOwnCard = currentUser?.id === userId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card mb-2 ${isOwnCard ? 'border-primary' : ''}`}
    >
            <div 
        className="card-body"
        onClick={(e) => {
          e.stopPropagation();
          onCardClick({ id, title, content, userId });
        }}
        style={{ cursor: 'pointer' }}
      >
        <h6 className="card-title">{title}</h6>
        <p className="card-text small text-truncate">{content}</p>
        <div className="d-flex justify-content-between align-items-center">
          {cardAuthor && (
            <span
              className={`badge ${isOwnCard ? 'bg-primary' : 'bg-secondary'}`}
            >
              {cardAuthor.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};