import { useStore } from '../store/useStore';

export const useCardAuthor = (userId: string) => {
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);

  const cardAuthor = users.find(user => user.id === userId);
  const isOwnCard = currentUser.id === userId; // Ya no es opcional porque siempre hay un usuario

  return {
    cardAuthor,
    isOwnCard
  };
};