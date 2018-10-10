import * as types from 'constants/actions/books';

export default function(state, action) {
  switch (action.type) {
    case types.LOAD_BOOKS:
      return action.books;

    case types.DELETE_BOOKS:
      return state.filter(book => action.ids.indexOf(book.id) == -1);

    case types.UPDATE_BOOK:
      return (() => {
        let temp = state.slice(0);

        temp.forEach((book, i) => {
          if (action.id == book.id) {
            temp[i] = Object.assign({}, book, action.obj);
          }
        });

        return temp;
      }).call();

    default:
      return state;
  }
}
