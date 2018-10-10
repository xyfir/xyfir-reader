/**
 * Loads a book's EPUB file from local storage or from the remote library.
 * @async
 * @param {object} App
 * @param {object} book
 * @throws {string}
 * @return {Blob}
 */
export default async function(App, book) {
  try {
    let hasEpub = false;
    book.formats.forEach(format => {
      if (format.split('.').slice(-1)[0] == 'epub') {
        (hasEpub = true), (url += format);
      }
    });

    // We can only read epub files
    if (!hasEpub) throw 'EPUB file missing';

    // Attempt to load epub file, either locally or remotely
    const blob = await localforage.getItem(`epub-${book.id}`);
    if (!blob) throw 'Missing file';

    return blob;
  } catch (err) {
    App._alert(err);
    throw err;
  }
}
