fetch('http://127.0.0.1:3000/api/services')
  .then(res => res.text())
  .then(txt => console.log('RESPONSE:', txt))
  .catch(err => console.error('ERROR:', err));
