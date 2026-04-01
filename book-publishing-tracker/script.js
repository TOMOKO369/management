const defaultTasks = [
    { id: 't1', phase: '企画・プロット', name: '読者層とテーマの決定', status: '完了', deadline: '2026-04-10', notes: 'ターゲット層は20代' },
    { id: 't2', phase: '企画・プロット', name: '目次構成の作成', status: '進行中', deadline: '2026-04-15', notes: '' },
    { id: 't3', phase: '執筆', name: '第1章', status: '未着手', deadline: '2026-05-01', notes: '' },
    { id: 't4', phase: '編集・校正', name: '初稿のセルフ推敲', status: '未着手', deadline: '2026-06-01', notes: '' },
    { id: 't5', phase: '表紙・デザイン', name: 'デザイナーへのラフ依頼', status: '未着手', deadline: '2026-06-10', notes: '' },
    { id: 't6', phase: '組版・レイアウト', name: '本文のフォーマット調整', status: '未着手', deadline: '2026-06-20', notes: '' },
    { id: 't7', phase: '印刷・電子化', name: 'KDPへ登録', status: '未着手', deadline: '2026-07-01', notes: '' },
    { id: 't8', phase: '宣伝・販売', name: 'SNS告知', status: '未着手', deadline: '2026-07-10', notes: '' },
];

let tasks = [];
const phasesList = [
    { name: '企画・プロット', icon: 'lightbulb', desc: 'テーマ設計、構成作成、ターゲット層の決定など本の骨組みを作ります。' },
    { name: '執筆', icon: 'edit_document', desc: '原稿の執筆を進めます。文字数やページの目安に沿って形にします。' },
    { name: '編集・校正', icon: 'spellcheck', desc: '誤字脱字チェック、論理構造見直しなどプロの目線で磨き上げます。' },
    { name: '表紙・デザイン', icon: 'palette', desc: '読者の目を惹くカバーデザイン。イラストやフォントの選定を行います。' },
    { name: '組版・レイアウト', icon: 'format_align_justify', desc: 'ページレイアウト、フォントサイズや行間調整で読みやすくします。' },
    { name: '印刷・電子化', icon: 'print', desc: '入稿、または電子書籍プラットフォームでのセットアップです。' },
    { name: '宣伝・販売', icon: 'campaign', desc: '販売ストアへ展開。読者へ届けるマーケティングを開始します。' }
];

const taskTableBody = document.getElementById('task-table-body');
const timelinePhases = document.getElementById('timeline-phases');
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');

function init() {
    loadData();
    renderAll();
    setupEvents();
}

function loadData() {
    const saved = localStorage.getItem('publishingJourneyTasks');
    if (saved) tasks = JSON.parse(saved);
    else { tasks = [...defaultTasks]; saveData(); }
}

function saveData() { localStorage.setItem('publishingJourneyTasks', JSON.stringify(tasks)); }

function renderAll() {
    renderTimeline();
    renderTable();
}

function renderTimeline() {
    timelinePhases.innerHTML = '';
    const stats = phasesList.map(phaseObj => {
        const phaseTasks = tasks.filter(t => t.phase === phaseObj.name);
        const total = phaseTasks.length;
        const completed = phaseTasks.filter(t => t.status === '完了').length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        let state = 'upcoming';
        if (total > 0 && completed === total) state = 'completed';
        else if (total > 0 && completed < total) state = 'active';
        return { ...phaseObj, total, completed, percent, state, tasks: phaseTasks };
    });

    stats.forEach((stat, idx) => {
        const isOdd = idx % 2 === 1;
        let statusTitleBadge = stat.state === 'completed' ? `<span class="label-md uppercase tracking-widest text-outline">Complete</span>` : 
            (stat.state === 'active' ? `<span class="label-md uppercase tracking-widest text-secondary font-bold">In Progress • ${stat.completed}/${stat.total} タスク</span>` : `<span class="label-md uppercase tracking-widest text-outline">Upcoming</span>`);

        let mainClasses = ''; let titleColor = ''; let iconMarkup = ''; let cardMarkup = '';
        if (stat.state === 'completed') {
            mainClasses = 'group'; titleColor = 'text-primary';
            iconMarkup = `<div class="absolute left-4 md:left-1/2 -translate-x-1/2 z-10"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary ring-8 ring-background"><span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span></div></div>`;
            cardMarkup = `<div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 hover:shadow-xl transition-shadow duration-500"><p class="text-body-lg text-on-surface-variant">${stat.desc}</p><div class="mt-4"><span class="px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase rounded-full">Completed</span></div>${renderMiniTasks(stat.tasks)}</div>`;
        } else if (stat.state === 'active') {
            mainClasses = 'group'; titleColor = 'text-secondary';
            iconMarkup = `<div class="absolute left-4 md:left-1/2 -translate-x-1/2 z-10"><div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary ring-8 ring-secondary-fixed shadow-[0_0_20px_rgba(142,78,20,0.4)] animate-pulse"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">${stat.icon}</span></div></div>`;
            cardMarkup = `<div class="bg-surface-container-lowest p-6 rounded-xl ring-2 ring-secondary/20 shadow-xl bg-gradient-to-br from-surface-container-lowest to-surface-container-low"><p class="text-body-lg text-on-surface mb-4">${stat.desc}</p><div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden"><div class="bg-secondary h-full" style="width: ${stat.percent}%"></div></div><div class="mt-2 text-[10px] font-bold text-on-surface-variant">${stat.percent}% Complete</div>${renderMiniTasks(stat.tasks)}</div>`;
        } else {
            mainClasses = 'group opacity-60 hover:opacity-100 transition-opacity'; titleColor = 'text-primary';
            iconMarkup = `<div class="absolute left-4 md:left-1/2 -translate-x-1/2 z-10"><div class="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-outline ring-8 ring-background"><span class="material-symbols-outlined text-sm">${stat.icon}</span></div></div>`;
            cardMarkup = `<div class="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15"><p class="text-body-lg text-on-surface-variant">${stat.desc}</p>${renderMiniTasks(stat.tasks)}</div>`;
        }

        let rowClass = isOdd ? 'md:flex-row-reverse' : 'md:flex-row';
        let textSide = isOdd ? 'md:text-left pl-12' : 'md:text-right pr-12';
        let cardSide = isOdd ? 'pr-0 md:pr-12 pl-12 md:pl-0' : 'pl-12 md:pl-12';

        timelinePhases.insertAdjacentHTML('beforeend', `
        <div class="relative flex flex-col ${rowClass} items-center justify-between ${mainClasses}">
            <div class="hidden md:block w-5/12 ${textSide}">
                ${statusTitleBadge}
                <h3 class="text-3xl font-headline italic font-semibold ${titleColor} mt-1 cursor-pointer hover:underline underline-offset-4" onclick="filterTable('${stat.name}')">${stat.name.split('・')[0]}</h3>
            </div>
            ${iconMarkup}
            <div class="w-full md:w-5/12 ${cardSide}">
                <div class="md:hidden mb-2 ml-12">
                    ${statusTitleBadge}
                    <h3 class="text-2xl font-headline italic font-semibold ${titleColor}">${stat.name}</h3>
                </div>
                ${cardMarkup}
            </div>
        </div>`);
    });
}

function renderMiniTasks(pt) {
    if(!pt || pt.length===0) return '';
    return '<div class="mt-4 flex flex-col gap-2 pt-4 border-t border-outline-variant/20">' + pt.map(t => {
        let i = t.status === '完了' ? '<span class="material-symbols-outlined text-[#10b981] text-sm">check_circle</span>' : 
               (t.status === '進行中' ? '<span class="material-symbols-outlined text-secondary text-sm">pending</span>' : '<span class="material-symbols-outlined text-outline text-sm">radio_button_unchecked</span>');
        return `<div class="flex items-center gap-2 text-sm text-on-surface-variant font-body cursor-pointer hover:text-primary transition-colors" onclick="editTask('${t.id}')">${i} <span class="truncate">${t.name}</span></div>`;
    }).join('') + '</div>';
}

function renderTable(filter = null) {
    taskTableBody.innerHTML = '';
    let disp = filter ? tasks.filter(t => t.phase === filter) : tasks;
    if(disp.length===0) { taskTableBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-outline">タスクがありません。</td></tr>`; return; }
    
    disp.forEach(t => {
        let bc = 'bg-surface-variant text-on-surface';
        if(t.status === '完了') bc = 'bg-[#10b981]/10 text-[#059669] border border-[#10b981]/20';
        else if(t.status === '進行中') bc = 'bg-secondary-container/20 text-secondary border border-secondary/20';
        else if(t.status === '確認中') bc = 'bg-primary-container/20 text-primary border border-primary/20';

        taskTableBody.insertAdjacentHTML('beforeend', `
            <tr class="hover:bg-surface-container-high transition-colors group">
                <td class="p-4 whitespace-nowrap"><span class="px-2 py-1 bg-surface-variant/50 rounded text-xs font-bold text-outline">${t.phase.split('・')[0]}</span></td>
                <td class="p-4 font-bold cursor-pointer hover:text-primary hover:underline underline-offset-4" onclick="editTask('${t.id}')">${t.name}</td>
                <td class="p-4"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${bc}">${t.status}</span></td>
                <td class="p-4 text-outline font-mono text-xs">${t.deadline||'-'}</td>
                <td class="p-4 text-right">
                    <button onclick="editTask('${t.id}')" class="p-2 text-outline hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">edit</span></button>
                    <button onclick="deleteTask('${t.id}')" class="p-2 text-outline hover:text-error transition-colors"><span class="material-symbols-outlined text-sm">delete</span></button>
                </td>
            </tr>`);
    });
    if (filter) document.getElementById('task-list-section').scrollIntoView({ behavior: 'smooth' });
}

window.filterTable = (p) => { renderTable(p); document.querySelector('#task-list-section h2').innerHTML = `タスク: <span class="text-secondary">${p}</span> <button onclick="renderTable(); this.parentElement.innerHTML='すべてのタスク'" class="text-xs text-outline underline ml-4 hover:text-primary">すべて表示</button>`; }
window.editTask = (id) => { openModal(true, id); };
window.deleteTask = (id) => { if (confirm('このタスクを削除しますか？')) { tasks = tasks.filter(t => t.id !== id); saveData(); renderAll(); } };

function openModal(isEdit, id) {
    taskForm.reset(); document.getElementById('modal-title').textContent = isEdit ? '編集' : '新規タスク';
    if(isEdit) {
        let t = tasks.find(x => x.id === id);
        if(t) {
            document.getElementById('task-id').value = t.id;
            Array.from(document.getElementById('task-phase').options).forEach(o => { if(o.value === t.phase) document.getElementById('task-phase').value = o.value; });
            document.getElementById('task-name').value = t.name; document.getElementById('task-status').value = t.status;
            document.getElementById('task-deadline').value = t.deadline||''; document.getElementById('task-notes').value = t.notes||'';
        }
    } else document.getElementById('task-id').value = '';
    modal.classList.remove('hidden'); modal.classList.add('flex');
}
function closeModal() { modal.classList.add('hidden'); modal.classList.remove('flex'); }

function setupEvents() {
    document.getElementById('add-task-btn').addEventListener('click', () => openModal(false));
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        let td = { id: document.getElementById('task-id').value || 't_'+Date.now(), phase: document.getElementById('task-phase').value, name: document.getElementById('task-name').value, status: document.getElementById('task-status').value, deadline: document.getElementById('task-deadline').value, notes: document.getElementById('task-notes').value };
        const i = tasks.findIndex(x => x.id === td.id);
        if(i !== -1) tasks[i] = td; else tasks.push(td);
        saveData(); renderAll(); closeModal();
    });
    document.getElementById('export-btn').addEventListener('click', () => {
        const BOM = '\uFEFF'; const h = ['ID', '工程(Phase)', 'タスク名(Task)', 'ステータス(Status)', '期日(Deadline)', 'メモ(Notes)'];
        const r = tasks.map(t => [t.id, `"${t.phase}"`,`"${t.name.replace(/"/g, '""')}"`,`"${t.status}"`, t.deadline, `"${(t.notes||'').replace(/"/g, '""')}"`].join(','));
        const u = URL.createObjectURL(new Blob([BOM + h.join(',') + '\n' + r.join('\n')], {type:'text/csv;charset=utf-8;'}));
        const a = document.createElement('a'); a.href = u; a.download = 'publishing_timeline.csv'; a.click(); URL.revokeObjectURL(u);
    });
    document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
    document.getElementById('import-file').addEventListener('change', e => {
        if(!e.target.files[0]) return;
        const r = new FileReader();
        r.onload = ev => { try { let j = JSON.parse(ev.target.result); if(Array.isArray(j)){ tasks=j; saveData(); renderAll(); alert('インポート成功'); } } catch(err){ alert('エラー');} e.target.value=''; };
        r.readAsText(e.target.files[0]);
    });
}
init();
