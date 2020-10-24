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
  const $QMatrix = document.querySelector('#q-matrix')
  const $RMatrix = document.querySelector('#r-matrix')
  $QMatrix.innerHTML = ''
  $RMatrix.innerHTML = ''

  if (files) {
    for (var i = 0, f;
      (f = files[i]); i++) {
      const r = new FileReader();
      r.onload = (function (f) {
        return function (e) {
          const contents = e.target.result.trim();
          p.innerHTML = contents;
          const data = contents.split(';')
          const plate = data.map(item => {
            if (item) {
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
            }
          }).filter(t=>t)

          const allNodesNames = plate.map(node => node.name).filter(t=>t)
          const allComponentsNames = plate
            .map(node => node.components.map(component => component.name))
            .flat()
            .unique()

          const QMatrix = math.matrix(math.zeros([allComponentsNames.length, allNodesNames.length]))

          plate.forEach((node, j) => {
            node.components.forEach((component) => {

              const i = allComponentsNames.indexOf(component.name);
              QMatrix._data[i][j] = 1
            })
          });
          const RMatrix = math.multiply(QMatrix, math.transpose(QMatrix))
          RMatrix._data.forEach((_, index) => {
            RMatrix._data[index][index] = 0
          })

          QMatrix.forEach(el => {
            const $cell = document.createElement('div')
            $cell.className = 'cell'
            $cell.innerHTML = el
            $QMatrix.appendChild($cell)
          })

          RMatrix.forEach(el => {
            const $cell = document.createElement('div')
            $cell.className = 'cell'
            $cell.innerHTML = el
            $RMatrix.appendChild($cell)
          })
          $QMatrix.setAttribute('style', `grid-template-columns: repeat(${QMatrix._size[0]-1},1fr);`) 
          $RMatrix.setAttribute('style', `grid-template-columns: repeat(${RMatrix._size[0]},1fr);`) 
        };
      })(f);
      r.readAsText(f, 'ansi');
    }
  } else {
    alert('Failed to load files');
  }
}

document.getElementById('fileinput').addEventListener('change', readMultipleFiles, false);