import { useState } from 'react';
import { useCardAuthor } from '../hooks/useCardAuthor';
import { EditCardForm } from './EditCardForm';

interface CardSidebarProps {
  card: {
    id: string;
    title: string;
    content: string;
    userId: string;
  } | null;
  onClose: () => void;
  onEdit?: (card: { id: string; title: string; content: string; userId: string }) => void;
  onDelete?: (cardId: string) => void;
}

export const CardSidebar = ({ card, onClose, onEdit, onDelete }: CardSidebarProps) => {
  if (!card) return null;

  const [isEditing, setIsEditing] = useState(false);
  const { cardAuthor, isOwnCard } = useCardAuthor(card.userId);

  return (
    <div 
      className="position-fixed top-0 end-0 h-100 bg-white shadow"
      style={{ 
        width: '400px',
        transform: card ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1050
      }}
    >
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Detalles de la Tarjeta</h4>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>

        {isEditing ? (
          <EditCardForm
            card={card}
            onSave={(updatedCard) => {
              if (onEdit) {
                onEdit(updatedCard);
                setIsEditing(false);
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="mb-4">
              <h5>Título</h5>
              <p className="lead">{card.title}</p>
            </div>

            <div className="mb-4">
              <h5>Contenido</h5>
              <p style={{ whiteSpace: 'pre-wrap' }}>{card.content}</p>
            </div>

            <div className="mb-4">
              <h5>Autor</h5>
              {cardAuthor && (
                <span
                  className={`badge ${isOwnCard ? 'bg-primary' : 'bg-secondary'}`}
                >
                  {cardAuthor.name}
                </span>
              )}
            </div>

            <div className="d-flex gap-2 justify-content-end mt-5">
              {onEdit && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setIsEditing(true)}
                  title="Editar tarjeta"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
                      onDelete(card.id);
                      onClose();
                    }
                  }}
                  title="Eliminar tarjeta"
                >
                  <i className="bi bi-trash me-2"></i>
                  Eliminar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};