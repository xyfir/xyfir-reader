import swal from 'sweetalert';

// Action creators
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
  if (!navigator.onLine) {
    swal(
      'No Internet Connection',
      'This action requires an internet connection',
      'error'
    );
    return false;
  }

  try {
    const confirm = await swal({
      title: 'Are you sure?',
      text: `Are you sure you want to delete (${books.length}) book(s)?`,
      icon: 'warning',
      buttons: true
    });
    if (!confirm) return false;

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
