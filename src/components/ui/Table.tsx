import { useState, type ReactNode } from "react";

interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

const Table = <T,>({ data, columns, pageSize = 5 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left border-b border-gray-300 text-sm font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-300 hover:bg-gray-50"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-sm">
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Précédent
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Table;
