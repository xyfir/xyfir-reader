/**
 * Find and return books that match the search query.
 * @param {object[]} books
 * @param {string} query
 * @return {object[]}
 */
export default function(books, query) {
  if (query == '') return books;

  const fieldSearch = /\b(\w+:\w+)\b/.test(query);
  query = query
    .toLowerCase()
    // Split at space but NOT spaces between ""
    .split(/\s(?=(?:[^"]*(["])[^"]*\1)*[^"]*$)/)
    // Remove empty
    .filter(q => (q || '').length > 1);

  return books.filter(book => {
    const matches = [];

    // Search specific fields
    if (fieldSearch) {
      query.forEach(s => {
        s = s.replace(/"/g, '');
        const index = s.indexOf(':');
        const field = s.substring(0, index);
        const value = s.substring(index + 1);

        if (!value.length) return;

        if (book[field] === undefined) {
          matches.push(false);
        } else if (
          book[field]
            .toString()
            .toLowerCase()
            .indexOf(value) > -1
        ) {
          matches.push(true);
        }
      });
    }
    // Treat each word as its own search in both title and creator fields
    // Only match if each word has a match either in title or creator
    else {
      query.forEach(s => {
        if (book.title.toLowerCase().indexOf(s) > -1) matches.push(true);
        else if (book.creator.toLowerCase().indexOf(s) > -1) matches.push(true);
        else matches.push(false);
      });
    }

    return query.length == matches.length && matches.findIndex(m => !m) == -1;
  });
}
