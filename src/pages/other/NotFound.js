import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600">
        죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <button
        className="mt-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로 가기
      </button>
    </div>
  );
}
