import { useStore } from '../store/useStore';

export const UserSwitch = () => {
  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  return (
    <div className="dropdown">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {currentUser?.name || 'Seleccionar Usuario'}
      </button>
      <ul className="dropdown-menu">
        {users.map((user) => (
          <li key={user.id}>
            <button
              className="dropdown-item"
              onClick={() => setCurrentUser(user)}
            >
              {user.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
