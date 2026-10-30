// Book content. A row: [keys, function, options]
//   keys: tokens separated by spaces; "|" separates alternatives ("أو").
//   options: { star: true } (one of the 5 key shortcuts of the chapter),
//            { tag: 'Tahoe' } (differs between macOS versions, one word)
// A group may end with { alert: '...' } — a note in the alert colour.

const BOOK = {
  title: 'كل اختصارات ماكبوك',
  sub: 'في مكان واحد',
  author: 'د. سفيان مرابطي',
};

const OTHER_BOOKS = [
  { cover: 'covers/word.jpg',            title: 'حتى لو كنت من قوم ثمود ستفهم برنامج وورد' },
  { cover: 'covers/excel-vba.jpg',       title: 'الإبداع مع Excel VBA' },
  { cover: 'covers/excel-functions.jpg', title: 'موسوعة دوال إكسل – الجزء 1' },
  { cover: 'covers/excel-shortcuts.jpg', title: 'الفأرة أكلها القط — كل اختصارات إكسل' },
  { cover: 'covers/word-shortcuts.jpg',  title: 'دليل اختصارات برنامج وورد' },
  { cover: 'covers/research.jpg',        title: 'من الفكرة إلى النشر — منهجية البحث العلمي' },
  { cover: 'covers/python.jpg',          title: 'برمجة بايثون كأن لم تعرفها من قبل' },
  { cover: 'covers/computer.jpg',        title: 'كل ما يعرفه المحترفون عن الحاسوب' },
  { cover: 'covers/english-claudio.jpg', title: 'تعلم الإنجليزية مع Claudio' },
  { cover: 'covers/shortcuts-wiki.jpg',  title: 'موسوعة الاختصارات — Wiki Shortcuts' },
];
const BOOKS_URL = 'https://merabti.com/books.html';

const SOCIAL = [
  { name: 'Facebook',  url: 'https://facebook.com/DrMerabti',              show: 'facebook.com/DrMerabti' },
  { name: 'Instagram', url: 'https://instagram.com/DrMerabti',             show: 'instagram.com/DrMerabti' },
  { name: 'YouTube',   url: 'https://youtube.com/mrmerabti',               show: 'youtube.com/mrmerabti' },
  { name: 'TikTok',    url: 'https://tiktok.com/@drmerabti',               show: 'tiktok.com/@drmerabti' },
  { name: 'Threads',   url: 'https://threads.com/@drmerabti',              show: 'threads.com/@drmerabti' },
  { name: 'LinkedIn',  url: 'https://linkedin.com/in/soufiane-merabti',    show: 'linkedin.com/in/soufiane-merabti' },
  { name: 'الموقع',    url: 'https://merabti.com',                         show: 'merabti.com', site: true },
];
