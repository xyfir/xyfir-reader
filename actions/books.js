import * as types from 'constants/actions/books';

/** @param {number[]} ids */
export function deleteBooks(ids) {
  return {
    type: types.DELETE_BOOKS,
    ids
  };
}

/** @param {object[]} books */
export function loadBooks(books) {
  return {
    type: types.LOAD_BOOKS,
    books
  };
}

/**
 * @param {number} id
 * @param {object} obj
 */
export function updateBook(id, obj) {
  return {
    type: types.UPDATE_BOOK,
    id,
    obj
  };
}
