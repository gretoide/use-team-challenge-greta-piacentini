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
  currentUser: User | null;
  users: User[];
  columns: Column[];
  setCurrentUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setColumns: (columns: Column[]) => void;
  updateCard: (card: Card) => void;
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, newOrder: number) => void;
}

export const useStore = create<KanbanStore>((set) => ({
  currentUser: null,
  users: [],
  columns: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setUsers: (users) => set({ users }),
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
  moveCard: (cardId, sourceColumnId, targetColumnId, newOrder) =>
    set((state) => {
      const card = state.columns
        .find((col) => col.id === sourceColumnId)
        ?.cards.find((c) => c.id === cardId);

      if (!card) return state;

      const updatedCard = { ...card, columnId: targetColumnId, order: newOrder };

      return {
        columns: state.columns.map((column) => ({
          ...column,
          cards:
            column.id === sourceColumnId
              ? column.cards.filter((c) => c.id !== cardId)
              : column.id === targetColumnId
              ? [...column.cards, updatedCard].sort((a, b) => a.order - b.order)
              : column.cards,
        })),
      };
    }),
}));
