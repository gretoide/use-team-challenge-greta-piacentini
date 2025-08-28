import { useState } from 'react';
import { useStore } from '../store/useStore';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const socket = io('http://localhost:3000');

interface AddCardButtonProps {
  columnId: string;
  columnOrder: number;
}

export const AddCardButton = ({ columnId, columnOrder }: AddCardButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { currentUser } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Por favor selecciona un usuario primero');
      return;
    }

    socket.emit('createCard', {
      title: title.trim(),
      content: content.trim(),
      columnId,
      userId: currentUser.id,
      order: columnOrder // Se agregará al final de la columna
    }, (response: any) => {
      if (response.success) {
        toast.success('Tarjeta creada');
        // Limpiar formulario
        setTitle('');
        setContent('');
        setIsAdding(false);
      } else {
        toast.error(response.error || 'Error al crear la tarjeta');
      }
    });
  };

  if (!isAdding) {
    return (
      <button
        className="btn btn-outline-primary btn-sm w-100 mt-2"
        onClick={() => {
          if (!currentUser) {
            toast.error('Por favor selecciona un usuario primero');
            return;
          }
          setIsAdding(true);
        }}
      >
        <i className="bi bi-plus-lg"></i> Agregar tarjeta
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="card">
        <div className="card-body">
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="form-control form-control-sm mb-2"
            placeholder="Contenido (opcional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!title.trim()}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};