interface CardSidebarProps {
  card: {
    id: string;
    title: string;
    content: string;
    userId: string;
  } | null;
  onClose: () => void;
}

export const CardSidebar = ({ card, onClose }: CardSidebarProps) => {
  if (!card) return null;

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

        <div className="mb-4">
          <h5>Título</h5>
          <p className="lead">{card.title}</p>
        </div>

        <div className="mb-4">
          <h5>Contenido</h5>
          <p style={{ whiteSpace: 'pre-wrap' }}>{card.content}</p>
        </div>
      </div>
    </div>
  );
};
