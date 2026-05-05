import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-neutral-600 mb-6">
        You do not have permission to access this page.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;