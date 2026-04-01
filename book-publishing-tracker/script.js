const templates = {
    manga: [
        {
            title: "ネーム・下書きフェーズ",
            duration: 28, // 4 weeks
            desc: "プロット作成、ネーム切り、コマ割り、キャラクターデザイン、そして全ページの下書きを完了させます。",
            badge: "必要時間 約40h　週10hで4週間ちょうど",
            colors: { bg: "bg-indigo-100", text: "text-indigo-700", circleBg: "bg-indigo-50", circleText: "text-indigo-600" }
        },
        {
            title: "ペン入れ・トーン・仕上げフェーズ",
            duration: 14, // 2 weeks
            desc: "キャラクターのペン入れ、背景の描き込み、トーン貼りなどの作業。セリフの写植・ベタ塗りもここで行います。",
            badge: "必要時間 約30h　週15hで2週間",
            colors: { bg: "bg-emerald-100", text: "text-emerald-700", circleBg: "bg-emerald-50", circleText: "text-emerald-600" }
        },
        {
            title: "表紙制作・データ最終チェック・入稿",
            duration: 5, // 5 days
            desc: "フルカラーの表紙制作、全ページのノンブル確認、モアレ等の最終確認を行い、印刷所へデータを入稿します。",
            badge: "必要時間 約10h　早めに入稿すると余裕が生まれる",
            colors: { bg: "bg-amber-100", text: "text-amber-800", circleBg: "bg-amber-50", circleText: "text-amber-700" }
        }
    ],
    book: [
        {
            title: "執筆・素材制作フェーズ",
            duration: 28,
            desc: "まえがき・個人情報コラム・第0章・第1章・第2章の本文執筆と図版作成。画面キャプチャ撮影もここで完了させる。<br>週2章ペースは無理→<b>週1章ペース</b>で進める。",
            badge: "必要時間 約35〜40h　週10hで4週間ちょうど",
            colors: { bg: "bg-indigo-100", text: "text-indigo-700", circleBg: "bg-indigo-50", circleText: "text-indigo-600" }
        },
        {
            title: "在庫管理章・第4章・あとがき＋第三者レビュー",
            duration: 14,
            desc: "残りの執筆を終わらせながら、レビュアー（編集や協力者）に内容を確認してもらう。修正は音声等で効率化。表紙デザインも並行して進める。",
            badge: "必要時間 約20h　週10hで2週間",
            colors: { bg: "bg-emerald-100", text: "text-emerald-700", circleBg: "bg-emerald-50", circleText: "text-emerald-600" }
        },
        {
            title: "DTP・組版・入稿",
            duration: 5,
            desc: "全ページレイアウト確定と入稿データ作成。ここは連休などをできるだけ使って前倒しすると楽になる。",
            badge: "必要時間 約15h　先に進めておくと余裕が生まれる",
            colors: { bg: "bg-amber-100", text: "text-amber-800", circleBg: "bg-amber-50", circleText: "text-amber-700" }
        }
    ],
    novel: [
        {
            title: "プロット・本文執筆フェーズ",
            duration: 35,
            desc: "全体のプロット構成を固めた後、一気に本文を書き上げる。毎日一定の文字数を目標に粛々と執筆する。",
            badge: "必要時間 約50h　毎日コツコツ進める",
            colors: { bg: "bg-indigo-100", text: "text-indigo-700", circleBg: "bg-indigo-50", circleText: "text-indigo-600" }
        },
        {
            title: "推敲・校正フェーズ",
            duration: 14,
            desc: "時間をおいてから全体を読み直し、矛盾点や誤字脱字、表現のブラッシュアップを徹底的に行う。",
            badge: "必要時間 約15h　他者の目も借りると吉",
            colors: { bg: "bg-emerald-100", text: "text-emerald-700", circleBg: "bg-emerald-50", circleText: "text-emerald-600" }
        },
        {
            title: "表紙イラスト発注・組版・入稿",
            duration: 7,
            desc: "表紙や挿絵の完成を待ち、本文のレイアウトを整える（ルビや禁則処理の確認）。PDFやEPUBデータを作成し入稿。",
            badge: "必要時間 約10h　表紙依頼は事前に済ませておく",
            colors: { bg: "bg-amber-100", text: "text-amber-800", circleBg: "bg-amber-50", circleText: "text-amber-700" }
        }
    ]
};

const deadlineInput = document.getElementById('deadline-date');
const typeSelect = document.getElementById('project-type');
const generateBtn = document.getElementById('generate-btn');
const outputSection = document.getElementById('schedule-output');
const timelineContainer = document.getElementById('timeline-container');

// 初期値：現在の年から6月1日をセット
const today = new Date();
let defaultYear = today.getFullYear();
if (today.getMonth() > 5) defaultYear++;
deadlineInput.value = `${defaultYear}-06-01`;

let currentScheduleData = [];

generateBtn.addEventListener('click', () => {
    const deadlineVal = deadlineInput.value;
    if(!deadlineVal) {
        alert("必ず締切日（出版日）を入力してください！");
        return;
    }

    const type = typeSelect.value;
    const template = templates[type];
    
    // 逆算処理
    let currentDate = new Date(deadlineVal);
    currentScheduleData = [];

    // 後ろ（Phase 3）から順にさかのぼって計算
    for(let i = template.length - 1; i >= 0; i--) {
        const phase = template[i];
        
        // 終了日（開始日から計算した最終日なので、現在のカーソルが終了日）
        let phaseEndDate = new Date(currentDate);
        
        // 開始日（終了日から 所要日数-1日 さかのぼる）
        let phaseStartDate = new Date(currentDate);
        phaseStartDate.setDate(phaseStartDate.getDate() - (phase.duration - 1));
        
        currentScheduleData.unshift({
            title: phase.title,
            desc: phase.desc,
            badge: phase.badge,
            colors: phase.colors,
            start: phaseStartDate,
            end: phaseEndDate,
            numDays: phase.duration,
            number: i + 1
        });

        // 次の計算のため、現在の日付を 今のフェーズの開始日の「前日」にセットする
        currentDate = new Date(phaseStartDate);
        currentDate.setDate(currentDate.getDate() - 1);
    }

    renderSchedule(currentScheduleData);
});

function renderSchedule(data) {
    timelineContainer.innerHTML = '';
    
    data.forEach(item => {
        const startStr = `${item.start.getMonth()+1}月${item.start.getDate()}日`;
        const endStr = `${item.end.getMonth()+1}月${item.end.getDate()}日`;
        const weekStr = item.numDays % 7 === 0 ? `（${item.numDays / 7}週間）` : `（${item.numDays}日間）`;

        const html = `
        <div class="relative flex flex-col md:flex-row items-start md:items-stretch z-10 group">
            <!-- 円形バッジ -->
            <div class="w-[42px] h-[42px] ${item.colors.circleBg} ${item.colors.circleText} rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 mt-2 ring-[10px] ring-[#fafafa]">
                ${item.number}
            </div>
            
            <!-- 本文コンテンツ -->
            <div class="ml-4 md:ml-6 w-full pt-1">
                <div class="text-[15px] font-bold ${item.colors.text} mb-2 tracking-wide">${startStr}〜${endStr} <span class="text-sm border ml-2 px-2 py-0.5 rounded border-${item.colors.text.split('-')[1]}-200 bg-${item.colors.text.split('-')[1]}-50 opacity-80">${weekStr}</span></div>
                <h3 class="text-[1.35rem] font-bold text-gray-900 mb-2 leading-tight">${item.title}</h3>
                <p class="text-gray-600 text-[15px] leading-relaxed mb-4 md:max-w-3xl">${item.desc}</p>
                <span class="inline-block px-4 py-1.5 text-[13px] font-bold rounded-full ${item.colors.bg} ${item.colors.text}">${item.badge}</span>
            </div>
        </div>
        `;
        timelineContainer.insertAdjacentHTML('beforeend', html);
    });

    outputSection.classList.remove('hidden');
    
    // スクロールして表示
    setTimeout(() => {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// CSV書き出し機能
document.getElementById('export-csv-btn').addEventListener('click', () => {
    if(currentScheduleData.length === 0) return;
    
    const BOM = '\uFEFF';
    const headers = ['フェーズ', '開始日', '終了日', '必要期間', '工程のタイトル'];
    const rows = currentScheduleData.map(d => {
        const s = `${d.start.getFullYear()}/${d.start.getMonth()+1}/${d.start.getDate()}`;
        const e = `${d.end.getFullYear()}/${d.end.getMonth()+1}/${d.end.getDate()}`;
        return [
            d.number,
            s,
            e,
            `"${d.numDays}日間"`,
            `"${d.title.replace(/"/g, '""')}"`
        ].join(',');
    });
    
    const csvContent = BOM + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `出版逆算スケジュール_${deadlineInput.value}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
