import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import CodeMirror from '@uiw/react-codemirror';
import { xcodeLight } from '@uiw/codemirror-themes-all';
import { langs } from '@uiw/codemirror-extensions-langs';
import api from '../../../util/api';

export default function ProblemDetail() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFetch, setFetch] = useState(false);
  const [problem, setProblem] = useState({});
  const [language, setLanguage] = useState('CPP');
  const [source, setSource] = useState(`#include <iostream>

using namespace std;

int main() {
  return 0;
}`);

  useEffect(() => {
    (async () => {
      if (user) {
        const { username } = user;
        const result = await api.post('/api/auth/isAdmin', { username });

        setIsAdmin(!!result.data?.admin);
      }
    })();
    (async () => {
      const result = await api.post(`/api/problem/${problemId}`);

      setProblem(result.data);
      setFetch(true);
    })();
  }, [problemId, user]);

  const languages = [
    { value: 'C', label: 'C', ext: langs.c() },
    { value: 'CPP', label: 'C++', ext: langs.cpp() },
    { value: 'PYTHON', label: 'Python', ext: langs.python() },
    { value: 'JAVA', label: 'Java', ext: langs.java() },
  ];

  const formatTime = (time) => `${time / 1000}초`;

  const formatMemory = (memory) =>
    `${(memory / 1024).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}MB`;

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = () => {
    (async () => {
      await api.put('/api/judge/', { problemId, language, source });

      navigate('/history');
    })();
  };

  const handleRemove = () => {
    (async () => {
      await api.delete(`/api/problem/${problemId}`);

      navigate('/');
    })();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!isFetch) return <></>;

  return (
    <div className="flex p-5">
      <div className="w-1/2 relative">
        <h1 className="text-2xl font-bold">{problem?.title}</h1>
        <p className="my-4">{problem?.description}</p>

        {isAdmin && (
          <div className="absolute top-0 right-0 mt-5 mr-5">
            <button
              onClick={() => {
                navigate(`/problem/${problemId}/edit`);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              편집
            </button>

            <button
              onClick={() => openModal()}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              삭제
            </button>
          </div>
        )}

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <h2 className="text-lg font-bold">입력</h2>
        <p className="my-2">{problem?.inputDescription}</p>
        <h2 className="text-lg font-bold pt-5">출력</h2>
        <p className="my-2">{problem?.outputDescription}</p>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <div className="my-4">
          <h2 className="text-lg font-bold">예시</h2>
          {problem?.testCases
            ?.filter((testCase) => testCase.example)
            .map((testCase, index) => (
              <div key={index} className="my-2">
                <p className="mb-1 font-semibold">
                  예시
                  {index + 1}
                </p>
                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <p className="mb-1 font-semibold">입력:</p>
                    <pre>{testCase.input}</pre>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="mb-1 font-semibold">출력:</p>
                    <pre>{testCase.output}</pre>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <h2 className="text-lg font-bold mb-2">제한 사항</h2>
        <table className="border-collapse w-full">
          <tbody>
            <tr>
              <td className="py-2 pr-4 font-semibold w-36">시간 제한</td>
              <td className="py-2">{formatTime(problem.timeLimit)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-semibold w-50 w-3">메모리 제한</td>
              <td className="py-2">{formatMemory(problem.memoryLimit)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-1/2">
        <CodeMirror
          className="text-base"
          value={source}
          onChange={setSource}
          theme={xcodeLight}
          extensions={[languages.filter((l) => l.value === language)[0].ext]}
        />

        <div className="mt-4 flex justify-end">
          <select
            className="p-2 border border-gray-300 rounded mr-2"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            제출
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">문제 삭제</h2>
          <p className="text-sm">정말로 이 문제를 삭제하시겠습니까?</p>

          <div className="flex mt-4">
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={handleRemove}
            >
              확인
            </button>
            <button
              className="flex-1 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={closeModal}
            >
              취소
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
