export default function getTSV(url) {
  function stupidParseTSV(tsv) {
    // split the lines apart
    let lines = tsv.split('\r\n').map(line => {
      return line.replace(/"/g, '').split('\t');
    });

    // pull the header off the top
    let headers = lines.shift();

    // turn the array into an object
    return lines.map(line => {
      let out = {};
      headers.forEach((h, i) => {
        out[h] = line[i];
      });
      return out;
    });
  }

  return fetch(url, { method: 'GET' })
    .then(response => response.text())
    .then(tsv => stupidParseTSV(tsv));
}
