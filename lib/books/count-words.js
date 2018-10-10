import JSZip from 'jszip';

// Modules
import loadBook from 'lib/books/load';

// Actions
import { updateBook } from 'actions/books';
import { save } from 'actions/app';

/**
 * Calculates and saves the book's word count if not already calculated.
 * @async
 * @param {object} App
 * @param {object} book
 * @return {number}
 */
export default async function(App, book) {
  let count = 0;

  // Load / read contents of file
  const zip = new JSZip();
  await zip.loadAsync(await loadBook(App, book));

  // Used to render each chapter
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Loop through all files in book
  for (let file in zip.files) {
    // Ignore non-html-variant files
    if (!/html$/.test(file.split('.').slice(-1)[0])) continue;

    // Set HTML to frame
    iframe.contentDocument.documentElement.innerHTML = await zip.files[
      file
    ].async('string');

    // Count text, not HTML
    count += iframe.contentDocument.body.innerText.split(/\s+/).length;
  }

  iframe.remove();

  // Update `words` in local library
  App.store.dispatch(updateBook(book.id, { words: count }));
  App.store.dispatch(save('books'));

  App._alert(`${count} words counted`);
  return count;
}
