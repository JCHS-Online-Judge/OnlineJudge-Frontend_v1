import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import { FaJava, FaPython } from 'react-icons/fa6';
import { xcodeLight } from '@uiw/codemirror-themes-all';
import { langs } from '@uiw/codemirror-extensions-langs';
import CodeMirror from '@uiw/react-codemirror';
import { useSelector } from 'react-redux';
import api, { host } from '../../../util/api';

const ws = new WebSocket(`ws://${host}/api/ws/history`);

export default function History() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const [results, setResults] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitme] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalRaw, setModalRaw] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
    } else {
      (async () => {
        const { data } = await api.post('/api/judge/history');

        setResults(data);
        setIsFetch(true);
      })();
    }
  }, [isLoggedIn, navigate]);

  ws.onmessage = function (e) {
    const data = JSON.parse(e.data);

    setResults(
      results.map((item) => {
        if (item.judgeId === data.id) {
          item = {
            ...item,
            result: data.result,
          };
        }

        return item;
      }),
    );
  };

  const openModal = (title, message) => {
    setModalIsOpen(true);
    setModalRaw(null);
    setModalMessage(message);
    setModalTitme(title);
  };

  const openModalRaw = (title, raw) => {
    setModalIsOpen(true);
    setModalRaw(raw);
    setModalTitme(title);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalMessage('');
  };

  const renderLanguageIcon = (language) => {
    switch (language) {
      case 'C':
        return 'C';
      case 'CPP':
        return 'C++';
      case 'PYTHON':
        return <FaPython size={20} />;
      case 'JAVA':
        return <FaJava size={20} />;
      default:
        return language;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}일 ${hours}시 ${minutes}분`;
  };

  const renderResult = (result) => {
    let style = '';
    let text = '';

    switch (result.type) {
      case 'WAITING':
        style = 'text-gray-500';
        text = '대기중';
        break;
      case 'PROCESSING':
        style = 'text-blue-500';
        text = `채점중 (${result.message})`;
        break;
      case 'COMPILE_ERROR':
        style = 'text-red-500';
        text = '컴파일 오류';
        break;
      case 'RUNTIME_ERROR':
        style = 'text-red-500';
        text = '런타임 오류';
        break;
      case 'TIME_LIMIT':
        style = 'text-red-500';
        text = '시간초과';
        break;
      case 'MEMORY_LIMIT':
        style = 'text-red-500';
        text = '메모리초과';
        break;
      case 'WRONG_ANSWER':
        style = 'text-red-500';
        text = '오답';
        break;
      case 'CORRECT':
        style = 'text-green-500';
        text = '정답';
        break;
      default:
        break;
    }

    return (
      <span
        className={style}
        onClick={() => {
          if (result.type?.endsWith('ERROR') && result.message) {
            openModal('오류', result.message);
          }
        }}
        style={{
          cursor:
            result.type?.endsWith('ERROR') && result.message
              ? 'pointer'
              : 'auto',
        }}
      >
        {text}
      </span>
    );
  };

  const formatTime = (time) => `${time} ms`;

  const formatMemory = (memory) =>
    `${memory.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} KB`;

  const renderSource = (src, srcLength, lang) => {
    const text = `${srcLength
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} KB`;

    return (
      <span
        className={src ? 'text-blue-500 hover:underline' : ''}
        onClick={() => {
          if (src) {
            openModalRaw(
              '코드',
              <CodeMirror
                className="text-base"
                value={src}
                theme={xcodeLight}
                extensions={[
                  lang === 'C'
                    ? langs.c()
                    : lang === 'CPP'
                    ? langs.cpp()
                    : lang === 'PYTHON'
                    ? langs.python()
                    : langs.java(),
                ]}
              />,
            );
          }
        }}
        style={{ cursor: src ? 'pointer' : 'auto' }}
      >
        {text}
      </span>
    );
  };

  if (!isFetch) return <></>;

  return (
    <div className="flex justify-center items-start pt-5 pb-5 min-h-screen">
      <div className="overflow-x-auto">
        <table className="table-auto">
          <colgroup>
            <col style={{ width: '200px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '125px' }} />
            <col style={{ width: '125px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '100px' }} />
          </colgroup>

          <thead>
            <tr>
              <th className="border px-4 py-2">사용자</th>
              <th className="border px-4 py-2">문제 번호</th>
              <th className="border px-4 py-2">언어</th>
              <th className="border px-4 py-2">결과</th>
              <th className="border px-4 py-2">소스 코드</th>
              <th className="border px-4 py-2">제출 시간</th>
              <th className="border px-4 py-2">실행 시간</th>
              <th className="border px-4 py-2">메모리</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{result.username}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/problem/${result.problemId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {result.problemId}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  {renderLanguageIcon(result.language)}
                </td>
                <td className="border px-4 py-2">
                  {renderResult(result.result)}
                </td>
                <td className="border px-4 py-2">
                  {renderSource(
                    result.source,
                    result.sourceLength,
                    result.language,
                  )}
                </td>
                <td className="border px-4 py-2">
                  <a
                    className="text-blue-500 hover:underline"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      openModal('채점 ID', result.judgeId);
                    }}
                  >
                    {formatDate(result.at)}
                  </a>
                </td>
                <td className="border px-4 py-2">
                  {result.result.type === 'CORRECT'
                    ? formatTime(result.result.time)
                    : '-'}
                </td>
                <td className="border px-4 py-2">
                  {result.result?.type === 'CORRECT'
                    ? formatMemory(result.result.memory)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalIsOpen}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">{modalTitle}</h2>
          {modalRaw || (
            <div className="text-sm">
              {modalMessage.split('\n').map((line, index) => (
                <div key={index}>{line.replace(/ /g, '\u00A0')}</div>
              ))}
            </div>
          )}

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
}
