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
        {currentUser.name}
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {users.map((user) => (
          <li key={user.id}>
            <button
              className={`dropdown-item ${currentUser.id === user.id ? 'active' : ''}`}
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