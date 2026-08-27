(function () {
  "use strict";

  const LESSONS = [
    { n: 1, title: "ما هي قاعدة البيانات؟", desc: "التعرف على مكونات Access الأساسية" },
    { n: 2, title: "إنشاء قاعدة بيانات جديدة", desc: "فتح Access وإنشاء ملف قاعدة بيانات فارغ" },
    { n: 3, title: "إنشاء أول جدول", desc: "تحديد الحقول وأنواع البيانات" },
    { n: 4, title: "المفتاح الأساسي", desc: "لماذا يحتاجه كل جدول ولماذا يهم" },
    { n: 5, title: "العلاقات بين الجداول", desc: "ربط جدولين بعلاقة واحد لمتعدد" },
    { n: 6, title: "إنشاء استعلام", desc: "استخراج بيانات محددة من الجداول" },
    { n: 7, title: "إنشاء نموذج", desc: "تصميم واجهة سهلة لإدخال البيانات" },
    { n: 8, title: "إنشاء تقرير", desc: "عرض وطباعة النتائج بشكل منظم" },
  ];

  function getProgress() {
    try { return JSON.parse(localStorage.getItem("access_lessons_progress")) || {}; }
    catch (e) { return {}; }
  }

  function render() {
    const progress = getProgress();
    const grid = document.getElementById("lessonsGrid");
    grid.innerHTML = LESSONS.map((l) => {
      const done = !!progress[l.n];
      return `
        <a href="lesson-${l.n}.html" class="sc-card lesson-card" style="text-decoration:none;">
          ${done ? `<span class="lesson-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></span>` : ""}
          <div class="sc-body">
            <span class="lesson-num-badge">${l.n}</span>
            <p class="sc-name">${l.title}</p>
            <p class="sc-desc">${l.desc}</p>
          </div>
        </a>`;
    }).join("");
  }

  render();
})();
