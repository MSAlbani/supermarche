import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
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

const Table = <T,>({ data, columns, pageSize = 10 }: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="w-full overflow-x-auto pt-5">
      <table className="min-w-full ">
        <thead className="">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left border-b border-gray-300 text-neutral-500 text-lg font-semibold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className=" border-gray-300 hover:bg-gray-200">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 text-sm">
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginatedData.length === 0 && (
        <div className="flex items-center h-52 flex-col gap-3 font-bold text-lg text-neutral-400 justify-center">
          <Loader className="w-10 h-10" />
          <p>Aucune donnée trouvée</p>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 mt-8">
        {paginatedData.length > 0 && (
          <>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="cursor-pointer hover:bg-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="cursor-pointer hover:bg-gray-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
