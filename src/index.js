Array.prototype.unique = function () {
  let arr = [];
  for (let i = 0; i < this.length; i++) {
    if (!arr.includes(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}

function readMultipleFiles(evt) {
  //Retrieve all the files from the FileList object
  const files = evt.target.files;
  const p = document.getElementById('text_change');

  if (files) {
    for (var i = 0, f;
      (f = files[i]); i++) {
      const r = new FileReader();
      r.onload = (function (f) {
        return function (e) {
          const contents = e.target.result;
          p.innerHTML = contents;
          const data = contents.split(';')
          const plate = data.map(item => {
            const nodeRow = item.split(' ').filter(i => i);
            const nodeName = nodeRow[0].trim();
            const components = nodeRow.splice(1);

            return {
              name: nodeName,
              components: components.map(component => ({
                name: component.split('(')[0],
                nodeName,
                output: component.split('(')[1].replace(')', '').replace("'", '')
              })),
            }
          })

          const allNodesNames = plate.map(node => node.name)
          const allComponentsNames = plate
            .map(node => node.components.map(component => component.name))
            .flat()
            .unique()

          const QMatrix = math.matrix(math.zeros([allNodesNames.length, allComponentsNames.length]))
        };
      })(f);
      r.readAsText(f, 'ansi');
    }
  } else {
    alert('Failed to load files');
  }
}

document.getElementById('fileinput').addEventListener('change', readMultipleFiles, false);