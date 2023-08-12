import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/loginActions';
import api from '../util/api';

export default function Header() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const user = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      if (user) {
        const { username } = user;
        const result = await api.post('/api/auth/isAdmin', { username });

        setIsAdmin(!!result.data?.admin);
      }
    })();
  }, [user]);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <header className="bg-gray-800 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-white text-lg font-semibold">
            Online Judge
          </Link>
          <nav className="ml-6 space-x-4">
            <Link to="/problem/list" className="text-white">
              문제
            </Link>

            <Link to="/history" className="text-white">
              채점결과
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          {!isLoggedIn ? (
            <Link to="/user/login" className="text-white">
              로그인
            </Link>
          ) : (
            <div className="relative ml-4">
              <button
                className={isAdmin ? 'font-bold text-red-500' : 'text-white'}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username}
              </button>
              {showDropdown && (
                <ul className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32">
                  <li>
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
