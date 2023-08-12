import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import api, { setToken } from '../../util/api';
import { login } from '../../redux/actions/loginActions';

export default function Login() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setProcessing(true);
    setError('');

    try {
      const result = await api.post('/api/auth/', { username, password });

      const token = result.data?.token;

      if (token) {
        setToken(token);
        dispatch(login({ username, token }));
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        const { error } = e.response.data;

        if (error) {
          setError(error === 'Bad credentials' ? '잘못된 계정입니다.' : error);
        } else {
          setError(e.message);
        }
      } else {
        setError(e.message);
      }
    }

    setProcessing(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">로그인</h1>
      <form
        className="mx-auto max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            사용자 이름
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className={`w-full bg-${
            isProcessing ? 'gray-400' : 'blue-500'
          } text-white font-bold py-2 px-4 rounded hover:bg-${
            isProcessing ? 'gray-400' : 'blue-700'
          } focus:outline-none focus:shadow-outline`}
          disabled={isProcessing}
        >
          로그인
        </button>
        <p className="mt-4">
          아직 회원이 아니신가요?{' '}
          <Link to="/user/register" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
