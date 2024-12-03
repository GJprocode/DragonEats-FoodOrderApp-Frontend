import { Pagination, PaginationContent, 
  PaginationItem, PaginationLink, PaginationNext,
  PaginationPrevious } from "../components/ui/pagination";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = [];

  // Generate page numbers with ellipsis
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
      pageNumbers.push(i);
    } else if (i === 2 && page > 3) {
      pageNumbers.push('...'); // Ellipsis after first page
    } else if (i === pages - 1 && page < pages - 2) {
      pageNumbers.push('...'); // Ellipsis before last page
    }
  }

  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center space-x-1">
        {page !== 1 && (
          <PaginationItem key="prev">
            <PaginationPrevious
              className="px-2 py-1 text-xs border rounded-md hover:bg-gray-200"
              href="#"
              onClick={() => onPageChange(page - 1)} 
            />
          </PaginationItem>
        )}

        {pageNumbers.map((number, index) => (
          <PaginationItem key={index}>
            {typeof number === 'number' ? (
              <PaginationLink
                className={`px-2 py-1 text-xs border rounded-md ${page === number ? 'font-bold bg-gray-300' : 'hover:bg-gray-200'}`}
                href="#"
                onClick={() => onPageChange(number)}
              >
                {number}
              </PaginationLink>
            ) : (
              <span className="px-2 py-1 text-xs">{number}</span> // Render ellipsis as plain text
            )}
          </PaginationItem>
        ))}

        {page !== pages && (
          <PaginationItem key="next">
            <PaginationNext 
              className="px-2 py-1 text-xs border rounded-md hover:bg-gray-200"
              href="#" 
              onClick={() => onPageChange(page + 1)} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSelector;
