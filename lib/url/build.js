/**
 * Builds the requested url using the provided data.
 * @param {object} book
 * @param {string} type
 * @return {string}
 */
export default function(book, type) {
  switch (type) {
    case 'read':
      return `#/books/${type}/${book.id}`;
    case 'creator':
      return (
        '#/books/list/all?search=1&creator=' + encodeURIComponent(book.creator)
      );
  }
}
