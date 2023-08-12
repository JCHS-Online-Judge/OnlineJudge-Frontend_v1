import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../../util/api';

export default function ProblemList() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isFetch, setIsFetch] = useState(false);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
    } else {
      (async () => {
        const result = await api.post('/api/problem/list');

        setProblems(result.data);
        setIsFetch(true);
      })();
      (async () => {
        if (user) {
          const { username } = user;
          const result = await api.post('/api/auth/isAdmin', { username });

          setIsAdmin(!!result.data?.admin);
        }
      })();
    }
  }, [isLoggedIn, navigate, user]);

  if (!isFetch) return <></>;

  return (
    <div className="flex justify-center items-start pt-5 min-h-screen">
      <div className="overflow-x-auto">
        {isAdmin && (
          <div className="mt-2 mb-4 text-right">
            <Link
              to="/problem/new"
              className="px-4 py-2 text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition duration-300"
            >
              문제 추가
            </Link>
          </div>
        )}
        <table className="table-auto">
          <colgroup>
            <col style={{ width: '100px' }} />
            <col style={{ width: '300px' }} />
          </colgroup>

          <thead>
            <tr>
              <th className="border px-4 py-2">문제 번호</th>
              <th className="border px-4 py-2">문제 이름</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem) => (
              <tr key={problem.problemId}>
                <td className="border px-4 py-2">{problem.problemId}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/problem/${problem.problemId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
