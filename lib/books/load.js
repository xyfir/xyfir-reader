/**
 * Loads a book's EPUB file.
 * @async
 * @param {object} App
 * @param {object} book
 * @throws {string}
 * @return {Blob}
 */
export default async function(App, book) {
  try {
    const blob = await localforage.getItem(`epub-${book.id}`);
    if (!blob) throw 'Missing file';
    return blob;
  } catch (err) {
    App._alert(err);
    throw err;
  }
}
