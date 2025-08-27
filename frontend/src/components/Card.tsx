import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';

interface CardProps {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export const Card = ({ id, title, content, userId }: CardProps) => {
  const currentUser = useStore((state) => state.currentUser);
  const isOwnCard = currentUser?.id === userId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card mb-2 ${isOwnCard ? 'border-primary' : ''}`}
    >
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text small">{content}</p>
        {isOwnCard && (
          <span className="badge bg-primary">Mi tarjeta</span>
        )}
      </div>
    </div>
  );
};