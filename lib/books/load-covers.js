/** Loads covers for img.cover elements on the page. */
function loadCovers() {
  document.querySelectorAll('img.cover').forEach(img => {
    const id = img.id.split('-')[1];
    localforage.getItem(`cover-${id}`).then(cover => {
      document.getElementById(img.id).src = URL.createObjectURL(cover);
    });
  });
}
