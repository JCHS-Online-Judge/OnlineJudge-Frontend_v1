import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import api from '../../../util/api';

export default function AddProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [problemId_, setProblemId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [outputDescription, setOutputDescription] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [timeLimit, setTimeLimit] = useState(1000);
  const [memoryLimit, setMemoryLimit] = useState(128);

  const [error, setError] = useState('');
  const [isProcessing, setProcessing] = useState(false);

  useEffect(() => {
    if (problemId) {
      (async () => {
        const { data } = await api.post(`/api/problem/${problemId}`);
        setIsEditing(true);

        setProblemId(data.problemId);
        setTitle(data.title);
        setDescription(data.description);
        setInputDescription(data.inputDescription);
        setOutputDescription(data.outputDescription);
        setTestCases(data.testCases);
        setTimeLimit(data.timeLimit);
        setMemoryLimit(data.memoryLimit);
      })();
    }
  }, [problemId]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', example: false }]);
  };

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = [...testCases];
    updatedTestCases.splice(index, 1);
    setTestCases(updatedTestCases);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const handleExampleCheck = (index, isChecked) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index].example = isChecked;
    setTestCases(updatedTestCases);
  };

  const handleSubmit = () => {
    (async () => {
      setProcessing(true);
      setError('');

      try {
        const method = problemId ? api.patch : api.put;
        const url = problemId ? `/api/problem/${problemId}` : '/api/problem/';

        await method(url, {
          problemId: problemId_,
          title,
          description,
          inputDescription,
          outputDescription,
          testCases,
          timeLimit,
          memoryLimit,
        });

        navigate(`/problem/${problemId_}`);
      } catch (e) {
        if (e instanceof AxiosError) {
          const { error } = e.response.data;

          if (error) {
            setError(error);
          } else {
            setError(e.message);
          }
        } else {
          setError(e.message);
        }
      }

      setProcessing(false);
    })();
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? '문제 수정' : '문제 추가'}
      </h1>

      <label className="block mb-2">
        문제 번호
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={problemId_}
          onChange={(e) => setProblemId(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        문제 이름
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        문제 설명
        <textarea
          className="border rounded p-2 w-full h-40"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        입력 설명
        <textarea
          className="border rounded p-2 w-full h-20"
          value={inputDescription}
          onChange={(e) => setInputDescription(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        출력 설명
        <textarea
          className="border rounded p-2 w-full h-20"
          value={outputDescription}
          onChange={(e) => setOutputDescription(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        테스트케이스
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
          onClick={handleAddTestCase}
        >
          + 추가
        </button>
      </label>

      {testCases.map((testCase, index) => (
        <div key={index} className="border p-2 mb-2">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded float-right"
            onClick={() => handleRemoveTestCase(index)}
          >
            삭제
          </button>
          <p className="font-semibold">
            테스트케이스
            {index + 1}
          </p>
          <label>
            예제:&nbsp;
            <input
              type="checkbox"
              checked={testCase.example}
              onChange={(e) => handleExampleCheck(index, e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
          </label>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <label className="block mb-1">입력</label>
              <textarea
                className="border rounded p-2 w-full h-10"
                value={testCase.input}
                onChange={(e) =>
                  handleTestCaseChange(index, 'input', e.target.value)
                }
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block mb-1">출력</label>
              <textarea
                className="border rounded p-2 w-full h-10"
                value={testCase.output}
                onChange={(e) =>
                  handleTestCaseChange(index, 'output', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <label className="block mb-2">
        시간 제한
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        메모리 제한
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={memoryLimit}
          onChange={(e) => setMemoryLimit(e.target.value)}
        />
      </label>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className={`bg-${
          isProcessing ? 'gray-400' : 'blue-500'
        } text-white px-4 py-2 rounded mt-4`}
        disabled={isProcessing}
        onClick={handleSubmit}
      >
        {isEditing ? '수정' : '추가'}
      </button>
    </div>
  );
}
