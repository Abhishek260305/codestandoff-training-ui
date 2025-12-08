'use client';

export default function Training() {
  return (
    <div className="p-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Training</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-700">Available Courses</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Data Structures & Algorithms</li>
              <li>Dynamic Programming</li>
              <li>Graph Algorithms</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-700">Progress</h3>
            <p className="text-gray-600">Start your training journey!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

