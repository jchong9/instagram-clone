function getPagination(totalPages, currPage) {
  const pageNumbers = [];
  const siblingCount = 2; // Number of pages to show on either side of the current page
  const totalDisplayedPages = siblingCount * 2 + 5; // Including first, last, current, and 2 possible ellipses

  // Show all pages if total is within the limit
  if (totalPages <= totalDisplayedPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  // Always show the first and last pages
  pageNumbers.push(1);
  const start = Math.max(2, currPage - siblingCount);
  const end = Math.min(totalPages - 1, currPage + siblingCount);

  if (start > 2) pageNumbers.push('...');
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }
  if (end < totalPages - 1) pageNumbers.push('...');
  pageNumbers.push(totalPages);

  return pageNumbers;
}

export default function Pagination({ totalPages, currPage, handlePageChange }) {
  const pages = getPagination(totalPages, currPage);

  return (
    <div className="page-navigator d-flex justify-content-between mb-4">
      <ul className="pagination">
        <li className={currPage === 1 ? "page-item disabled" : "page-item"}>
          <button className="page-link"
                  onClick={() => handlePageChange(currPage - 1)}
                  disabled={currPage === 1}>
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </button>
        </li>
        {pages.map((page, index) => (
          <li
            className={
              page === currPage
                ? "page-item active"
                : page === '...'
                  ? "page-item disabled"
                  : "page-item"
            }
            key={index}
          >
            {page === '...' ? (
              <span className="page-link">{page}</span>
            ) : (
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li className={currPage === totalPages ? "page-item disabled" : "page-item"}>
          <button className="page-link"
                  onClick={() => handlePageChange(currPage + 1)}
                  disabled={currPage === totalPages}>
            <span className="sr-only">Next</span>
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </div>
  );

}