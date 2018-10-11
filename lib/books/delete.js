import { deleteBooks } from 'actions/books';
import { save } from 'actions/app';

/**
 * Prompts the user to confirm that they want to delete the book(s) and then
 * deletes the book(s).
 * @async
 * @param {number[]} books
 * @param {object} App
 * @return {boolean} True if the books were deleted.
 */
export default async function(books, App) {
  try {
    if (!confirm(`Are you sure you want to delete (${books.length}) book(s)?`))
      return false;

    App.store.dispatch(deleteBooks(books));
    App.store.dispatch(save('books'));

    try {
      for (let book of books) {
        await Promise.all(
          ['cover', 'styling', 'epub', 'locations'].map(k =>
            localforage.removeItem(`${k}-${book}`)
          )
        );
      }
    } catch (err) {}

    return true;
  } catch (err) {
    swal('Error', 'Could not delete book(s)', 'error');
    console.error('lib/books/delete', err);
    return false;
  }
}
