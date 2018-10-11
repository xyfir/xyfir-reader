/**
 * Sorts the books object array.
 * @param {object[]} books
 * @param {string} field
 * @param {boolean} asc
 * @returns {object[]}
 */
export default function(books, field, asc) {
  field = field == 'added' ? 'id' : field;

  return books.slice(0).sort((a, b) => {
    if (a[field] < b[field]) {
      return asc ? -1 : 1;
    } else if (a[field] > b[field]) {
      return asc ? 1 : -1;
    }
    // If same authors, sort by title
    else if (field == 'authors' || field == 'authors_sort') {
      if (a.title < b.title) return -1;
      else if (a.title > b.title) return 1;
      else return 0;
    } else {
      return 0;
    }
  });
}
