/**
 * Obtain the `FileEntry` object for a specific file.
 * @async
 * @param {string} fileName
 * @return {FileEntry}
 */
function getFileEntry(fileName) {
  return new Promise((resolve, reject) =>
    window.requestFileSystem(window.PERSISTENT, 0, fs =>
      fs.root.getFile(
        fileName,
        // Creates a new file or returns already existing
        // `exclusive: false` lets us overwrite the file later if we want
        { create: true, exclusive: false },
        fileEntry => resolve(fileEntry),
        err => reject(err)
      ),
      err => reject(err)
    )
  );
}

/**
 * Write text to a file.
 * @async
 * @param {string} fileName
 * @param {string} text
 * @return {FileEntry}
 */
function writeFile(fileName, text) {
  return new Promise(async (resolve, reject) => {
    const fileEntry = await getFileEntry(fileName);

    fileEntry.createWriter(fileWriter => {
      fileWriter.onwriteend = () => resolve(fileEntry);
      fileWriter.onerror = err => reject(err);
      fileWriter.write(new Blob([text], { type: 'text/plain' }));
    });
  });
}

/**
 * Read text from a file.
 * @async
 * @param {string} fileName
 * @return {string}
 */
function readFile(fileName) {
  return new Promise(async (resolve, reject) => {
    const fileEntry = await getFileEntry(fileName);

    fileEntry.file(file => {
      const reader = new FileReader;
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(file);
    }, err => reject(err));
  });
}

/**
 * Called once Cordova APIs are available to use.
 */
async function onDeviceReady() {
  console.log('Device is ready');

  window.StatusBar.hide();

  // const URL = 'http://192.168.0.11:2080';
  // const DEV = 'http://192.168.0.11:1337/vorlon.js';
  const URL = 'https://books.xyfir.com';
  const DEV = false;

  // Load development script
  if (DEV) {
    console.log('Loading dev script');

    const script = document.createElement('script');
    script.src = DEV;
    document.head.appendChild(script);
  }

  let js, css, version;

  try {
    console.log('Reading local files');

    // Attempt to load files from local storage
    [js, css, version] = await Promise.all([
      readFile('app.js'),
      readFile('app.css'),
      readFile('version.txt')
    ]);
  }
  catch (err) {
    console.error('Could not read file(s)', err);
  }

  // Check if needed files are available or if they can be obtained
  if ((!js || !css) && !navigator.onLine) {
    !js && console.error('Missing JS');
    !css && console.error('Missing CSS');

    return location.href = 'no-internet.html';
  }

  // Download new files if local version does not match remote version
  // or if certain files are missing
  try {
    console.log('Checking current remote version');

    let res = await fetch(`${URL}/api/version`);
    res = await res.text();

    // Download new versions
    if (res != version) {
      version = res;

      console.log('Downloading new files');

      res = await Promise.all([
        fetch(`${URL}/static/js/App.js`),
        fetch(`${URL}/static/css/app.css`)
      ]),
      res = await Promise.all([
        res[0].text(),
        res[1].text()
      ]);

      js = res[0], css = res[1], res = null;

      // Write new files to local storage
      console.log('Writing new files');

      writeFile('app.js', js);
      writeFile('app.css', css);
      writeFile('version.txt', version);
    }
  }
  // Do nothing, use old version
  catch (err) {
    console.error('Could not download/write files', err);
  }

  // Insert files
  console.log('Inserting files', css.length, js.length);

  const link = document.createElement('link');
  link.href = window.URL.createObjectURL(
    new Blob([css], { type: 'text/css' })
  );
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = window.URL.createObjectURL(
    new Blob([js], { type: 'text/javascript' })
  );
  document.head.appendChild(script);
}

document.addEventListener('deviceready', onDeviceReady, false);