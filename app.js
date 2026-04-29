document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 導覽列與頁面切換 ---
    const navLinks = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');

            document.querySelector('.nav-links li.active')?.classList.remove('active');
            sections.forEach(s => s.classList.remove('active'));

            link.parentElement.classList.add('active');
            document.getElementById(targetPage).classList.add('active');

            if (targetPage === 'dashboard') updateDashboard(true);
            if (targetPage === 'investments') fetchPrices();
            if (targetPage === 'history') renderHistory();
        });
    });

    // --- 2. 智能提示詞庫 (Autocomplete Dictionary) ---
    const assetDictionary = {
        crypto: [
            { sym: 'BTC', name: 'Bitcoin 比特幣' },
            { sym: 'ETH', name: 'Ethereum 以太幣' },
            { sym: 'BNB', name: 'Binance Coin 幣安幣' },
            { sym: 'SOL', name: 'Solana 索拉納' },
            { sym: 'XRP', name: 'Ripple 瑞波幣' },
            { sym: 'DOGE', name: 'Dogecoin 狗狗幣' },
            { sym: 'ADA', name: 'Cardano 艾達幣' },
            { sym: 'AVAX', name: 'Avalanche 雪崩幣' },
            { sym: 'DOT', name: 'Polkadot 波卡' },
            { sym: 'TRX', name: 'TRON 波場' },
            { sym: 'LINK', name: 'Chainlink 鏈結幣' },
            { sym: 'MATIC', name: 'Polygon 馬蹄幣' },
            { sym: 'LTC', name: 'Litecoin 萊特幣' },
            { sym: 'SHIB', name: 'Shiba Inu 柴犬幣' },
            { sym: 'DAI', name: 'DAI 穩定幣' },
            { sym: 'BCH', name: 'Bitcoin Cash 比特幣現金' },
            { sym: 'UNI', name: 'Uniswap' },
            { sym: 'ARB', name: 'Arbitrum' },
            { sym: 'NEAR', name: 'Near Protocol' },
            { sym: 'APT', name: 'Aptos' },
            { sym: 'OP', name: 'Optimism' },
            { sym: 'PEPE', name: 'Pepe' },
            { sym: 'SUI', name: 'Sui' },
            { sym: 'SEI', name: 'Sei' },
            { sym: 'FIL', name: 'Filecoin 檔案幣' },
            { sym: 'ATOM', name: 'Cosmos' },
            { sym: 'ETC', name: '以太坊經典' },
            { sym: 'FTM', name: 'Fantom' },
            { sym: 'IMX', name: 'Immutable' },
            { sym: 'TIA', name: 'Celestia' },
            { sym: 'INJ', name: 'Injective' },
            { sym: 'RNDR', name: 'Render' },
            { sym: 'KAS', name: 'Kaspa' },
            { sym: 'STX', name: 'Stacks' },
            { sym: 'TON', name: 'Toncoin' }
        ],
        tw_stock: [
            { sym: '2330.TW', name: '台積電 (TSMC)' },
            { sym: '2317.TW', name: '鴻海' },
            { sym: '2454.TW', name: '聯發科' },
            { sym: '2308.TW', name: '台達電' },
            { sym: '2382.TW', name: '廣達' },
            { sym: '3711.TW', name: '日月光投控' },
            { sym: '2303.TW', name: '聯電' },
            { sym: '2383.TW', name: '台光電' },
            { sym: '2412.TW', name: '中華電' },
            { sym: '2881.TW', name: '富邦金' },
            { sym: '2882.TW', name: '國泰金' },
            { sym: '2886.TW', name: '兆豐金' },
            { sym: '2884.TW', name: '玉山金' },
            { sym: '2891.TW', name: '中信金' },
            { sym: '5880.TW', name: '合庫金' },
            { sym: '2603.TW', name: '長榮' },
            { sym: '2609.TW', name: '陽明' },
            { sym: '3017.TW', name: '奇鋐' },
            { sym: '3037.TW', name: '欣興' },
            { sym: '2360.TW', name: '致茂' },
            { sym: '6669.TW', name: '緯穎' },
            { sym: '0050.TW', name: '元大台灣50' },
            { sym: '006208.TW', name: '富邦台50' },
            { sym: '0056.TW', name: '元大高股息' },
            { sym: '00878.TW', name: '國泰永續高股息' },
            { sym: '00919.TW', name: '群益台灣精選高息' },
            { sym: '00929.TW', name: '復華台灣科技優息' },
            { sym: '00940.TW', name: '元大台灣價值高息' },
            { sym: '00713.TW', name: '元大台灣高息低波' },
            { sym: '00939.TW', name: '統一台灣高息動能' },
            { sym: '00881.TW', name: '國泰台灣5G+' },
            { sym: '00935.TW', name: '野村臺灣創新科技' }
        ],
        us_stock: [
            { sym: 'AAPL', name: 'Apple 蘋果' },
            { sym: 'NVDA', name: 'NVIDIA 輝達' },
            { sym: 'TSLA', name: 'Tesla 特斯拉' },
            { sym: 'MSFT', name: 'Microsoft 微軟' },
            { sym: 'GOOGL', name: 'Google' },
            { sym: 'AMZN', name: 'Amazon 亞馬遜' },
            { sym: 'META', name: 'Meta (Facebook)' },
            { sym: 'AMD', name: 'AMD 超微' },
            { sym: 'TSM', name: '台積電 ADR' },
            { sym: 'ASML', name: '艾司摩爾' },
            { sym: 'AVGO', name: 'Broadcom 博通' },
            { sym: 'NFLX', name: 'Netflix 網飛' },
            { sym: 'COIN', name: 'Coinbase' },
            { sym: 'MSTR', name: 'MicroStrategy' },
            { sym: 'SPY', name: 'SPDR S&P 500 ETF' },
            { sym: 'QQQ', name: 'Invesco QQQ ETF' },
            { sym: 'VOO', name: 'Vanguard S&P 500 ETF' },
            { sym: 'BITO', name: 'ProShares 比特幣策略 ETF' },
            { sym: 'IBIT', name: 'iShares Bitcoin Trust' }
        ],
        bonds: [
            { sym: '00679B.TW', name: '元大美債20年' },
            { sym: '00687B.TW', name: '國泰20年美債' },
            { sym: '00720B.TW', name: '元大投資級公司債' },
            { sym: '00751B.TW', name: '元大AAA至A公司債' },
            { sym: '00772B.TW', name: '中信高評級公司債' },
            { sym: '00725B.TW', name: '國泰投資級公司債' },
            { sym: '00740B.TW', name: '富邦全球投等債' },
            { sym: 'TLT', name: 'iShares 20年期以上美國公債 ETF' },
            { sym: 'BND', name: 'Vanguard 總體債券市場 ETF' },
            { sym: 'AGG', name: 'iShares 核心美國綜合債券 ETF' }
        ],
        commodity: [
            { sym: 'GC=F', name: '黃金期貨 (Gold)' },
            { sym: 'SI=F', name: '白銀期貨 (Silver)' },
            { sym: 'CL=F', name: '原油期貨 (Crude Oil)' },
            { sym: '^TWII', name: '台灣加權指數' },
            { sym: 'JPYTWD=X', name: '日幣對台幣匯率' },
            { sym: 'USDTWD=X', name: '美金對台幣匯率' }
        ]
    };

        const bankDictionary = [
        { code: "004", name: "臺灣銀行", domain: "bot.com.tw" },
        { code: "005", name: "臺灣土地銀行", domain: "landbank.com.tw" },
        { code: "006", name: "合作金庫商業銀行", domain: "tcb-bank.com.tw" },
        { code: "007", name: "第一商業銀行", domain: "firstbank.com.tw" },
        { code: "008", name: "華南商業銀行", domain: "hncb.com.tw" },
        { code: "009", name: "彰化商業銀行", domain: "bankchb.com" },
        { code: "011", name: "上海商業儲蓄銀行", domain: "scsb.com.tw" },
        { code: "012", name: "台北富邦商業銀行", domain: "fubon.com" },
        { code: "013", name: "國泰世華商業銀行", domain: "cathaybk.com.tw" },
        { code: "016", name: "高雄銀行", domain: "bok.com.tw" },
        { code: "017", name: "兆豐國際商業銀行", domain: "megabank.com.tw" },
        { code: "018", name: "農業金庫", domain: "agribank.com.tw" },
        { code: "021", name: "花旗(台灣)商業銀行", domain: "citibank.com.tw" },
        { code: "039", name: "澳商澳盛銀行", domain: "anz.com" },
        { code: "048", name: "王道商業銀行", domain: "o-bank.com" },
        { code: "050", name: "臺灣中小企業銀行", domain: "tbb.com.tw" },
        { code: "052", name: "渣打國際商業銀行", domain: "sc.com" },
        { code: "053", name: "台中商業銀行", domain: "tcbbank.com.tw" },
        { code: "054", name: "京城商業銀行", domain: "ktb.com.tw" },
        { code: "101", name: "瑞興商業銀行", domain: "taipeistarbank.com.tw" },
        { code: "102", name: "華泰商業銀行", domain: "hwataibank.com.tw" },
        { code: "103", name: "臺灣新光商業銀行", domain: "skbank.com.tw" },
        { code: "108", name: "陽信商業銀行", domain: "sunnybank.com.tw" },
        { code: "118", name: "板信商業銀行", domain: "bop.com.tw" },
        { code: "147", name: "三信商業銀行", domain: "cotabank.com.tw" },
        { code: "700", name: "中華郵政", domain: "post.gov.tw" },
        { code: "803", name: "聯邦商業銀行", domain: "ubot.com.tw" },
        { code: "805", name: "遠東國際商業銀行", domain: "feib.com.tw" },
        { code: "806", name: "元大商業銀行", domain: "yuantabank.com.tw" },
        { code: "807", name: "永豐商業銀行", domain: "bank.sinopac.com" },
        { code: "808", name: "玉山商業銀行", domain: "esunbank.com.tw" },
        { code: "809", name: "凱基商業銀行", domain: "kgibank.com.tw" },
        { code: "810", name: "星展(台灣)商業銀行", domain: "dbs.com.tw" },
        { code: "812", name: "台新國際商業銀行", domain: "taishinbank.com.tw" },
        { code: "816", name: "安泰商業銀行", domain: "enttiebank.com.tw" },
        { code: "822", name: "中國信託商業銀行", domain: "ctbcbank.com" },
        { code: "823", name: "將來商業銀行", domain: "nextbank.com.tw" },
        { code: "824", name: "連線商業銀行 (LINE Bank)", domain: "linebank.com.tw" },
        { code: "826", name: "樂天國際商業銀行", domain: "rakuten-bank.com.tw" }
    ];

    // 電子支付字典 (屬台灣常用支付)
        const walletDictionary = [
        { code: "LP",   name: "LINE Pay / iPASS MONEY", domain: "line.me" },
        { code: "JKO",  name: "街口支付", domain: "jkopay.com" },
        { code: "PP",   name: "全支付 (PlusPay)", domain: "pxpayplus.com" },
        { code: "TP",   name: "台灣Pay (Taiwan Pay)", domain: "taiwanpay.com.tw" },
        { code: "EW",   name: "悠遊付 (EasyWallet)", domain: "easycard.com.tw" },
        { code: "IP",   name: "icash Pay", domain: "icashpay.com.tw" },
        { code: "PI",   name: "Pi 拍錢包", domain: "piapp.com.tw" },
        { code: "OP",   name: "歐付寶 (O'Pay)", domain: "opay.tw" },
        { code: "GP",   name: "Google Pay", domain: "pay.google.com" },
        { code: "AP",   name: "Apple Pay", domain: "apple.com" },
        { code: "CASH", name: "實體現金 / 錢包" }
    ];

    
    // 銀行 + 電子錢包字典 (一集式，從 acproviderDictionary 引用)
    const providerDictionary = [...bankDictionary, ...walletDictionary];

    const getProviderLogo = (name) => {
        const item = providerDictionary.find(p => p.name === name || p.code === name);
        if (item && item.domain) return `https://www.google.com/s2/favicons?sz=64&domain=${item.domain}`;
        return null;
    };


    const setupAutocomplete = (inputId, suggestionId, dataProvider) => {
        const input = document.getElementById(inputId);
        const suggestionBox = document.getElementById(suggestionId);
        if (!input || !suggestionBox) return;

        input.addEventListener('input', (e) => {
            let val = e.target.value.toLowerCase().trim();
            suggestionBox.innerHTML = '';
            if (!val) {
                suggestionBox.style.display = 'none';
                return;
            }

            let matches = dataProvider.filter(item =>
                item.code.includes(val) ||
                item.name.toLowerCase().includes(val)
            ).sort((a, b) => {
                // 精準度排序：代號完全符合 > 名稱開頭符合 > 代號包含 > 名稱包含
                if (a.code === val) return -1;
                if (b.code === val) return 1;
                let aStart = a.name.startsWith(val) ? 0 : 1;
                let bStart = b.name.startsWith(val) ? 0 : 1;
                if (aStart !== bStart) return aStart - bStart;
                return a.code.localeCompare(b.code);
            }).slice(0, 15);

            if (matches.length > 0) {
                matches.forEach(m => {
                    let li = document.createElement('li');
                    li.innerHTML = `<span class="sym-code" style="color:var(--primary); font-family:monospace; min-width:40px; display:inline-block;">${m.code}</span><span style="font-size:0.9rem; padding-left:12px;">${m.name}</span>`;
                    li.addEventListener('click', () => {
                        input.value = `${m.code} ${m.name}`;
                        suggestionBox.style.display = 'none';
                    });
                    suggestionBox.appendChild(li);
                });
                suggestionBox.style.display = 'block';
            } else {
                suggestionBox.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== suggestionBox) {
                suggestionBox.style.display = 'none';
            }
        });
    };

    setupAutocomplete('d-bank', 'bank-suggestions', bankDictionary);
    setupAutocomplete('d-repay-bank', 'repay-bank-suggestions', bankDictionary);
    // ✔ ac-provider 已改用視覺化選擇器，不再使用 autocomplete

    // --- 全局數值運算工具 ---
    const calculateAPR = (P, M, N_years) => {
        try {
            const N = N_years * 12;
            if (P <= 0 || N <= 0 || M <= 0) return "0.00";
            let low = 0, high = 1.0; 
            for (let i = 0; i < 40; i++) {
                let mid = (low + high) / 2;
                let estimatedM = P * (mid * Math.pow(1 + mid, N)) / (Math.pow(1 + mid, N) - 1);
                if (estimatedM > M) high = mid;
                else low = mid;
            }
            return (low * 12 * 100).toFixed(2);
        } catch (e) {
            return "0.00";
        }
    };

    // --- 負債自動化系統模組 ---
    const getElapsedMonths = (startDate) => {
        if (!startDate) return 0;
        const start = new Date(startDate);
        if (isNaN(start.getTime())) return 0;
        const now = new Date();
        const diff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        return Math.max(0, diff);
    };

    const calculateBalance = (debt) => {
        try {
            const principal = Number(debt.total) || 0;
            const monthlyPayment = Number(debt.monthly) || 0;
            const years = Number(debt.years) || 0;
            const startDate = debt.startDate;
            
            if (!startDate || years <= 0) return principal;

            const aprValue = parseFloat(calculateAPR(principal, monthlyPayment, years)) / 100;
            const monthlyRate = aprValue / 12;

            const k = getElapsedMonths(startDate);
            if (k <= 0) return principal;
            
            if (monthlyRate === 0) return Math.max(0, principal - monthlyPayment * k);
            
            const compound = Math.pow(1 + monthlyRate, k);
            const balance = principal * compound - monthlyPayment * (compound - 1) / monthlyRate;
            
            return isNaN(balance) ? principal : Math.max(0, balance);
        } catch (e) {
            console.error('Balance calculation error:', e);
            return Number(debt.total) || 0;
        }
    };

    const processAutomaticRepayments = () => {
        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        let changed = false;

        state.debts.forEach(debt => {
            if (!debt.startDate || !debt.monthly) return;
            if (!debt.lastProcessedDate) debt.lastProcessedDate = debt.startDate;
            
            let lastDate = new Date(debt.lastProcessedDate);
            let payDay = parseInt(debt.payDate || 1);
            let safetyCounter = 0; // 防無限迴圈

            while (safetyCounter < 240) { // 最多補 20 年紀錄
                let nextDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, payDay);
                if (isNaN(nextDate.getTime()) || nextDate > now) break;

                state.transactions.unshift({
                    id: 'auto-repay-' + Date.now() + Math.random(),
                    type: 'expense',
                    amount: debt.monthly,
                    category: '[自動] 貸款還款',
                    date: nextDate.toISOString().split('T')[0],
                    relatedAsset: debt.name,
                    linkId: debt.id
                });
                
                lastDate = nextDate;
                changed = true;
                debt.lastProcessedDate = nextDate.toISOString().split('T')[0];
                safetyCounter++;
            }
        });

        if (changed) {
            saveState();
            // alert('系統偵測到還款日期已過，已為您自動補上這段期間的還款紀錄！');
        }
    };


    const iSymbolInput = document.getElementById('i-symbol');
    const suggestionBox = document.getElementById('symbol-suggestions');

    if (iSymbolInput && suggestionBox) {
        iSymbolInput.setAttribute('autocomplete', 'off');

        iSymbolInput.addEventListener('input', (e) => {
            let val = e.target.value.toLowerCase().trim();
            let typeEl = document.getElementById('i-type');
            let type = typeEl ? typeEl.value : 'crypto';

            suggestionBox.innerHTML = '';
            if (!val) {
                suggestionBox.style.display = 'none';
                return;
            }

            let matches = assetDictionary[type].filter(item =>
                item.sym.toLowerCase().includes(val) ||
                item.name.toLowerCase().includes(val)
            ).sort((a, b) => {
                // 優先排序：開頭完全符合 > 包含在內
                let aStart = a.sym.toLowerCase().startsWith(val) || a.name.toLowerCase().startsWith(val) ? 0 : 1;
                let bStart = b.sym.toLowerCase().startsWith(val) || b.name.toLowerCase().startsWith(val) ? 0 : 1;
                return aStart - bStart;
            }).slice(0, 10); // 最多顯示前 10 個結果避免太亂

            if (matches.length > 0) {
                matches.forEach(m => {
                    let li = document.createElement('li');
                    let displaySym = ((type === 'tw_stock' || type === 'commodity') && m.sym.endsWith('.TW')) ? m.sym.replace('.TW', '') : m.sym;

                    li.innerHTML = `<span class="sym-code">${displaySym}</span><span style="font-size:0.85rem; color:var(--text-muted); padding-left:10px; text-align:right;">${m.name}</span>`;
                    li.addEventListener('click', () => {
                        iSymbolInput.value = displaySym;
                        suggestionBox.style.display = 'none';
                    });
                    suggestionBox.appendChild(li);
                });

                let customLi = document.createElement('li');
                customLi.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted); width:100%; text-align:center;">找不到？請直接輸入完整代號 (系統將自動尋找)</span>`;
                suggestionBox.appendChild(customLi);

                suggestionBox.style.display = 'block';
            } else {
                suggestionBox.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target !== iSymbolInput && e.target !== suggestionBox) {
                suggestionBox.style.display = 'none';
            }
        });

        const typeEl = document.getElementById('i-type');
        if (typeEl) {
            typeEl.addEventListener('change', () => {
                iSymbolInput.value = '';
                suggestionBox.style.display = 'none';
                iSymbolInput.focus();

                const amountHint = document.getElementById('amount-hint');
                if (amountHint) {
                    let v = typeEl.value;
                    if (v === 'crypto') amountHint.innerText = '(例如: 0.05 顆)';
                    else if (v === 'tw_stock') amountHint.innerText = '(台股 1張請填 1000 股)';
                    else if (v === 'us_stock') amountHint.innerText = '(輸入實際股數)';
                    else if (v === 'bonds') amountHint.innerText = '(債券 ETF 1張請填 1000 股)';
                    else if (v === 'commodity') amountHint.innerText = '(輸入單位或合約數量)';
                }
            });
        }

        document.getElementById('portfolio-currency')?.addEventListener('change', () => {
            renderInvestments();
        });

        // --- 負債區塊：實時 APR 換算邏輯 ---
        const debtInputs = ['d-total', 'd-years', 'd-monthly'];
        debtInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => {
                const principal = parseFloat(document.getElementById('d-total').value);
                const years = parseFloat(document.getElementById('d-years').value);
                const monthly = parseFloat(document.getElementById('d-monthly').value);
                const display = document.getElementById('d-apr-display');

                if (principal > 0 && years > 0 && monthly > 0) {
                    const apr = calculateAPR(principal, monthly, years);
                    display.innerText = apr + ' %';
                    display.style.color = apr > 10 ? 'var(--danger)' : 'var(--success)';
                } else {
                    display.innerText = '- %';
                }
            });
        });

        const calculateAPR = (P, M, N_years) => {
            const N = N_years * 12;
            let low = 0, high = 1.0; // 0% to 100% per month (excessive but safe)
            for (let i = 0; i < 40; i++) {
                let mid = (low + high) / 2;
                let estimatedM = P * (mid * Math.pow(1 + mid, N)) / (Math.pow(1 + mid, N) - 1);
                if (estimatedM > M) high = mid;
                else low = mid;
            }
            return (low * 12 * 100).toFixed(2);
        };
    }

    // --- 摺疊狀態管理 ---
    const collapsedCategories = new Set(['crypto', 'tw_stock', 'us_stock', 'bonds', 'commodity']);


    // --- 3. 狀態管理與復原機制 (Undo System) ---
    // 改良版資料讀取：全新版本 V10 (支援全局日誌與持久化歷史)
    let state = JSON.parse(localStorage.getItem('financeStateV10'));
    if (!state) {
        // 嘗試從舊版本遷移
        const oldState = JSON.parse(localStorage.getItem('financeStateV9'));
        state = {
            transactions: oldState ? oldState.transactions : [],
            investments: oldState ? oldState.investments : [],
            debts: oldState ? oldState.debts : [],
            baseCash: oldState ? oldState.baseCash : 0,
            logs: []
        };
        localStorage.setItem('financeStateV10', JSON.stringify(state));
    }

    // --- 確保所有狀態欄位均已正確初始化 ---
    if (!state.logs) state.logs = [];
    if (!state.transactions) state.transactions = [];
    if (!state.investments) state.investments = [];
    if (!state.debts) state.debts = [];
    if (state.baseCash === undefined) state.baseCash = 0;
    if (!state.accounts) state.accounts = []; // 帳戶管理欄位
    if (state.reserveCash === undefined) state.reserveCash = 0; // 備用金 (Fixed Cash)
    
    // --- 財務目標與預算設定 (V11+) ---
    if (state.monthlyBudget === undefined) state.monthlyBudget = 0;
    if (state.savingsGoal === undefined) state.savingsGoal = 0;

    // --- Data Maintenance: Force Purge 170k Test Data ---
    if (!localStorage.getItem('repair_170k_v2')) {
        console.log('Running one-time data maintenance: Purging 170k test data...');
        const amountToPurge = 170000;
        
        // 1. Identify debt IDs for 170k loans
        const targetDebtIds = state.debts
            .filter(d => d.total === amountToPurge || (d.name && d.name.includes('170000')))
            .map(d => d.id);
            
        // 2. Filter Transactions
        const initialTxCount = state.transactions.length;
        state.transactions = state.transactions.filter(t => {
            const isTargetAmount = Math.abs(t.amount) === amountToPurge;
            const isLinked = t.linkId && targetDebtIds.includes(t.linkId);
            const isNamed170k = (t.category && t.category.includes('170000')) || (t.relatedAsset && t.relatedAsset.includes('170000'));
            
            // 如果這筆交易是為了測試 17 萬信貸產生的（金額符合、或是名稱符合、或是連結到該債務），則移除
            return !(isTargetAmount || isLinked || isNamed170k);
        });
        
        // 3. Filter Debts
        state.debts = state.debts.filter(d => !targetDebtIds.includes(d.id));
        
        // 4. Filter Logs
        state.logs = state.logs.filter(l => !(Math.abs(l.amount) === amountToPurge || (l.description && l.description.includes('170000'))));

        console.log(`Maintenance complete. Removed ${initialTxCount - state.transactions.length} transactions.`);
        localStorage.setItem('repair_170k_v2', 'done');
        localStorage.setItem('financeStateV10', JSON.stringify(state));
    }

    let historyStack = JSON.parse(localStorage.getItem('historyStackV10')) || [];

    const captureHistory = () => {
        historyStack.push(JSON.stringify(state));
        if (historyStack.length > 30) historyStack.shift();
        localStorage.setItem('historyStackV10', JSON.stringify(historyStack));
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.style.display = 'block';
    };

    const addLog = (module, action, description, amount = 0, relatedId = null) => {
        const entry = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            module: module, // 'cashflow', 'investments', 'liabilities', 'system'
            action: action, // 'add', 'edit', 'delete', 'settle', 'trade', 'balance'
            description: description,
            amount: amount,
            relatedId: relatedId
        };
        state.logs.unshift(entry);
        if (state.logs.length > 500) state.logs.pop(); // 保持 500 筆上限
    };

    document.getElementById('undo-btn')?.addEventListener('click', () => {
        if (historyStack.length > 0) {
            state = JSON.parse(historyStack.pop());
            localStorage.setItem('historyStackV10', JSON.stringify(historyStack));
            saveState(false);

            const undoBtn = document.getElementById('undo-btn');
            if (historyStack.length === 0 && undoBtn) undoBtn.style.display = 'none';
            alert('已為您持久化復原上一個操作！');
        }
    });

    if (historyStack.length > 0) {
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.style.display = 'block';
    }

    document.addEventListener('click', (e) => {
        // [1] 設定活期期初金額
        if (e.target.closest('#edit-demand-btn')) {
            const data = getCalculatedData();
            let currentDemand = data.demandDeposit;
            let result = prompt(`【設定期初活期金額】\n\n此操作將校準您的起始資金點，會影響總資產與淨值。\n(目前計算值: ${currentDemand.toLocaleString()})\n\n請輸入您目前實際的「活期存餘」金額 (NT$):`, currentDemand);
            
            if (result !== null && !isNaN(parseFloat(result))) {
                const targetDemand = parseFloat(result);
                // 活期 = baseCash + 交易累積
                // baseCash = 活期 - 交易累積
                const cumulativeSurplus = data.demandDeposit - state.baseCash;
                const newBaseCash = targetDemand - cumulativeSurplus;
                
                captureHistory();
                addLog('system', 'init', `校準期初活期金額為 NT$ ${targetDemand.toLocaleString()}`, targetDemand - currentDemand);
                state.baseCash = newBaseCash;
                saveState();
            }
        }
        
        // [2] 設定備用金期初金額
        if (e.target.closest('#edit-reserve-btn')) {
            let currentReserve = state.reserveCash || 0;
            let result = prompt(`【設定期初備用金金額】\n\n此操作將直接設定您的備用金期初水位，會增加總資產且不會影響活期。\n(目前值: ${currentReserve.toLocaleString()})\n\n請輸入您目前實際的「備用金 (Fixed Cash)」金額 (NT$):`, currentReserve);
            
            if (result !== null && !isNaN(parseFloat(result)) && parseFloat(result) >= 0) {
                const targetReserve = parseFloat(result);
                captureHistory();
                addLog('system', 'init', `校準期初備用金金額為 NT$ ${targetReserve.toLocaleString()}`, targetReserve - currentReserve);
                state.reserveCash = targetReserve;
                saveState();
            }
        }

        // [3] 資金調度橋樑 (Visual Modal)
        if (e.target.closest('#cash-bridge-btn')) {
            openBridgeModal();
        }
    });

    // --- 資金調度橋樑專屬邏輯 ---
    let bridgeState = {
        direction: 'demand_to_reserve', // or 'reserve_to_demand'
        sourceBalance: 0,
        targetBalance: 0
    };

    const openBridgeModal = () => {
        const modal = document.getElementById('cash-bridge-modal');
        const data = getCalculatedData();
        
        bridgeState.direction = 'demand_to_reserve';
        bridgeState.demandBalance = data.demandDeposit;
        bridgeState.reserveBalance = data.reserveCash;
        
        document.getElementById('bridge-amount').value = '';
        const arrow = document.getElementById('bridge-arrow-icon');
        arrow.style.transform = 'rotate(0deg)'; // 重置箭頭
        
        updateBridgeUI();
        modal.classList.add('show');
    };

    const updateBridgeUI = () => {
        const isD2R = bridgeState.direction === 'demand_to_reserve';
        
        // 抓取餘額顯示元素
        const demandDisplay = document.getElementById('bridge-demand-display-balance');
        const reserveDisplay = document.getElementById('bridge-reserve-display-balance');
        
        demandDisplay.textContent = `NT$ ${bridgeState.demandBalance.toLocaleString()}`;
        reserveDisplay.textContent = `NT$ ${bridgeState.reserveBalance.toLocaleString()}`;

        // 切換桶子的高亮狀態 (箭頭出發點為 source, 到達點為 target)
        const dBox = document.getElementById('bridge-demand-bucket');
        const rBox = document.getElementById('bridge-reserve-bucket');
        
        if (isD2R) {
            dBox.className = 'bridge-bucket active-source';
            rBox.className = 'bridge-bucket active-target';
        } else {
            dBox.className = 'bridge-bucket active-target';
            rBox.className = 'bridge-bucket active-source';
        }

        calculateBridgePreview();
    };

    const calculateBridgePreview = () => {
        const amount = parseFloat(document.getElementById('bridge-amount').value) || 0;
        const isD2R = bridgeState.direction === 'demand_to_reserve';
        
        const sourceBalance = isD2R ? bridgeState.demandBalance : bridgeState.reserveBalance;
        const targetBalance = isD2R ? bridgeState.reserveBalance : bridgeState.demandBalance;

        const sourceAfter = Math.max(0, sourceBalance - amount);
        const targetAfter = targetBalance + amount;

        // 預覽文字更新
        document.getElementById('preview-source-after').textContent = `NT$ ${sourceAfter.toLocaleString()}`;
        document.getElementById('preview-target-after').textContent = `NT$ ${targetAfter.toLocaleString()}`;
        
        const confirmBtn = document.getElementById('bridge-confirm-btn');
        if (amount > sourceBalance || amount <= 0) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
        } else {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        }
    };

    // 事件監聽：反轉按鈕 (控制箭頭旋轉與方向狀態)
    document.getElementById('bridge-reverse-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        const isD2R = bridgeState.direction === 'demand_to_reserve';
        bridgeState.direction = isD2R ? 'reserve_to_demand' : 'demand_to_reserve';
        
        // 箭頭旋轉 180 度
        const arrow = document.getElementById('bridge-arrow-icon');
        arrow.style.transform = isD2R ? 'rotate(180deg)' : 'rotate(0deg)';
        
        updateBridgeUI();
    });

    // 事件監聽：輸入
    document.getElementById('bridge-amount')?.addEventListener('input', calculateBridgePreview);

    // 事件監聽：快選 Pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.onclick = () => {
            const pct = parseFloat(pill.getAttribute('data-pct'));
            const isD2R = bridgeState.direction === 'demand_to_reserve';
            const sourceBalance = isD2R ? bridgeState.demandBalance : bridgeState.reserveBalance;
            
            document.getElementById('bridge-amount').value = Math.floor(sourceBalance * pct);
            calculateBridgePreview();
        };
    });

    // 事件監聽：取消與關閉
    const closeBridge = () => document.getElementById('cash-bridge-modal').classList.remove('show');
    document.getElementById('bridge-close-btn')?.addEventListener('click', closeBridge);
    document.getElementById('bridge-cancel-btn')?.addEventListener('click', closeBridge);

    // 事件監聽：摘要與執行
    document.getElementById('bridge-modal-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('bridge-amount').value);
        const isD2R = bridgeState.direction === 'demand_to_reserve';
        const sourceBalance = isD2R ? bridgeState.demandBalance : bridgeState.reserveBalance;

        if (amount > sourceBalance || amount <= 0) return;

        captureHistory();
        if (isD2R) {
            addLog('system', 'transfer', `資金調度：由活期挪移至備用金`, 0);
            state.baseCash -= amount;
            state.reserveCash += amount;
        } else {
            addLog('system', 'transfer', `資金調度：由備用金挪回活期`, 0);
            state.reserveCash -= amount;
            state.baseCash += amount;
        }

        saveState();
        closeBridge();
        alert(`✅ 成功調度 NT$ ${amount.toLocaleString()}`);
    });

    document.getElementById('toggle-invest-pnl')?.addEventListener('change', () => {
        updateDashboard(true);
    });

    let editingState = { txId: null, invId: null, debtId: null };
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('t-date')) document.getElementById('t-date').value = today;

    const saveState = (recordToLocal = true) => {
        if (recordToLocal) localStorage.setItem('financeStateV10', JSON.stringify(state));
        updateDashboard(false);
        renderTransactions();
        renderInvestments();
        renderDebts();
        renderHistory();
    };

    const getCalculatedData = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

        let tIncome = 0, tExpense = 0;
        let cumulativeSurplus = 0;

        state.transactions.forEach(t => {
            const txTime = new Date(t.date).getTime();
            const amount = Number(t.amount);

            // 【精準排除】如果交易已經綁定特定帳戶，則不計入舊有的累積池，避免重複計算
            if (!t.accountId) {
                if (t.type === 'income') cumulativeSurplus += amount;
                else if (t.type === 'expense') cumulativeSurplus -= amount;
            }

            if (txTime >= startOfMonth && txTime <= endOfMonth) {
                if (t.type === 'income') tIncome += amount;
                if (t.type === 'expense') tExpense += amount;
            }
        });

        const cashflowSurplus = tIncome - tExpense;

        let investTotal = 0;
        const includePnl = document.getElementById('toggle-invest-pnl') ? document.getElementById('toggle-invest-pnl').checked : true;

        state.investments.forEach(i => {
            if (includePnl) {
                investTotal += Number(i.amount) * Number(i.currentPrice);
            } else {
                investTotal += Number(i.totalCost);
            }
        });

        // 【核心修正】多維度現金模型
        // 1. 傳統現金池 (Legacy): 包含初始現金與未分類的日常交易
        const legacyCashPool = state.baseCash + cumulativeSurplus + (state.reserveCash || 0);
        
        // 2. 帳戶管理池 (Accounts): 包含所有新增的銀行帳戶與電子錢包
        let accountsCashPool = 0;
        if (state.accounts && state.accounts.length > 0) {
            state.accounts.forEach(acc => {
                if (acc.includeInAssets !== false) {
                    let bal = Number(acc.balance) || 0;
                    // 匯率換算處理 (暫時預設 USD 為 32.5)
                    let rate = 1;
                    if (acc.currency === 'USD') rate = 32.5;
                    accountsCashPool += (bal * rate);
                }
            });
        }
        
        // 最終總現金 = 傳統池 + 帳戶池
        const currentCash = legacyCashPool + accountsCashPool; 

        // 為相容舊有 UI 顯示，定義回傳變數
        const demandDeposit = currentCash; 
        const reserveCash = state.reserveCash || 0;

        let totalAssets = currentCash + investTotal;
        let totalDebts = 0;
        state.debts.forEach(d => {
            totalDebts += calculateBalance(d);
        });

        const netWorth = totalAssets - totalDebts;

        // 【預算計算】
        const budget = state.monthlyBudget || 0;
        const budgetUsed = tExpense;
        const budgetRemaining = Math.max(0, budget - budgetUsed);
        const budgetProgress = Math.min(100, budget > 0 ? (budgetUsed / budget) * 100 : 0);

        // 【目標計算】
        const goal = state.savingsGoal || 0;
        const savingsProgress = Math.min(100, goal > 0 ? (totalAssets / goal) * 100 : 0);

        return {
            tIncome, tExpense, cashflowSurplus, 
            investTotal, currentCash, totalAssets,
            totalDebts, netWorth,
            demandDeposit, reserveCash,
            budget, budgetUsed, budgetRemaining, budgetProgress,
            goal, savingsProgress
        };
    };

    // --- 智能風險分析系統 ---
    const getHistoricalAverages = () => {
        const months = {};
        state.transactions.forEach(t => {
            if (t.type === 'expense') {
                const month = t.date.substring(0, 7);
                months[month] = (months[month] || 0) + Number(t.amount);
            }
        });
        const values = Object.values(months);
        if (values.length === 0) return 0;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return avg;
    };

    const analyzeSpendingRisk = (amount) => {
        if (!amount || amount <= 0) return null;
        
        const data = getCalculatedData();
        const avgMonthly = getHistoricalAverages();
        const risks = [];

        // 1. 預算衝擊
        if (data.budget > 0 && (data.budgetUsed + amount) > data.budget) {
            risks.push({ level: 'danger', msg: '🔴 超過本月剩餘預算' });
        }

        // 2. 歷史異常 (大於月均值 50% 定義為異常)
        if (avgMonthly > 0 && amount > (avgMonthly * 0.5)) {
            risks.push({ level: 'warning', msg: '🟡 金額異常：已達月均支出的 50% 以上' });
        }

        // 3. 流動性風險 (大於活期餘額 20%)
        if (data.demandDeposit > 0 && amount > (data.demandDeposit * 0.2)) {
            risks.push({ level: 'warning', msg: '🟠 流動性提醒：金額超過活期存款的 20%' });
        }

        return risks;
    };
    const formatCurrency = (num) => 'NT$ ' + Math.abs(Math.round(num)).toLocaleString('en-US');

    // === Odometer 動畫引擎 ===
    const animateOdometer = (containerId, targetValue) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const digitsEl = container.querySelector('.od-digits');
        if (!digitsEl) return;

        const isNeg = targetValue < 0;
        const absVal = Math.abs(Math.round(targetValue));
        const numStr = (isNeg ? '-' : '') + absVal.toLocaleString('en-US'); // Include minus sign if negative

        // 如果是負數，在 container 上標記 (CSS 需要處理色彩)
        container.classList.toggle('od-negative', isNeg);

        // 取得目前已經渲染的 digit 元素
        const currentDigits = digitsEl.querySelectorAll('.od-digit');
        const targetChars = numStr.split('');

        // 如果字元數不含連符和已渲染的不同，重建整個 DOM
        const rebuildNeeded =
            currentDigits.length !== targetChars.length ||
            Array.from(currentDigits).some((el, i) => el.getAttribute('data-type') !== (isNaN(targetChars[i]) ? 'sep' : 'digit'));

        if (rebuildNeeded) {
            digitsEl.innerHTML = '';
            targetChars.forEach(ch => {
                const span = document.createElement('span');
                if (ch === ',' || ch === '-') {
                    span.className = 'od-digit od-comma';
                    span.setAttribute('data-type', 'sep');
                    span.textContent = ch;
                } else {
                    span.className = 'od-digit';
                    span.setAttribute('data-type', 'digit');
                    span.setAttribute('data-current', '0');
                    // 建立 0-9 的滞動条
                    const strip = document.createElement('div');
                    strip.className = 'od-strip';
                    for (let d = 0; d <= 9; d++) {
                        const s = document.createElement('span');
                        s.textContent = d;
                        strip.appendChild(s);
                    }
                    span.appendChild(strip);
                }
                digitsEl.appendChild(span);
            });
        }

        // 動畫每個數字位
        const allDigitEls = digitsEl.querySelectorAll('.od-digit[data-type="digit"]');
        const numericChars = targetChars.filter(c => !isNaN(c));

        allDigitEls.forEach((el, i) => {
            const targetDigit = parseInt(numericChars[i] || '0');
            const strip = el.querySelector('.od-strip');
            if (!strip) return;

            // 初始化：拿目前推算的初始密
            const currentDigit = parseInt(el.getAttribute('data-current')) || 0;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${currentDigit}em)`;

            // 下一沀運行動畫
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    strip.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
                    strip.style.transform = `translateY(-${targetDigit}em)`;
                    el.setAttribute('data-current', targetDigit);
                });
            });
        });

        // 更新分隔符
        const allSepEls = digitsEl.querySelectorAll('.od-digit.od-comma');
        const sepChars = targetChars.filter(c => c === ',' || c === '-');
        allSepEls.forEach((el, i) => { el.textContent = sepChars[i] || ','; });
    };

    let chartInstances = {};

    // --- 批量管理狀態 ---
    const manageMode = { tx: false, inv: false, debt: false };
    const selectedIds = { tx: new Set(), inv: new Set(), debt: new Set() };

    const updateDashboard = (animate = true) => {
        const data = getCalculatedData();

        // Odometer 更新
        animateOdometer('total-networth', data.netWorth);
        animateOdometer('total-liabilities', data.totalDebts);
        animateOdometer('cash-demand', data.demandDeposit);
        animateOdometer('cash-reserve', data.reserveCash);
        animateOdometer('cash-total', data.currentCash);
        animateOdometer('total-assets', data.totalAssets);

        // Hero Banner 負數樣式
        const heroBanner = document.getElementById('hero-banner');
        if (heroBanner) {
            heroBanner.classList.toggle('hero-negative', data.netWorth < 0);
        }

        // --- 目標與預算 UI 更新 (New) ---
        const savingsPctEl = document.getElementById('savings-pct');
        const savingsLabelEl = document.getElementById('savings-label');
        const savingsBarEl = document.getElementById('savings-bar');
        if (savingsPctEl) {
            savingsPctEl.textContent = `${Math.round(data.savingsProgress)}%`;
            const remainingGoal = Math.max(0, data.goal - data.totalAssets);
            savingsLabelEl.textContent = remainingGoal > 0 ? `距離目標還差 NT$ ${Math.round(remainingGoal).toLocaleString()}` : '🎉 已達成目標！';
            savingsBarEl.style.width = `${data.savingsProgress}%`;
        }

        const budgetRemEl = document.getElementById('budget-remaining');
        const budgetPctEl = document.getElementById('budget-used-pct');
        const budgetBarEl = document.getElementById('budget-bar');
        if (budgetRemEl) {
            budgetRemEl.textContent = `NT$ ${Math.round(data.budgetRemaining).toLocaleString()}`;
            budgetPctEl.textContent = `已使用 ${Math.round(data.budgetProgress)}%`;
            budgetBarEl.style.width = `${data.budgetProgress}%`;
            
            // 預算顏色警示
            if (data.budgetProgress > 100) budgetBarEl.style.background = 'var(--danger)';
            else if (data.budgetProgress > 80) budgetBarEl.style.background = 'var(--warning)';
            else budgetBarEl.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        }

        // 圓餅圖更新
        if (chartInstances.asset) {
            let cryptoValue = 0, stockValue = 0, bondValue = 0, commodityValue = 0;
            state.investments.forEach(i => {
                if (i.type === 'crypto') cryptoValue += (i.amount * i.currentPrice);
                else if (i.type === 'bonds') bondValue += (i.amount * i.currentPrice);
                else if (i.type === 'commodity') commodityValue += (i.amount * i.currentPrice);
                else stockValue += (i.amount * i.currentPrice);
            });
            chartInstances.asset.data.datasets[0].data = [cryptoValue, stockValue, bondValue, commodityValue, data.currentCash];
            chartInstances.asset.update();
        }

        // 水平長條圖更新
        if (chartInstances.allocation && data.totalAssets > 0) {
            let cryptoVal = 0, twStockVal = 0, usStockVal = 0, bondsVal = 0, commVal = 0;
            state.investments.forEach(i => {
                if (i.type === 'crypto') cryptoVal += i.amount * i.currentPrice;
                else if (i.type === 'tw_stock') twStockVal += i.amount * i.currentPrice;
                else if (i.type === 'us_stock') usStockVal += i.amount * i.currentPrice;
                else if (i.type === 'bonds') bondsVal += i.amount * i.currentPrice;
                else if (i.type === 'commodity') commVal += i.amount * i.currentPrice;
            });
            const pct = v => parseFloat((v / data.totalAssets * 100).toFixed(1));
            chartInstances.allocation.data.datasets[0].data = [
                pct(cryptoVal), pct(twStockVal), pct(usStockVal), pct(bondsVal), pct(commVal), pct(data.currentCash)
            ];
            chartInstances.allocation.update();
        }

        if (chartInstances.cashflow) {
            chartInstances.cashflow.data.datasets[0].data[5] = data.tIncome;
            chartInstances.cashflow.data.datasets[1].data[5] = data.tExpense;
            chartInstances.cashflow.update();
        }
    };

    const fetchPrices = async () => {
        if (state.investments.length === 0) return;

        const syncStatus = document.getElementById('sync-status');
        if (syncStatus) syncStatus.innerHTML = '<i class="fa-solid fa-rotate spinner"></i> 即時 API 報價同步中...';

        let changed = false;

        let twDataCache = null;
        if (state.investments.some(i => i.type === 'tw_stock')) {
            try {
                let res = await fetch('https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'));
                if (res.ok) twDataCache = await res.json();
            } catch (e) { console.log('TWSE API fetch error'); }
        }

        for (let inv of state.investments) {
            try {
                if (inv.type === 'crypto') {
                    let sym = inv.symbol.toUpperCase() + 'USDT';
                    let res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}`);
                    if (res.ok) {
                        let json = await res.json();
                        let updatedPrice = parseFloat(json.price) * 32.5;
                        if (updatedPrice > 0 && Math.abs(inv.currentPrice - updatedPrice) > 1) { inv.currentPrice = updatedPrice; changed = true; }
                    }
                } else if (inv.type === 'tw_stock') {
                    if (twDataCache) {
                        let pureSym = inv.symbol.replace('.TW', '');
                        let stockInfo = twDataCache.find(s => s.Code === pureSym);
                        if (stockInfo && stockInfo.ClosingPrice) {
                            let updatedPrice = parseFloat(stockInfo.ClosingPrice);
                            if (updatedPrice > 0 && Math.abs(inv.currentPrice - updatedPrice) > 1) {
                                inv.currentPrice = updatedPrice;
                                changed = true;
                            }
                        }
                    }
                } else if (inv.type === 'us_stock' || inv.type === 'commodity' || inv.type === 'bonds') {
                    let tUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(inv.symbol)}`;
                    let proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(tUrl)}`;
                    let res = await fetch(proxyUrl);
                    if (res.ok) {
                        let yahooData = await res.json();
                        if (yahooData.chart && yahooData.chart.result && yahooData.chart.result[0]) {
                            let price = yahooData.chart.result[0].meta.regularMarketPrice;
                            let currency = yahooData.chart.result[0].meta.currency;
                            let updatedPrice = currency === 'USD' ? (price * 32.5) : price;
                            if (updatedPrice > 0 && Math.abs(inv.currentPrice - updatedPrice) > 1) { inv.currentPrice = updatedPrice; changed = true; }
                        }
                    }
                }
            } catch (e) { console.log('Fetch error for', inv.symbol); }
        }

        if (changed) saveState();
        if (syncStatus) syncStatus.innerHTML = '<i class="fa-solid fa-check circle-check text-success"></i> 最新報價已同步 <span style="font-size:0.8rem; opacity:0.8; margin-left:5px;">(資料來源: TWSE / Binance，僅供參考)</span>';
    };

    const fForm = document.getElementById('transaction-form');
    if (fForm) {
        fForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!document.getElementById('t-amount').value) return alert("請輸入金額");

            captureHistory();

            const accId = document.getElementById('t-account').value;
            const txData = {
                type: document.getElementById('t-type').value,
                amount: parseFloat(document.getElementById('t-amount').value),
                category: document.getElementById('t-category').value,
                date: document.getElementById('t-date').value,
                accountId: accId
            };

            if (editingState.txId) {
                const idx = state.transactions.findIndex(t => t.id === editingState.txId);
                if (idx !== -1) {
                    addLog('cashflow', 'edit', `修改紀錄: ${txData.category}`, txData.type === 'income' ? txData.amount : -txData.amount);
                    state.transactions[idx] = { ...state.transactions[idx], ...txData };
                }
                editingState.txId = null;
                const btn = document.querySelector('#transaction-form .submit-btn');
                btn.innerHTML = '加入紀錄'; btn.style.background = '';
            } else {
                txData.id = Date.now().toString();
                addLog('cashflow', 'add', `新增紀錄: ${txData.category}`, txData.type === 'income' ? txData.amount : -txData.amount);
                state.transactions.unshift(txData);

                // 更新實體帳戶餘額
                if (accId) {
                    const accIdx = state.accounts.findIndex(a => a.id === accId);
                    if (accIdx !== -1) {
                        if (txData.type === 'income') state.accounts[accIdx].balance += txData.amount;
                        else state.accounts[accIdx].balance -= txData.amount;
                    }
                }
            }
            saveState(); fForm.reset(); document.getElementById('t-date').value = today;
            renderAccounts(); // 刷新帳戶顯示
            document.getElementById('t-risk-indicator').innerHTML = ''; // 清除風險提示
        });
    }

    // --- 智能風險分析即時觸發 ---
    document.getElementById('t-amount')?.addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value);
        const risks = analyzeSpendingRisk(amount);
        const indicator = document.getElementById('t-risk-indicator');
        if (!indicator) return;

        if (risks && risks.length > 0) {
            indicator.innerHTML = risks.map(r => `<div class="risk-item ${r.level}">${r.msg}</div>`).join('');
        } else {
            indicator.innerHTML = '';
        }
    });

    // --- 目標與預算設定事件 ---
    document.getElementById('set-goal-btn')?.addEventListener('click', () => {
        const result = prompt('【設定長期存錢目標】\n請輸入您的目標資產總額 (NT$):', state.savingsGoal || 1000000);
        if (result !== null && !isNaN(parseFloat(result))) {
            state.savingsGoal = parseFloat(result);
            saveState();
        }
    });

    document.getElementById('set-budget-btn')?.addEventListener('click', () => {
        const result = prompt('【設定每月支出預算】\n請輸入您每個月的預算上限 (NT$):', state.monthlyBudget || 20000);
        if (result !== null && !isNaN(parseFloat(result))) {
            state.monthlyBudget = parseFloat(result);
            saveState();
        }
    });

    const iForm = document.getElementById('invest-form');
    if (iForm) {
        iForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let inputAmount = parseFloat(document.getElementById('i-amount').value);
            let inputAvgCost = parseFloat(document.getElementById('i-cost').value);

            if (!inputAmount || isNaN(inputAvgCost)) {
                return alert("請填寫數量與平均買入單價！");
            }

            let type = document.getElementById('i-type').value;
            let symbol = document.getElementById('i-symbol').value.toUpperCase();

            if ((type === 'tw_stock' || type === 'bonds') && /^\d{4,5}[B]?$/.test(symbol)) {
                if (!symbol.endsWith('.TW')) symbol += '.TW';
            }

            let calculatedTotalCost = inputAmount * inputAvgCost;

            // [修正] 字典屬性應為 .sym 而非 .symbol
            const supportedItems = assetDictionary[type] || [];
            const isSupported = supportedItems.some(item => item.sym && item.sym.toUpperCase() === symbol);

            if (!isSupported) {
                const proceed = confirm(`⚠️ 注意：代號 [ ${symbol} ] 未在系統同步清單中。\n\n這代表我們無法為您自動更新市價與計算損益。您仍要「硬執行」建立此部位嗎？\n\n(點擊取消可回頭修正，點擊確定則建立離線部位)`);
                if (!proceed) return;
            }

            captureHistory();

            const accId = document.getElementById('i-account').value;
            const invData = {
                type: type,
                symbol: symbol,
                amount: inputAmount,
                totalCost: calculatedTotalCost,
                currentPrice: inputAvgCost,
                accountId: accId
            };

            if (editingState.invId) {
                const idx = state.investments.findIndex(i => i.id === editingState.invId);
                if (idx !== -1) {
                    addLog('investments', 'edit', `修改部位資料: ${invData.symbol}`);
                    invData.currentPrice = state.investments[idx].currentPrice;
                    state.investments[idx] = { ...state.investments[idx], ...invData };
                }
                editingState.invId = null;
                const submitBtn = document.querySelector('#invest-form .submit-btn');
                submitBtn.innerHTML = '新增至投資組合'; submitBtn.style.background = 'linear-gradient(135deg, #38bdf8, #8b5cf6)';
            } else {
                let invId = Date.now().toString();
                let existingIdx = state.investments.findIndex(i => i.symbol === symbol && i.type === type);
                if (existingIdx !== -1) {
                    addLog('investments', 'add', `合併加碼部位: ${symbol}`, -invData.totalCost);
                    state.investments[existingIdx].amount += invData.amount;
                    state.investments[existingIdx].totalCost += invData.totalCost;
                    state.investments[existingIdx].currentPrice = (state.investments[existingIdx].totalCost / state.investments[existingIdx].amount);
                    invId = state.investments[existingIdx].id; // 取得原有的 ID
                    alert(`聰明合併：發現您已有 [ ${symbol} ]。系統已主動為您合併入現有庫存並重新計算均價！`);
                } else {
                    addLog('investments', 'add', `新增投資部位: ${symbol}`, -invData.totalCost);
                    invData.id = invId;
                    state.investments.push(invData);
                }

                // [連動系統] 僅當用戶勾選「同步產生支出」時才扣除現金
                const syncCash = document.getElementById('i-sync-cash')?.checked;
                if (syncCash) {
                    const accId = invData.accountId;
                    state.transactions.unshift({
                        id: 'sys-' + Date.now(),
                        type: 'expense',
                        amount: calculatedTotalCost,
                        category: '[系統] 投資買入',
                        date: today,
                        relatedAsset: symbol,
                        linkId: invId,
                        accountId: accId
                    });

                    // 更新帳戶餘額
                    if (accId) {
                        const accIdx = state.accounts.findIndex(a => a.id === accId);
                            state.accounts[accIdx].balance -= calculatedTotalCost;
                        }
                    }
                }
                saveState(); iForm.reset(); fetchPrices();
                renderAccounts(); // 刷新帳戶顯示
        });
    }

    const dForm = document.getElementById('debt-form');
    if (dForm) {
        dForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!document.getElementById('d-total').value) return;
            captureHistory();
            const syncCash = document.getElementById('d-sync-cash')?.checked;
            const debtData = {
                bank: document.getElementById('d-bank').value,
                repayBank: document.getElementById('d-repay-bank').value,
                name: document.getElementById('d-name').value,
                total: parseFloat(document.getElementById('d-total').value),
                years: parseFloat(document.getElementById('d-years').value),
                monthly: parseFloat(document.getElementById('d-monthly').value),
                payDate: parseInt(document.getElementById('d-paydate').value),
                startDate: document.getElementById('d-startdate').value,
                // [優化] 如果是期初負債 (不勾選同步)，將處理日期設為今天，避免補錄過往交易
                lastProcessedDate: syncCash ? document.getElementById('d-startdate').value : today
            };

            if (editingState.debtId) {
                const idx = state.debts.findIndex(d => d.id === editingState.debtId);
                if (idx !== -1) {
                    addLog('liabilities', 'edit', `修改貸款資訊: ${debtData.name}`);
                    state.debts[idx] = { ...state.debts[idx], ...debtData };
                }
                editingState.debtId = null;
                const btn = document.querySelector('#debt-form .submit-btn');
                btn.innerHTML = '新增負債紀錄'; btn.style.background = 'linear-gradient(135deg, #f43f5e, #f97316)';
            } else {
                debtData.id = Date.now().toString();
                addLog('liabilities', 'add', `新增貸款: ${debtData.name}`, syncCash ? debtData.total : 0);
                state.debts.push(debtData);

                // [連動系統] 僅當用戶勾選「同步產生收入」時才增加現金
                if (syncCash) {
                    state.transactions.unshift({
                        id: 'sys-debt-' + Date.now(),
                        type: 'income',
                        amount: debtData.total,
                        category: '[系統] 貸款撥款紀錄',
                        date: today,
                        relatedAsset: debtData.name,
                        linkId: debtData.id
                    });
                    alert(`撥款成功！已自動為您記錄一筆 [ ${debtData.total.toLocaleString()} ] 的現金流入。`);
                }
            }
            saveState(); dForm.reset();
            document.getElementById('d-apr-display').innerText = '- %';
        });
    }

    let dcaState = { invId: null, symbol: null };
    const buyModal = document.getElementById('buy-modal');
    const bmForm = document.getElementById('buy-modal-form');

    document.getElementById('bm-cancel')?.addEventListener('click', () => {
        buyModal.classList.remove('show');
        dcaState = { invId: null, symbol: null };
        if (bmForm) bmForm.reset();
        document.getElementById('bm-result').innerHTML = '';
    });

    if (bmForm) {
        bmForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cost = parseFloat(document.getElementById('bm-cost').value);
            let amount = parseFloat(document.getElementById('bm-amount').value);
            const rmResult = document.getElementById('bm-result');

            const itemIdx = state.investments.findIndex(i => i.id === dcaState.invId);
            if (itemIdx === -1) return;
            const target = state.investments[itemIdx];

            if (!amount) {
                rmResult.innerHTML = '<i class="fa-solid fa-rotate spinner" style="color:var(--primary);"></i> 正在抓取最新價幫您換算自動給予股數...';
                let currentTwdPrice = target.currentPrice > 0 ? target.currentPrice : 1;
                try {
                    if (target.type === 'crypto') {
                        let res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${target.symbol}USDT`);
                        if (res.ok) { let json = await res.json(); currentTwdPrice = parseFloat(json.price) * 32.5; }
                    } else if (target.type === 'tw_stock') {
                        let res = await fetch('https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL'));
                        if (res.ok) {
                            let twData = await res.json();
                            let pureSym = target.symbol.replace('.TW', '');
                            let stockInfo = twData.find(s => s.Code === pureSym);
                            if (stockInfo && stockInfo.ClosingPrice) {
                                currentTwdPrice = parseFloat(stockInfo.ClosingPrice);
                            }
                        }
                    } else if (target.type === 'us_stock' || target.type === 'commodity') {
                        let tUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${target.symbol}`;
                        let res = await fetch(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(tUrl)}`);
                        if (res.ok) {
                            let yahooData = await res.json();
                            if (yahooData.chart && yahooData.chart.result) {
                                let price = yahooData.chart.result[0].meta.regularMarketPrice;
                                let currency = yahooData.chart.result[0].meta.currency;
                                currentTwdPrice = currency === 'USD' ? price * 32.5 : price;
                            }
                        }
                    }
                } catch (e) { console.log(e); }
                amount = cost / currentTwdPrice;
                amount = parseFloat(amount.toFixed(6));
                target.currentPrice = currentTwdPrice;
            }

            captureHistory();

            const action = document.getElementById('bm-action') ? document.getElementById('bm-action').value : 'buy';

            if (action === 'buy') {
                addLog('investments', 'trade', `加碼買進: ${target.symbol}`, -cost);
                target.totalCost += cost;
                target.amount += amount;

                // [連動系統]
                const accId = target.accountId;
                state.transactions.unshift({
                    id: 'sys-' + Date.now(),
                    type: 'expense',
                    amount: cost,
                    category: '[系統] 投資買入',
                    date: today,
                    relatedAsset: target.symbol,
                    linkId: target.id,
                    accountId: accId
                });

                if (accId) {
                    const accIdx = state.accounts.findIndex(a => a.id === accId);
                    if (accIdx !== -1) state.accounts[accIdx].balance -= cost;
                }
                alert(`買進成功！我們已自動為您在「${state.accounts.find(a => a.id === accId)?.name || '預設'}」帳戶記錄一筆支出。`);
            } else if (action === 'sell') {
                if (amount > target.amount) {
                    return alert(`賣出無效保護：您填寫的需求賣出數量 (${amount}) 大於目前的庫存總量 (${target.amount})！`);
                }
                let avgCost = target.totalCost / target.amount;
                addLog('investments', 'trade', `賣出部位: ${target.symbol}`, cost);
                target.amount -= amount;
                target.totalCost -= (amount * avgCost);
                if (target.amount <= 0.00000001) {
                    target.amount = 0;
                    target.totalCost = 0;
                }

                // [連動系統]
                const accId = target.accountId;
                state.transactions.unshift({
                    id: 'sys-' + Date.now(),
                    type: 'income',
                    amount: cost,
                    category: '[系統] 投資賣出',
                    date: today,
                    relatedAsset: target.symbol,
                    linkId: target.id,
                    accountId: accId
                });

                if (accId) {
                    const accIdx = state.accounts.findIndex(a => a.id === accId);
                    if (accIdx !== -1) state.accounts[accIdx].balance += cost;
                }
                alert(`賣出成功！我們已自動為您在「${state.accounts.find(a => a.id === accId)?.name || '預設'}」帳戶記錄一筆收入。`);
            }

            saveState();
            bmForm.reset();
            rmResult.innerHTML = '';
            buyModal.classList.remove('show');
            renderAccounts(); // 刷新帳戶顯示
            fetchPrices(); // 刷新市價
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.inv-buy-btn')) {
            const id = e.target.closest('.inv-buy-btn').getAttribute('data-id');
            const item = state.investments.find(i => i.id === id);
            if (item) {
                dcaState = { invId: id, symbol: item.symbol };
                document.getElementById('buy-modal-title').innerText = `${item.symbol} - 買進操作`;
                document.getElementById('bm-action').value = 'buy'; // 強制設為買進
                buyModal.classList.add('show');
            }
        }

        if (e.target.closest('.inv-sell-btn')) {
            const id = e.target.closest('.inv-sell-btn').getAttribute('data-id');
            const item = state.investments.find(i => i.id === id);
            if (item) {
                dcaState = { invId: id, symbol: item.symbol };
                document.getElementById('buy-modal-title').innerText = `${item.symbol} - 賣出操作`;
                document.getElementById('bm-action').value = 'sell'; // 強制設為賣出
                buyModal.classList.add('show');
            }
        }

        if (e.target.closest('.edit-tx-btn')) {
            const id = e.target.closest('.edit-tx-btn').getAttribute('data-id');
            const item = state.transactions.find(t => t.id === id);
            if (item) {
                if (item.linkId) return alert('此紀錄為系統連動項目，請由投資組合端進行買賣操作或刪除。');
                document.getElementById('t-type').value = item.type;
                document.getElementById('t-amount').value = item.amount;
                document.getElementById('t-category').value = item.category;
                document.getElementById('t-date').value = item.date;
                document.getElementById('t-account').value = item.accountId || '';
                editingState.txId = id;
                const btn = document.querySelector('#transaction-form .submit-btn');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i> 儲存修改'; btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                document.getElementById('transaction-form').scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (e.target.closest('.edit-inv-btn')) {
            const id = e.target.closest('.edit-inv-btn').getAttribute('data-id');
            const item = state.investments.find(i => i.id === id);
            if (item) {
                document.getElementById('i-type').value = item.type;
                let showSymbol = item.symbol.endsWith('.TW') ? item.symbol.replace('.TW', '') : item.symbol;
                document.getElementById('i-symbol').value = showSymbol;
                document.getElementById('i-amount').value = item.amount;
                let avgCost = item.amount > 0 ? (item.totalCost / item.amount).toFixed(2) : '';
                document.getElementById('i-cost').value = avgCost;
                document.getElementById('i-account').value = item.accountId || '';
                editingState.invId = id;
                const btn = document.querySelector('#invest-form .submit-btn');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i> 儲存修改'; btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                document.getElementById('invest-form').scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (e.target.closest('.del-debt-btn')) {
            const id = e.target.closest('.del-debt-btn').getAttribute('data-id');
            const item = state.debts.find(d => d.id === id);
            if (!item) return;

            // 建立三鍵式彈窗
            const modal = document.createElement('div');
            modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(10px);";
            modal.innerHTML = `
                <div class="card glass" style="width:420px; max-width: 90%; padding:30px; text-align:center; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin-bottom:15px; color:var(--text-main);">刪除負債確認</h3>
                    <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:25px; line-height:1.5;">您要如何處理這筆負債？</p>
                    <button id="del-only" class="submit-btn" style="width:100%; margin-bottom:12px; background:var(--primary);">僅刪除項目</button>
                    <button id="del-both" class="submit-btn" style="width:100%; margin-bottom:20px; background:var(--danger);">刪除項目與紀錄</button>
                    <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top:15px;">
                        <button id="del-cancel" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">取消</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('#del-only').onclick = () => {
                captureHistory();
                addLog('liabilities', 'delete', `刪除貸款項目 (保留還款紀錄): ${item.name}`);
                // 解除所有關聯交易的「系統鎖定」
                state.transactions.forEach(t => {
                    if (t.linkId === id) delete t.linkId;
                });
                state.debts = state.debts.filter(d => d.id !== id);
                saveState();
                document.body.removeChild(modal);
            };
            modal.querySelector('#del-both').onclick = () => {
                captureHistory();
                addLog('liabilities', 'delete', `完整刪除貸款與所有還款紀錄: ${item.name}`);
                state.transactions = state.transactions.filter(t => t.linkId !== id);
                state.debts = state.debts.filter(d => d.id !== id);
                saveState();
                document.body.removeChild(modal);
            };
            modal.querySelector('#del-cancel').onclick = () => {
                document.body.removeChild(modal);
            };
        }

        // [新增] 提前結清邏輯
        if (e.target.closest('.settle-debt-btn')) {
            const id = e.target.closest('.settle-debt-btn').getAttribute('data-id');
            const item = state.debts.find(d => d.id === id);
            if (!item) return;

            const currentBalance = calculateBalance(item);
            if (confirm(`確定要提前結清「${item.name}」嗎？\n\n系統將產生一筆 NT$ ${Math.round(currentBalance).toLocaleString()} 的「貸款提前結清」支出，隨後將此負債結案。`)) {
                captureHistory();
                addLog('liabilities', 'settle', `提前結清貸款: ${item.name}`, -Math.round(currentBalance));
                
                // 1. 產生結清支出
                state.transactions.unshift({
                    id: 'settle-' + Date.now(),
                    type: 'expense',
                    amount: Math.round(currentBalance),
                    category: '[系統] 貸款提前結清',
                    date: today,
                    relatedAsset: item.name,
                    linkId: item.id
                });

                // 2. 移除負債
                state.transactions.forEach(t => {
                    if (t.linkId === id) delete t.linkId;
                });
                state.debts = state.debts.filter(d => d.id !== id);
                saveState();
                alert('結清成功！已為您記錄此筆支出並結案。');
            }
        }

        if (e.target.closest('.edit-debt-btn')) {
            const id = e.target.closest('.edit-debt-btn').getAttribute('data-id');
            const item = state.debts.find(d => d.id === id);
            if (item) {
                document.getElementById('d-bank').value = item.bank || '';
                document.getElementById('d-repay-bank').value = item.repayBank || '';
                document.getElementById('d-name').value = item.name;
                document.getElementById('d-total').value = item.total;
                document.getElementById('d-years').value = item.years || '';
                document.getElementById('d-monthly').value = item.monthly;
                document.getElementById('d-paydate').value = item.payDate || '';
                document.getElementById('d-startdate').value = item.startDate || '';
                editingState.debtId = id;
                const btn = document.querySelector('#debt-form .submit-btn');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i> 儲存修改'; btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                document.getElementById('debt-form').scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (e.target.closest('.del-tx-btn')) {
            const id = e.target.closest('.del-tx-btn').getAttribute('data-id');
            const item = state.transactions.find(t => t.id === id);
            if (item && item.linkId && state.debts.some(d => d.id === item.linkId)) {
                alert('此紀錄為負債系統連動項目，若欲刪除，請至「負債管理」進行項目結清或移除。');
                return;
            }

            if (confirm('確定刪除此收支紀錄嗎？')) {
                captureHistory();
                addLog('cashflow', 'delete', `刪除紀錄: ${item.category}`, item.type === 'income' ? -item.amount : item.amount);
                state.transactions = state.transactions.filter(t => t.id !== id);
                saveState();
            }
        }

        if (e.target.closest('.del-inv-btn')) {
            const id = e.target.closest('.del-inv-btn').getAttribute('data-id');
            const targetInv = state.investments.find(i => i.id === id);
            if (!targetInv) return;

            if (confirm(`確定要刪除 [ ${targetInv.symbol} ] 嗎？\n\n這將會同步撤銷與此特定部位相關的所有自動交易紀錄 (例如買入支出)，以確保您的現金水位正確回歸。`)) {
                captureHistory();
                addLog('investments', 'delete', `刪除投資部位: ${targetInv.symbol}`);
                // 1. 移除投資部位
                state.investments = state.investments.filter(i => i.id !== id);
                // 2. 精準連動撤銷：僅刪除 linkId 匹配的自動交易
                state.transactions = state.transactions.filter(t => t.linkId !== id);
                saveState();
            }
        }
    });

    const renderTransactions = () => {
        const listDiv = document.getElementById('transaction-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        if (state.transactions.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無紀錄</p>';

        if (manageMode.tx) listDiv.classList.add('manage-active');
        else listDiv.classList.remove('manage-active');

        state.transactions.forEach(t => {
            let isInc = t.type === 'income';
            const isLocked = t.linkId && state.debts.some(d => d.id === t.linkId);
            const isChecked = selectedIds.tx.has(t.id);

            listDiv.innerHTML += `
                <div class="tx-item">
                    <div class="item-checkbox-container">
                        <div class="custom-checkbox ${isLocked ? 'disabled' : ''} ${isChecked ? 'checked' : ''}" 
                             data-id="${t.id}" data-type="tx"></div>
                    </div>
                    <div class="tx-info">
                        <div class="tx-icon ${isInc ? 'ic-inc' : 'ic-exp'}"><i class="fa-solid ${isInc ? 'fa-arrow-trend-up' : 'fa-basket-shopping'}"></i></div>
                        <div class="tx-details"><div class="tx-cat">${t.category}</div><div class="tx-date">${t.date}</div></div>
                    </div>
                    <div class="tx-right-panel" style="display:flex; align-items:center; gap: 15px;">
                        <div class="tx-amount ${isInc ? 'positive' : 'negative'}">${isInc ? '+' : '-'} NT$ ${Number(t.amount).toLocaleString()}</div>
                        <div class="item-actions">
                            ${isLocked ? `
                                <span style="font-size: 0.75rem; color: var(--primary); opacity: 0.7; font-weight: 500;">
                                    <i class="fa-solid fa-lock"></i> 系統鎖定
                                </span>
                            ` : `
                                <button class="action-btn edit-tx-btn" data-id="${t.id}" title="編輯"><i class="fa-solid fa-pen" style="pointer-events: none;"></i></button>
                                <button class="action-btn del-tx-btn" data-id="${t.id}" title="刪除"><i class="fa-solid fa-trash" style="pointer-events: none;"></i></button>
                            `}
                        </div>
                    </div>
                </div>`;
        });
    };

    const renderInvestments = () => {
        const listDiv = document.getElementById('invest-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        if (state.investments.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無部位</p>';

        const displayCurrency = document.getElementById('portfolio-currency')?.value || 'TWD';
        let fxRate = 1;
        if (displayCurrency === 'USD') fxRate = 1 / 32.5;
        if (displayCurrency === 'HKD') fxRate = 1 / 4.15;
        if (displayCurrency === 'SGD') fxRate = 1 / 24.1;

        const formatVal = (val) => {
            let converted = val * fxRate;
            return converted.toLocaleString('en-US', {
                maximumFractionDigits: displayCurrency === 'TWD' ? 0 : 2,
                minimumFractionDigits: displayCurrency === 'TWD' ? 0 : 2
            });
        };

        // 1. 定義分類順序與語系標籤
        const categoryConfig = [
            { type: 'crypto', label: '加密貨幣 (Crypto)', icon: 'fa-bitcoin-sign', color: '#a855f7' },
            { type: 'tw_stock', label: '台灣股市 (TW Stock)', icon: 'fa-chart-line', color: '#3b82f6' },
            { type: 'us_stock', label: '美國股市 (US Stock)', icon: 'fa-flag-usa', color: '#10b981' },
            { type: 'bonds', label: '債券與 ETF (Bonds)', icon: 'fa-file-contract', color: '#f59e0b' },
            { type: 'commodity', label: '匯率與貴金屬 (FX & Commodity)', icon: 'fa-coins', color: '#eab308' }
        ];

        // 2. 進行分組資料處理
        categoryConfig.forEach(cat => {
            const filtered = state.investments.filter(i => i.type === cat.type);
            if (filtered.length === 0) return;

            // 計算分類小計
            let groupTotalVal = 0;
            filtered.forEach(i => {
                groupTotalVal += (Number(i.amount) * Number(i.currentPrice));
            });

            // 建立分類容器
            const groupSection = document.createElement('div');
            groupSection.className = 'asset-group';

            const isCollapsed = collapsedCategories.has(cat.type);

            // 建立分類標頭 (毛玻璃感)
            groupSection.innerHTML = `
                <div class="asset-group-header" data-type="${cat.type}">
                    <div class="group-title" style="color: ${cat.color};">
                        <i class="fa-solid fa-chevron-down toggle-icon ${isCollapsed ? 'collapsed' : ''}"></i>
                        <i class="fa-solid ${cat.icon}"></i>
                        <span>${cat.label}</span>
                    </div>
                    <div class="group-total">小計: ${displayCurrency} ${formatVal(groupTotalVal)}</div>
                </div>
                <div class="asset-group-content ${isCollapsed ? 'collapsed' : ''}" id="group-content-${cat.type}"></div>
            `;
            listDiv.appendChild(groupSection);

            // 加入點擊摺疊事件
            groupSection.querySelector('.asset-group-header').addEventListener('click', () => {
                if (collapsedCategories.has(cat.type)) {
                    collapsedCategories.delete(cat.type);
                } else {
                    collapsedCategories.add(cat.type);
                }
                renderInvestments();
            });

            const contentDiv = document.getElementById(`group-content-${cat.type}`);

            // 3. 渲染該類別細項
            filtered.forEach(i => {
                let iconClass = 'ic-stock';
                let iconCode = 'fa-chart-line';
                if (i.type === 'crypto') { iconClass = 'ic-crypto'; iconCode = 'fa-bitcoin-sign'; }
                else if (i.type === 'bonds') { iconClass = 'ic-debt'; iconCode = 'fa-file-contract'; }
                else if (i.type === 'commodity') { iconClass = 'ic-commodity'; iconCode = 'fa-coins'; }

                let val = Number(i.amount) * Number(i.currentPrice);
                let cost = Number(i.totalCost) || val;
                let pnl = val - cost;
                let pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
                let pnlClass = pnl >= 0 ? 'price-up' : 'price-down';
                let pnlSign = pnl >= 0 ? '+' : '';

                const isChecked = selectedIds.inv.has(i.id);

                const accName = state.accounts?.find(a => a.id === i.accountId)?.name || '未指定錢包';
                contentDiv.innerHTML += `
                    <div class="asset-item">
                        <div class="item-checkbox-container">
                            <div class="custom-checkbox ${isChecked ? 'checked' : ''}" data-id="${i.id}" data-type="inv"></div>
                        </div>
                        <div class="tx-info">
                            <div class="asset-icon ${iconClass}"><i class="fa-solid ${iconCode}"></i></div>
                            <div class="tx-details">
                                <div class="item-name">${i.symbol} <span style="font-size:0.7rem; color:var(--primary); background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:4px; margin-left:5px;">${accName}</span></div>
                                <div class="item-sub">${i.type === 'bonds' ? '債券' : '資產'} | 數量: ${i.amount} | 成本: ${formatVal(cost)}</div>
                            </div>
                        </div>
                        <div class="tx-right-panel" style="display:flex; align-items:center; gap: 10px;">
                            <div style="text-align: right; min-width: 100px;">
                                <div class="item-value text-main">${formatVal(val)}</div>
                                <div class="item-price-change ${pnlClass}">
                                    ${pnlSign} ${formatVal(Math.abs(pnl))} (${pnlSign}${pnlPercent.toFixed(2)}%)
                                </div>
                            </div>
                            <div class="item-actions" style="gap: 5px;">
                                <button class="action-btn inv-buy-btn" data-id="${i.id}" title="買進" style="background: #10b981; color: white; border:none;">買入</button>
                                <button class="action-btn inv-sell-btn" data-id="${i.id}" title="賣出" style="background: #ef4444; color: white; border:none;">賣出</button>
                                <button class="action-btn edit-inv-btn" data-id="${i.id}" title="修改帳面資料"><i class="fa-solid fa-pen"></i></button>
                                <button class="action-btn del-inv-btn" data-id="${i.id}" title="刪除明細"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    </div>`;
            });
        });
    };

    const renderDebts = () => {
        const listDiv = document.getElementById('debt-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        if (state.debts.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無貸款</p>';

        state.debts.forEach(d => {
            try {
                const currentBalance = calculateBalance(d);
                const elapsed = getElapsedMonths(d.startDate);
                const yearsSafe = Number(d.years) || 1;
                const totalMonths = yearsSafe * 12;
                const progress = Math.min(100, (elapsed / totalMonths) * 100);
                const apr = calculateAPR(Number(d.total) || 0, Number(d.monthly) || 0, yearsSafe);

                const isChecked = selectedIds.debt.has(d.id);

                listDiv.innerHTML += `
                    <div class="debt-item ${manageMode.debt ? 'manage-active' : ''}" id="debt-card-${d.id}">
                        <div class="debt-main-info" data-id="${d.id}">
                            <div class="item-checkbox-container">
                                <div class="custom-checkbox ${isChecked ? 'checked' : ''}" data-id="${d.id}" data-type="debt"></div>
                            </div>
                            <div class="tx-info">
                                <div class="debt-icon ic-debt"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                                <div class="tx-details">
                                    <div class="item-name">${d.name} <span style="font-size:0.75rem; color:var(--text-muted); opacity:0.8;">(${d.bank || '未設定銀行'})</span></div>
                                    <div class="item-sub">剩餘本金: NT$ ${Math.round(currentBalance).toLocaleString()} <i class="fa-solid fa-chevron-down debt-toggle-icon"></i></div>
                                </div>
                            </div>
                            <div class="tx-right-panel" style="display:flex; align-items:center; gap: 15px;">
                                <div class="item-value negative">- ${Math.round(currentBalance).toLocaleString()}</div>
                                <div class="item-actions">
                                    <button class="action-btn settle-debt-btn" data-id="${d.id}" title="提前結清" style="color: var(--success);"><i class="fa-solid fa-sack-dollar" style="pointer-events: none;"></i></button>
                                    <button class="action-btn edit-debt-btn" data-id="${d.id}" title="編輯"><i class="fa-solid fa-pen" style="pointer-events: none;"></i></button>
                                    <button class="action-btn del-debt-btn" data-id="${d.id}" title="刪除"><i class="fa-solid fa-trash" style="pointer-events: none;"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="debt-detail-panel" id="debt-detail-${d.id}">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">初始核貸金額</div>
                                    <div class="detail-value">NT$ ${Number(d.total || 0).toLocaleString()}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">實質年利率 (APR)</div>
                                    <div class="detail-value text-success">${apr} %</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">每月還款金額</div>
                                    <div class="detail-value">NT$ ${Number(d.monthly || 0).toLocaleString()}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">每月扣款日期</div>
                                    <div class="detail-value">${d.payDate || '1'} 號</div>
                                </div>
                            </div>
                            <div class="progress-container">
                                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                                    <span>還款進度</span>
                                    <span>${Math.floor(elapsed)} / ${totalMonths} 期</span>
                                </div>
                                <div class="progress-bar-bg">
                                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                                </div>
                                <div style="font-size:0.75rem; color:var(--text-muted); text-align:center;">
                                    已還款約 NT$ ${( (Number(d.monthly) || 0) * elapsed).toLocaleString()} 元
                                </div>
                            </div>
                        </div>
                    </div>`;
            } catch (err) {
                console.error("Error rendering debt item:", err);
            }
        });

        // 加入展開點擊事件
        document.querySelectorAll('.debt-main-info').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.item-actions')) return;
                const id = header.getAttribute('data-id');
                const detail = document.getElementById(`debt-detail-${id}`);
                const icon = header.querySelector('.debt-toggle-icon');
                detail.classList.toggle('show');
                icon.classList.toggle('open');
            });
        });
    };

    Chart.defaults.color = '#94a3b8'; Chart.defaults.font.family = "'Outfit', sans-serif";
    const initCharts = () => {
        const ctxAsset = document.getElementById('assetChart');
        if (ctxAsset) {
            chartInstances.asset = new Chart(ctxAsset.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['加密貨幣', '股票', '債券', '匯率/商品', '現金'],
                    datasets: [{
                        data: [1, 1, 1, 1, 1],
                        backgroundColor: ['#a855f7', '#3b82f6', '#f59e0b', '#eab308', '#10b981'],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 14, usePointStyle: true, font: { size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                                    return ` ${ctx.label}: NT$ ${Math.round(ctx.parsed).toLocaleString()} (${pct}%)`;
                                }
                            }
                        }
                    },
                    cutout: '78%'
                }
            });
        }

        // === 水平長條圖（各類資產佔比 %）===
        const ctxAlloc = document.getElementById('allocationBarChart');
        if (ctxAlloc) {
            chartInstances.allocation = new Chart(ctxAlloc.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['加密貨幣', '台灣股市', '美國股市', '債券/ETF', '匯率/商品', '現金'],
                    datasets: [{
                        data: [0, 0, 0, 0, 0, 0],
                        backgroundColor: ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#eab308', '#06b6d4'],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: { label: ctx => ` ${ctx.parsed.x.toFixed(1)}%` }
                        },
                        datalabels: false
                    },
                    scales: {
                        x: {
                            min: 0, max: 100,
                            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                            ticks: {
                                color: 'rgba(255,255,255,0.4)',
                                callback: v => v + '%',
                                font: { size: 11 }
                            }
                        },
                        y: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 12, weight: '600' } }
                        }
                    }
                }
            });
        }

        const ctxCashflow = document.getElementById('cashflowChart');
        if (ctxCashflow) {
            const rCtx = ctxCashflow.getContext('2d');
            const gInc = rCtx.createLinearGradient(0, 0, 0, 250); gInc.addColorStop(0, 'rgba(16, 185, 129, 0.9)'); gInc.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
            const gExp = rCtx.createLinearGradient(0, 0, 0, 250); gExp.addColorStop(0, 'rgba(239, 68, 68, 0.9)'); gExp.addColorStop(1, 'rgba(239, 68, 68, 0.1)');

            chartInstances.cashflow = new Chart(rCtx, {
                type: 'bar',
                data: { labels: ['11月', '12月', '1月', '2月', '3月', '4月（本月）'], datasets: [{ label: '總收入', data: [0, 0, 0, 0, 0, 0], backgroundColor: gInc, borderRadius: 8 }, { label: '總支出', data: [0, 0, 0, 0, 0, 0], backgroundColor: gExp, borderRadius: 8 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false } }, x: { grid: { display: false, drawBorder: false } } }, plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true } } } }
            });
        }
    };

    // [新增] 批量管理事件處理
    const setupManageListeners = (type) => {
        const btn = document.getElementById(`${type}-manage-btn`);
        const closeBtn = document.getElementById(`${type}-manage-close`);
        const toolbar = document.getElementById(`${type}-manage-toolbar`);
        const batchDelBtn = document.getElementById(`${type}-batch-del`);
        const countDisplay = document.getElementById(`${type}-selected-count`);

        if (!btn) return;

        btn.onclick = () => {
            manageMode[type] = true;
            selectedIds[type].clear();
            btn.style.display = 'none';
            toolbar.classList.add('active');
            if (type === 'tx') renderTransactions();
            if (type === 'inv') renderInvestments();
            if (type === 'debt') renderDebts();
        };

        closeBtn.onclick = () => {
            manageMode[type] = false;
            selectedIds[type].clear();
            btn.style.display = 'block';
            toolbar.classList.remove('active');
            if (type === 'tx') renderTransactions();
            if (type === 'inv') renderInvestments();
            if (type === 'debt') renderDebts();
        };

        batchDelBtn.onclick = () => {
            const count = selectedIds[type].size;
            if (count === 0) return alert('請先勾選項目。');

            let msg = `確定要批量刪除這 ${count} 項紀錄嗎？`;
            if (type === 'inv') msg += `\n\n這將一併撤銷與這些部位相關的所有連動交易紀錄。`;
            if (type === 'debt') msg += `\n\n這將一併撤銷與這些貸款相關的所有還款紀錄。`;

            if (confirm(msg)) {
                captureHistory();
                const idsToDelete = Array.from(selectedIds[type]);

                if (type === 'tx') {
                    state.transactions = state.transactions.filter(t => !idsToDelete.includes(t.id));
                } else if (type === 'inv') {
                    state.transactions = state.transactions.filter(t => !idsToDelete.includes(t.linkId));
                    state.investments = state.investments.filter(i => !idsToDelete.includes(i.id));
                } else if (type === 'debt') {
                    state.transactions = state.transactions.filter(t => !idsToDelete.includes(t.linkId));
                    state.debts = state.debts.filter(d => !idsToDelete.includes(d.id));
                }

                saveState();
                manageMode[type] = false;
                selectedIds[type].clear();
                btn.style.display = 'block';
                toolbar.classList.remove('active');
                if (type === 'tx') renderTransactions();
                if (type === 'inv') renderInvestments();
                if (type === 'debt') renderDebts();
                updateDashboard(true);
            }
        };
    };

    ['tx', 'inv', 'debt'].forEach(setupManageListeners);

    // [新增] 勾選點擊委派
    document.addEventListener('click', (e) => {
        const checkbox = e.target.closest('.custom-checkbox');
        if (!checkbox || checkbox.classList.contains('disabled')) return;

        const id = checkbox.getAttribute('data-id');
        const type = checkbox.getAttribute('data-type');
        
        if (selectedIds[type].has(id)) {
            selectedIds[type].delete(id);
            checkbox.classList.remove('checked');
        } else {
            selectedIds[type].add(id);
            checkbox.classList.add('checked');
        }

        const countDisplay = document.getElementById(`${type}-selected-count`);
        if (countDisplay) countDisplay.textContent = `已選擇 ${selectedIds[type].size} 項`;
    });

    const getModuleLabel = (module) => {
        const labels = { cashflow: '收支', investments: '投資', liabilities: '負債', system: '系統' };
        return labels[module] || '未知';
    };

    const renderHistory = () => {
        const listDiv = document.getElementById('history-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        
        const filter = document.getElementById('log-filter-module')?.value || 'all';
        let logs = state.logs;
        if (filter !== 'all') logs = logs.filter(l => l.module === filter);

        if (logs.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無紀錄</p>';

        logs.forEach(log => {
            const time = new Date(log.timestamp).toLocaleString('zh-TW', { 
                month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false 
            });
            const impactClass = log.amount > 0 ? 'pos' : (log.amount < 0 ? 'neg' : 'neu');
            const impactSign = log.amount > 0 ? '+' : '';
            const impactText = log.amount !== 0 ? `${impactSign}NT$ ${Math.round(Math.abs(log.amount)).toLocaleString()}` : '--';

            listDiv.innerHTML += `
                <div class="log-item">
                    <div class="log-details" style="flex: 1;">
                        <span class="log-module-tag tag-${log.module}">${getModuleLabel(log.module)}</span>
                        <div class="item-name" style="font-size: 0.95rem; font-weight: 600;">${log.description}</div>
                        <div class="log-time">${time}</div>
                    </div>
                    <div class="log-actions" style="display: flex; align-items: center; gap: 20px;">
                        <div class="log-impact ${impactClass}" style="text-align: right; min-width: 100px;">${impactText}</div>
                        <button class="action-btn log-undo-btn" data-id="${log.id}" title="快速撤銷 (僅限最近一次操作)" style="opacity: 0.6;"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                </div>
            `;
        });
    };

    document.getElementById('log-filter-module')?.addEventListener('change', renderHistory);
    document.getElementById('clear-logs-btn')?.addEventListener('click', () => {
        if (confirm('確定要清空所有操作紀錄嗎？(這不會影響您的資產數據)')) {
            state.logs = [];
            saveState();
        }
    });

    // 歷史紀錄中的「快速撤銷」邏輯 (連動全域 Undo)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.log-undo-btn')) {
            const logId = e.target.closest('.log-undo-btn').getAttribute('data-id');
            const latestLog = state.logs[0];
            if (latestLog && latestLog.id === logId) {
                document.getElementById('undo-btn')?.click();
            } else {
                alert('抱歉，目前僅支援從歷史紀錄快速撤銷「最後一筆」操作。若需復原更早之前的動作，請直接點擊左下角的「復原上一步」按鈕。');
            }
        }
    });

    initCharts();
    updateDashboard(true);
    renderTransactions();
    renderInvestments();
    renderDebts();
    renderHistory();
    renderAccounts();
    fetchPrices();
    processAutomaticRepayments();

    setInterval(() => {
        fetchPrices();
    }, 60000);

// ============================================================
// === 帳戶管理模組 (Account Management Module) - 獨立區塊 ===
// ============================================================

// --- 全台銀行與電子錢包資料 (台灣專屬) ---
const ACCOUNT_PROVIDERS = {
    bank: [
        { code:"004", name:"臺灣銀行",              color:"#005bac" },
        { code:"005", name:"土地銀行",              color:"#00723f" },
        { code:"006", name:"合作金庫",              color:"#00843d" },
        { code:"007", name:"第一銀行",              color:"#0059a9" },
        { code:"008", name:"華南銀行",              color:"#004a97" },
        { code:"009", name:"彰化銀行",              color:"#c8102e" },
        { code:"011", name:"上海銀行",              color:"#c8102e" },
        { code:"012", name:"台北富邦",              color:"#005bac" },
        { code:"013", name:"國泰世華",              color:"#009a4e" },
        { code:"016", name:"高雄銀行",              color:"#005bac" },
        { code:"017", name:"兆豐銀行",              color:"#005bac" },
        { code:"018", name:"農業金庫",              color:"#4caf50" },
        { code:"048", name:"王道銀行",              color:"#8b5cf6" },
        { code:"050", name:"臺灣中小企業銀行",     color:"#005bac" },
        { code:"052", name:"渣打銀行",              color:"#00b0ca" },
        { code:"700", name:"中華郵政",              color:"#e06b00" },
        { code:"803", name:"聯邦銀行",              color:"#d32f2f" },
        { code:"806", name:"元大銀行",              color:"#1a1a6e" },
        { code:"807", name:"永豐銀行",              color:"#c8102e" },
        { code:"808", name:"玉山銀行",              color:"#009a44" },
        { code:"809", name:"凱基銀行",              color:"#e60026" },
        { code:"812", name:"台新銀行",              color:"#c8102e" },
        { code:"816", name:"安泰銀行",              color:"#005bac" },
        { code:"822", name:"中信銀行",              color:"#005bac" },
        { code:"823", name:"將來銀行",              color:"#6366f1" },
        { code:"824", name:"LINE Bank",             color:"#00b900" },
        { code:"826", name:"樂天銀行",              color:"#bf0000" },
    ],
    wallet: [
        { code:"LP",   name:"LINE Pay",             color:"#00b900" },
        { code:"JKO",  name:"街口支付",             color:"#d0021b" },
        { code:"PP",   name:"全支付",               color:"#005598" },
        { code:"TP",   name:"台灣Pay",              color:"#ed1c24" },
        { code:"EW",   name:"悠遊付",               color:"#00a0e9" },
        { code:"IP",   name:"icash Pay",            color:"#f08300" },
        { code:"PI",   name:"Pi 拍錢包",            color:"#0072bc" },
        { code:"OP",   name:"歐付寶",               color:"#77af42" },
        { code:"GP",   name:"Google Pay",           color:"#4285f4" },
        { code:"AP",   name:"Apple Pay",            color:"#555555" },
    ],
    crypto: [
        { code:"BNB",  name:"Binance (幣安)",      color:"#f3ba2f" },
        { code:"OKX",  name:"OKX (歐易)",          color:"#000000" },
        { code:"MAX",  name:"MAX (台灣交易所)",     color:"#20409a" },
        { code:"HOYA", name:"HOYABIT",            color:"#00b4d8" },
        { code:"BYB",  name:"Bybit",               color:"#ffb11a" },
        { code:"BTB",  name:"BitoPro (幣託)",      color:"#004fa3" },
        { code:"ACE",  name:"ACE (王牌)",          color:"#00b0ff" },
        { code:"MM",   name:"MetaMask",            color:"#e2761b" },
        { code:"HW",   name:"Cold Wallet (硬體錢包)", color:"#4a4a4a" },
        { code:"OT",   name:"Other Exchange",      color:"#6b7280" },
    ],
    cash: [
        { code:"CASH", name:"實體現金 / 錢包",      color:"#f59e0b" },
    ]
};

// --- 視覺化選擇器邏輯 ---
(function setupProviderPicker() {
    const overlay   = document.getElementById('provider-picker-overlay');
    const trigger   = document.getElementById('ac-picker-trigger');
    const closeBtn  = document.getElementById('picker-close-btn');
    const searchEl  = document.getElementById('picker-search');
    const gridEl    = document.getElementById('picker-grid');
    const tabs      = document.querySelectorAll('.picker-tab');
    const hiddenInput  = document.getElementById('ac-provider');
    const labelSpan    = document.getElementById('ac-picker-label');

    if (!overlay || !trigger) return;

    let currentTab = 'bank';
    let selectedProvider = null;

    // 開啟選擇器
    trigger.addEventListener('click', () => {
        overlay.style.display = 'flex';
        searchEl.value = '';
        renderPickerGrid(currentTab, '');
        setTimeout(() => searchEl.focus(), 100);
    });

    // 關閉選擇器
    const closePicker = () => { overlay.style.display = 'none'; };
    closeBtn.addEventListener('click', closePicker);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePicker(); });

    // 分頁切換
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.getAttribute('data-tab');
            renderPickerGrid(currentTab, searchEl.value);
        });
    });

    // 即時搜尋（跨分頁）
    searchEl.addEventListener('input', () => {
        const q = searchEl.value.trim();
        // 搜尋時跨所有分頁
        renderPickerGrid(currentTab, q, q.length > 0);
    });

    function renderPickerGrid(tab, query, crossTab = false) {
        gridEl.innerHTML = '';
        let items = crossTab
            ? Object.values(ACCOUNT_PROVIDERS).flat()
            : (ACCOUNT_PROVIDERS[tab] || []);

        if (query) {
            const q = query.toLowerCase();
            items = items.filter(p =>
                p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
            );
        }

        if (items.length === 0) {
            gridEl.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--text-muted);">找不到符合的選項</div>`;
            return;
        }

        items.forEach(p => {
            const card = document.createElement('div');
            card.className = 'picker-card' + (selectedProvider?.code === p.code ? ' selected' : '');
            card.innerHTML = `
                <div class="picker-card-icon" style="background:${p.color}22; color:${p.color};">
                    ${getProviderInitials(p.name)}
                </div>
                <div class="picker-card-name">${p.name}</div>
                <div class="picker-card-code">${p.code}</div>`;
            card.addEventListener('click', () => {
                selectedProvider = p;
                hiddenInput.value = p.name; // 存入名稱
                labelSpan.innerHTML = `
                    <div class="picker-card-icon" style="background:${p.color}22; color:${p.color}; width:28px; height:28px; border-radius:8px; font-size:0.75rem; display:inline-flex; align-items:center; justify-content:center; margin-right:10px;">
                        ${getProviderInitials(p.name)}
                    </div>
                    <span style="font-weight:600;">${p.name}</span>
                    <span style="font-size:0.8rem; color:var(--text-muted); margin-left:8px;">${p.code}</span>`;
                closePicker();
            });
            gridEl.appendChild(card);
        });
    }

    function getProviderInitials(name) {
        // 取前2字作為縮寫圖標
        const cleaned = name.replace(/[（(）)]/g, '').trim();
        return cleaned.substring(0, 2);
    }
})();


    // 帳戶表單 UI 更新：Logo 預覽
    document.getElementById('ac-picker-trigger')?.addEventListener('click', () => {
        setTimeout(() => {
            const interval = setInterval(() => {
                const searchItems = document.querySelectorAll('.picker-search-item');
                if (searchItems.length > 0) {
                    searchItems.forEach(item => {
                        item.addEventListener('click', () => {
                            const selectedName = item.querySelector('.ps-name')?.textContent || item.querySelector('.picker-card-name')?.textContent;
                            if (selectedName) updateAccountLogoPreview(selectedName);
                        });
                    });
                    clearInterval(interval);
                }
                const cards = document.querySelectorAll('.picker-card');
                if (cards.length > 0) {
                    cards.forEach(card => {
                        card.addEventListener('click', () => {
                            const selectedName = card.querySelector('.picker-card-name')?.textContent;
                            if (selectedName) updateAccountLogoPreview(selectedName);
                        });
                    });
                    clearInterval(interval);
                }
            }, 500);
        }, 100);
    });

    const updateAccountLogoPreview = (providerName) => {
        const previewEl = document.getElementById('ac-icon-preview');
        const logoUrl = getProviderLogo(providerName);
        if (logoUrl) {
            previewEl.innerHTML = `<img src="${logoUrl}" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            const providerInfo = providerDictionary.find(p => p.name === providerName || p.code === providerName);
            if (providerInfo) {
                previewEl.innerHTML = `<div style="background:${providerInfo.color}22; color:${providerInfo.color}; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem;">${providerInfo.name.substring(0,2)}</div>`;
            } else {
                previewEl.innerHTML = `<i class="fa-solid fa-building-columns" style="opacity:0.3;"></i>`;
            }
        }
    };

    // --- 刷新所有下拉選單中的帳戶列表 ---
    function refreshAccountSelectors() {
        const selectors = document.querySelectorAll('.account-selector');
        const stateObj = JSON.parse(localStorage.getItem('financeStateV10')) || {};
        const accounts = stateObj.accounts || [];
        
        selectors.forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '<option value="">-- 請選擇帳戶 --</option>';
            accounts.forEach(acc => {
                const opt = document.createElement('option');
                opt.value = acc.id;
                opt.textContent = `${acc.name} (${acc.provider})`;
                select.appendChild(opt);
            });
            if (currentVal && accounts.some(a => a.id === currentVal)) {
                select.value = currentVal;
            }
        });
    }

    // --- 渲染帳戶清單 ---
    function renderAccounts() {
        const listDiv = document.getElementById('account-list');
        const totalDisplay = document.getElementById('ac-total-display');
        if (!listDiv) return;

        const stateObj = JSON.parse(localStorage.getItem('financeStateV10')) || {};
        const accounts = stateObj.accounts || [];
        listDiv.innerHTML = '';

        if (accounts.length === 0) {
            listDiv.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <i class="fa-solid fa-building-columns" style="font-size:2.5rem; margin-bottom:15px; opacity:0.3;"></i>
                    <p>尚無任何帳戶。<br>請至右方表單新增您的第一個帳戶。</p>
                </div>`;
            if (totalDisplay) totalDisplay.textContent = `總餘額 NT$ 0`;
            return;
        }

        let totalBalance = 0;
        accounts.forEach(acc => {
            const providerInfo = providerDictionary.find(p => p.name === acc.provider || p.code === acc.provider);
            const color = acc.color || providerInfo?.color || '#6366f1';
            let bal = Number(acc.balance) || 0;
            const currency = acc.currency || 'TWD';
            
            // 換算總額
            let rate = 1;
            if (currency !== 'TWD' && stateObj.rates) {
                rate = stateObj.rates[`TWD_${currency}`] || 1;
            }
            if (acc.includeInAssets !== false) {
                totalBalance += (bal * rate);
            }

            const isInc = acc.includeInAssets !== false;
            const typeLabel = { bank: '銀行', wallet: '電子錢包', cash: '現金' }[acc.type] || acc.type;
            const logoUrl = getProviderLogo(acc.provider);
            
            let iconHtml_inner = '';
            if (logoUrl) {
                iconHtml_inner = `<img src="${logoUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else if (providerInfo) {
                iconHtml_inner = `<div style="background:${color}22; color:${color}; font-size:0.85rem; font-weight:700; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${(acc.provider ? acc.provider.substring(0,2) : typeLabel.substring(0,1))}</div>`;
            } else {
                iconHtml_inner = `<i class="fa-solid fa-building-columns" style="color:${color}"></i>`;
            }

            const item = document.createElement('div');
            item.className = 'account-item';
            // 當不計入資產時，顯示為半透明
            if (!isInc) item.style.opacity = '0.6';
            
            // 加入識別顏色左側邊框
            item.style.borderLeft = `4px solid ${color}`;
            item.style.paddingLeft = '10px';

            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:14px; flex:1;">
                    <div class="account-icon-badge" style="background:transparent; width:40px; height:40px; overflow:hidden; border-radius:50%;">
                        ${iconHtml_inner}
                    </div>
                    <div>
                        <div class="item-name" style="font-size:1.05rem; font-weight:600; color:var(--text-main);">${acc.name} ${!isInc ? '<span style="font-size:0.6rem; color:var(--text-muted); background:rgba(255,255,255,0.08); padding:2px 4px; border-radius:4px; margin-left:4px; vertical-align:middle;">不計入</span>' : ''}</div>
                        <div class="item-sub" style="font-size:0.8rem; margin-top:4px; color:var(--text-muted);">${acc.provider || typeLabel} ${acc.remark ? ` · ${acc.remark}` : ''}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div class="item-value positive" style="font-size:1.15rem; font-weight:800; font-family:'Inter', sans-serif;">${currency === 'TWD' ? 'NT$' : currency} ${bal.toLocaleString()}</div>
                </div>
                <div class="item-actions" style="margin-left:15px; display:flex; gap:8px;">
                    <button class="action-btn edit-acc-btn" data-id="${acc.id}" title="編輯帳戶" style="background:rgba(255,255,255,0.05);">
                        <i class="fa-solid fa-pen" style="pointer-events:none;"></i>
                    </button>
                    <button class="action-btn del-acc-btn" data-id="${acc.id}" title="刪除帳戶" style="background:rgba(239,68,68,0.1); color:var(--danger);">
                        <i class="fa-solid fa-trash" style="pointer-events:none;"></i>
                    </button>
                </div>`;
            listDiv.appendChild(item);
        });

        if (totalDisplay) totalDisplay.textContent = `總餘額 NT$ ${Math.round(totalBalance).toLocaleString()}`;
        
        // 每次渲染完帳戶列表，同步更新所有下拉選單
        refreshAccountSelectors();

        // 綁定編輯
        listDiv.querySelectorAll('.edit-acc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const stateObj = JSON.parse(localStorage.getItem('financeStateV10'));
                const acc = stateObj.accounts.find(a => a.id === id);
                if (!acc) return;

                document.getElementById('ac-id').value = acc.id;
                document.getElementById('ac-name').value = acc.name;
                document.getElementById('ac-provider').value = acc.provider;
                document.getElementById('ac-picker-label').innerHTML = `<span style="color:var(--text-main); font-weight:bold;">${acc.provider}</span>`;
                updateAccountLogoPreview(acc.provider);
                
                document.getElementById('ac-remark').value = acc.remark || '';
                document.getElementById('ac-currency').value = acc.currency || 'TWD';
                document.getElementById('ac-balance').value = acc.balance || 0;
                document.getElementById('ac-color').value = acc.color || '#6366f1';
                document.getElementById('ac-include-assets').checked = acc.includeInAssets !== false;

                document.getElementById('ac-form-title').textContent = '修改帳戶';
                document.getElementById('ac-submit-btn').textContent = '保存修改';
                document.getElementById('ac-submit-btn').style.background = '#4caf50';
                document.getElementById('ac-submit-btn').style.color = '#fff';
                document.getElementById('ac-cancel-edit').style.display = 'block';

                document.getElementById('ac-form-title').scrollIntoView({behavior: 'smooth', block: 'center'});
            });
        });

        // 綁定刪除
        listDiv.querySelectorAll('.del-acc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const stateObj = JSON.parse(localStorage.getItem('financeStateV10'));
                const acc = stateObj.accounts.find(a => a.id === id);
                if (!acc) return;
                
                if (confirm(`確定刪除帳戶「${acc.name}」嗎？
(注意：此動作將影響您的活期與總資產結算)`)) {
                    stateObj.accounts = stateObj.accounts.filter(a => a.id !== id);
                    localStorage.setItem('financeStateV10', JSON.stringify(stateObj));
                    
                    state = stateObj;
                    saveState(false);
                    renderAccounts();
                }
            });
        });
    }

    // --- 帳戶表單提交 ---
    function setupAccountForm() {
        const form = document.getElementById('account-form');
        const cancelBtn = document.getElementById('ac-cancel-edit');
        if (!form) return;

        const resetForm = () => {
            form.reset();
            document.getElementById('ac-id').value = '';
            document.getElementById('ac-name').value = '';
            document.getElementById('ac-provider').value = '';
            document.getElementById('ac-picker-label').innerHTML = `請選擇銀行或錢包`;
            document.getElementById('ac-icon-preview').innerHTML = `<i class="fa-solid fa-building-columns" style="opacity:0.3;"></i>`;
            document.getElementById('ac-form-title').textContent = '添加帳戶';
            document.getElementById('ac-submit-btn').textContent = '確定添加';
            document.getElementById('ac-submit-btn').style.background = '#facc15';
            document.getElementById('ac-submit-btn').style.color = '#1e1b4b';
            cancelBtn.style.display = 'none';
        };

        cancelBtn.addEventListener('click', resetForm);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const providerName = document.getElementById('ac-provider').value.trim();
            if (!providerName) {
                alert('請選擇銀行或電子錢包！');
                return;
            }

            const editId = document.getElementById('ac-id').value;

            let detectedType = 'cash';
            if (walletDictionary.some(w => w.name === providerName)) detectedType = 'wallet';
            else if (bankDictionary.some(b => b.name === providerName)) detectedType = 'bank';

            const accountNameInput = document.getElementById('ac-name').value.trim();
            const finalAccountName = accountNameInput || providerName; // Fallback to provider name

            const newAcc = {
                id: editId || ('acc-' + Date.now()),
                name: finalAccountName,
                remark: document.getElementById('ac-remark').value.trim(),
                type: detectedType,
                provider: providerName,
                currency: document.getElementById('ac-currency').value,
                balance: parseFloat(document.getElementById('ac-balance').value) || 0,
                color: document.getElementById('ac-color').value,
                includeInAssets: document.getElementById('ac-include-assets').checked
            };

            const stateObj = JSON.parse(localStorage.getItem('financeStateV10')) || {};
            if (!stateObj.accounts) stateObj.accounts = [];

            if (editId) {
                const idx = stateObj.accounts.findIndex(a => a.id === editId);
                if (idx !== -1) {
                    stateObj.accounts[idx] = newAcc;
                }
            } else {
                stateObj.accounts.push(newAcc);
            }

            localStorage.setItem('financeStateV10', JSON.stringify(stateObj));
            
            state = stateObj;
            saveState(false);
            
            resetForm();
            renderAccounts();
            
            if (window.updateDashboard) updateDashboard(true);
        });
    }

    // 將 renderAccounts 給 global
    window.renderAccounts = renderAccounts;
    setupAccountForm();
    renderAccounts();
});
