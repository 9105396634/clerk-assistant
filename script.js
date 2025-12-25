const caseForm = document.getElementById('caseForm');
const caseTableBody = document.getElementById('caseTableBody');

// 1. लोड होने पर डेटा दिखाना
document.addEventListener('DOMContentLoaded', displayCases);

// 2. केस सेव करना
caseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newCase = {
        id: Date.now(),
        name: document.getElementById('caseName').value,
        date: document.getElementById('hearingDate').value,
        notes: document.getElementById('caseNotes').value
    };

    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    cases.push(newCase);
    localStorage.setItem('myCases', JSON.stringify(cases));
    
    caseForm.reset();
    displayCases();
});

// 3. डेटा डिस्प्ले फंक्शन
function displayCases() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    caseTableBody.innerHTML = '';

    cases.forEach(item => {
        caseTableBody.innerHTML += `
            <tr>
                <td><strong>${item.name}</strong></td>
                <td>${item.date}</td>
                <td>${item.notes}</td>
                <td><button class="delete-btn" onclick="deleteCase(${item.id})">Delete</button></td>
            </tr>
        `;
    });
}

// 4. केस डिलीट करना
function deleteCase(id) {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    cases = cases.filter(item => item.id !== id);
    localStorage.setItem('myCases', JSON.stringify(cases));
    displayCases();
}
// 5. सर्च फंक्शनलिटी
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    const term = e.target.value.toLowerCase();
    const rows = caseTableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(function(row) {
        const name = row.cells[0].textContent.toLowerCase();
        const date = row.cells[1].textContent.toLowerCase();
        
        if (name.indexOf(term) != -1 || date.indexOf(term) != -1) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
function displayCases() {
    let cases = JSON.parse(localStorage.getItem('myCases')) || [];
    caseTableBody.innerHTML = '';

    // आज की तारीख निकालना (YYYY-MM-DD फॉर्मेट में)
    const today = new Date().toISOString().split('T')[0];

    cases.forEach(item => {
        let rowClass = '';
        if (item.date === today) {
            rowClass = 'today-case'; // आज के लिए
        } else if (item.date < today) {
            rowClass = 'past-case'; // पुराने के लिए
        } else {
            rowClass = 'upcoming-case'; // भविष्य के लिए
        }

        caseTableBody.innerHTML += `
            <tr class="${rowClass}">
                <td><strong>${item.name}</strong></td>
                <td>${item.date} ${item.date === today ? '<strong>(आज है!)</strong>' : ''}</td>
                <td>${item.notes}</td>
                <td><button class="delete-btn" onclick="deleteCase(${item.id})">Delete</button></td>
            </tr>
        `;
    });
}
// सेक्शन दिखाने या छुपाने के लिए
function toggleDraft() {
    const section = document.getElementById('draftSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// ऑटोमैटिक ड्राफ्ट बनाने के लिए
function generateDraft() {
    const client = document.getElementById('clientName').value;
    const court = document.getElementById('courtName').value;
    
    if(!client || !court) {
        alert("कृपया नाम और कोर्ट भरें");
        return;
    }

    const template = `
    वकालतनामा (VAKALATNAMA)
    -----------------------
    न्यायालय: ${court}
    
    वादी/प्रतिवादी: ${client}
    बनाम: सरकार/विपक्षी
    
    मैं, ${client}, एतद द्वारा श्री ________________ वकील साहब को अपना अधिवक्ता नियुक्त करता हूँ...
    (बाकी कानूनी शब्द यहाँ होंगे)
    
    हस्ताक्षर क्लाइंट: ___________
    तारीख: ${new Date().toLocaleDateString('hi-IN')}
    `;

    // फाइल डाउनलोड करने का तरीका
    const blob = new Blob([template], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Vakalatanama_${client}.txt`;
    link.click();
}
// डैशबोर्ड नंबर्स अपडेट करना
    const today = new Date().toISOString().split('T')[0];
    let todayCount = 0;
    
    // केस की संख्या
    document.getElementById('totalCasesCount').innerText = cases.length;

    // आज के केस की संख्या और खर्चे का डेटा लाना
    cases.forEach(item => {
        if (item.date === today) todayCount++;
    });
    document.getElementById('todayCasesCount').innerText = todayCount;

    // खर्चे का टोटल (LocalStorage से लेकर)
    let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    let expTotal = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    document.getElementById('totalExpenseSum').innerText = "₹" + expTotal;