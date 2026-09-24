document.getElementById('convertBtn').addEventListener('click', () => {
  const input = document.getElementById('inputText').value.toLowerCase();
  const result = input
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0) - 96; // a=1
      return (code >= 1 && code <= 26) ? code : ch;
    })
    .join(' ');

  document.getElementById('outputText').textContent = result || '—';
  document.getElementById('outputWrap').classList.remove('hidden');
});
