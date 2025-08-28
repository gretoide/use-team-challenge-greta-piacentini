import { useState } from 'react';

interface EditCardFormProps {
  card: {
    id: string;
    title: string;
    content: string;
    userId: string;
  };
  onSave: (card: { id: string; title: string; content: string; userId: string }) => void;
  onCancel: () => void;
}

export const EditCardForm = ({ card, onSave, onCancel }: EditCardFormProps) => {
  const [title, setTitle] = useState(card.title);
  const [content, setContent] = useState(card.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...card,
      title: title.trim(),
      content: content.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="form-label">Contenido</label>
        <textarea
          className="form-control"
          id="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!title.trim()}
        >
          Guardar
        </button>
      </div>
    </form>
  );
};
