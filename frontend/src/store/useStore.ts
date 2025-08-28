import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Card {
  id: string;
  title: string;
  content: string;
  order: number;
  columnId: string;
  userId: string;
}

interface Column {
  id: string;
  title: string;
  order: number;
  cards: Card[];
}

interface KanbanStore {
  currentUser: User;  // Ya no es nullable
  users: User[];
  columns: Column[];
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setColumns: (columns: Column[]) => void;
  updateCard: (card: Card) => void;
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, newOrder: number) => void;
}

// Usuario por defecto
const defaultUser: User = {
  id: '1',
  name: 'Usuario 1',
  email: 'user1@test.com'
};

export const useStore = create<KanbanStore>((set) => ({
  currentUser: defaultUser,  // Inicializado con el usuario por defecto
  users: [defaultUser],     // Lista inicial con el usuario por defecto
  columns: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => {
    // Asegurarse de que el usuario por defecto esté en la lista
    const hasDefaultUser = users.some(user => user.id === defaultUser.id);
    const updatedUsers = hasDefaultUser ? users : [defaultUser, ...users];
    set({ users: updatedUsers });
  },
  setColumns: (columns) => set({ columns }),
  updateCard: (updatedCard) =>
    set((state) => ({
      columns: state.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        ),
      })),
    })),
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, newOrder: number) =>
    set((state) => {
      // Clonar las columnas para no mutar el estado directamente
      const updatedColumns = state.columns.map(column => ({...column}));

      // Encontrar las columnas de origen y destino
      const sourceColumnIndex = updatedColumns.findIndex(col => col.id === sourceColumnId);
      const targetColumnIndex = updatedColumns.findIndex(col => col.id === targetColumnId);

      if (sourceColumnIndex === -1 || targetColumnIndex === -1) return state;

      // Encontrar la tarjeta a mover
      const cardIndex = updatedColumns[sourceColumnIndex].cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return state;

      // Extraer la tarjeta de la columna de origen
      const [movedCard] = updatedColumns[sourceColumnIndex].cards.splice(cardIndex, 1);

      // Actualizar la columna de la tarjeta
      movedCard.columnId = targetColumnId;

      // Insertar la tarjeta en la columna de destino en la posición correcta
      updatedColumns[targetColumnIndex].cards.splice(newOrder, 0, movedCard);

      // Reordenar las tarjetas en ambas columnas
      updatedColumns[sourceColumnIndex].cards = updatedColumns[sourceColumnIndex].cards
        .map((card, index) => ({...card, order: index}));
      
      updatedColumns[targetColumnIndex].cards = updatedColumns[targetColumnIndex].cards
        .map((card, index) => ({...card, order: index}));

      return { columns: updatedColumns };
    }),
}));