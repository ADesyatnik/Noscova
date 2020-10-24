function readMultipleFiles(evt) {
  //Retrieve all the files from the FileList object
  const files = evt.target.files;

  const p = document.getElementById('text_change');

  if (files) {
    for (var i = 0, f; (f = files[i]); i++) {
      const r = new FileReader();
      r.onload = (function (f) {
        return function (e) {
          const contents = e.target.result;
          p.innerHTML = contents;
        };
      })(f);
      r.readAsText(f, 'ansi');
    }
  } else {
    alert('Failed to load files');
  }
}

document.getElementById('fileinput').addEventListener('change', readMultipleFiles, false);
