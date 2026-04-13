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
        });
    });

    // --- 2. 智能提示詞庫 (Autocomplete Dictionary) ---
    const assetDictionary = {
        crypto: [
            { sym: 'BTC', name: 'Bitcoin (比特幣)' },
            { sym: 'ETH', name: 'Ethereum (以太幣)' },
            { sym: 'BNB', name: 'Binance Coin' },
            { sym: 'SOL', name: 'Solana (索拉納)' },
            { sym: 'XRP', name: 'Ripple (瑞波幣)' },
            { sym: 'DOGE', name: 'Dogecoin (狗狗幣)' },
            { sym: 'ADA', name: 'Cardano (艾達幣)' },
            { sym: 'AVAX', name: 'Avalanche' },
            { sym: 'DOT', name: 'Polkadot (波卡)' },
            { sym: 'TRX', name: 'TRON (波場)' },
            { sym: 'LINK', name: 'Chainlink' },
            { sym: 'MATIC', name: 'Polygon' }
        ],
        tw_stock: [
            { sym: '2330.TW', name: '台積電 (TSMC)' },
            { sym: '2317.TW', name: '鴻海' },
            { sym: '2454.TW', name: '聯發科' },
            { sym: '0050.TW', name: '元大台灣50' },
            { sym: '0056.TW', name: '元大高股息' },
            { sym: '00878.TW', name: '國泰永續高股息' },
            { sym: '00929.TW', name: '復華台灣科技優息' },
            { sym: '2308.TW', name: '台達電' },
            { sym: '2881.TW', name: '富邦金' },
            { sym: '2882.TW', name: '國泰金' },
            { sym: '2603.TW', name: '長榮' }
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
            { sym: 'SPY', name: 'SPDR S&P 500 ETF' },
            { sym: 'QQQ', name: 'Invesco QQQ ETF' },
            { sym: 'VOO', name: 'Vanguard S&P 500 ETF' }
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
                item.sym.toLowerCase().startsWith(val) ||
                item.name.toLowerCase().includes(val) ||
                item.name.toLowerCase().startsWith(val)
            );

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
                    else if (v === 'commodity') amountHint.innerText = '(輸入單位或合約數量)';
                }
            });
        }
    }


    // --- 3. 狀態管理與復原機制 (Undo System) ---
    // 改良版資料讀取：全新版本 V9，徹底清除舊資料與假資料殘留
    let state = JSON.parse(localStorage.getItem('financeStateV9'));
    if (!state) {
        state = {
            transactions: [],
            investments: [],
            debts: [],
            baseCash: 0
        };
        localStorage.setItem('financeStateV9', JSON.stringify(state));
    }

    let historyStack = [];

    const captureHistory = () => {
        historyStack.push(JSON.stringify(state));
        if (historyStack.length > 20) historyStack.shift();
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) undoBtn.style.display = 'block';
    };

    document.getElementById('undo-btn')?.addEventListener('click', () => {
        if (historyStack.length > 0) {
            state = JSON.parse(historyStack.pop());
            saveState(false);

            const undoBtn = document.getElementById('undo-btn');
            if (historyStack.length === 0 && undoBtn) undoBtn.style.display = 'none';
            alert('已為您無痕復原上一個操作！');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('#edit-cash-btn')) {
            let currentCash = state.baseCash;
            let result = prompt("請輸入您目前擁有的現金/銀行存款總餘額 (NT$): \n(這筆資金將會構成總資產的基準)", currentCash);
            if (result !== null && !isNaN(parseFloat(result))) {
                captureHistory();
                state.baseCash = parseFloat(result);
                saveState();
            }
        }
    });

    document.getElementById('toggle-invest-pnl')?.addEventListener('change', () => {
        updateDashboard(true);
    });

    let editingState = { txId: null, invId: null, debtId: null };
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('t-date')) document.getElementById('t-date').value = today;

    const saveState = (recordToLocal = true) => {
        if (recordToLocal) localStorage.setItem('financeStateV9', JSON.stringify(state));
        updateDashboard(false);
        renderTransactions();
        renderInvestments();
        renderDebts();
    };

    const getCalculatedData = () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

        let tIncome = 0, tExpense = 0;
        state.transactions.forEach(t => {
            const txTime = new Date(t.date).getTime();
            if (txTime >= startOfMonth && txTime <= endOfMonth) {
                if (t.type === 'income') tIncome += Number(t.amount);
                if (t.type === 'expense') tExpense += Number(t.amount);
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

        let currentCash = state.baseCash + cashflowSurplus;
        let totalAssets = currentCash + investTotal;
        let totalDebts = 0;
        state.debts.forEach(d => totalDebts += Number(d.total));
        let netWorth = totalAssets - totalDebts;

        return { tIncome, tExpense, cashflowSurplus, investTotal, currentCash, totalAssets, totalDebts, netWorth };
    };

    const formatCurrency = (num) => 'NT$ ' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });

    const animateValue = (id, end, duration) => {
        const obj = document.getElementById(id);
        if (!obj) return;
        let start = parseInt(obj.getAttribute('data-current')) || 0;
        if (start === end) { obj.innerHTML = formatCurrency(end); return; }

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * (end - start) + start);
            obj.innerHTML = formatCurrency(currentVal);
            if (progress < 1) { window.requestAnimationFrame(step); }
            else { obj.setAttribute('data-current', end); }
        };
        window.requestAnimationFrame(step);
    };

    let chartInstances = {};

    const updateDashboard = (animate = true) => {
        const data = getCalculatedData();
        let ms = animate ? 1500 : 0;
        animateValue('total-networth', data.netWorth, ms);
        animateValue('monthly-surplus', data.cashflowSurplus, ms);
        animateValue('total-assets', data.totalAssets, ms);
        animateValue('total-liabilities', data.totalDebts, ms);

        if (chartInstances.asset) {
            let cryptoValue = 0; let stockValue = 0;
            state.investments.forEach(i => {
                if (i.type === 'crypto') cryptoValue += (i.amount * i.currentPrice);
                if (i.type === 'tw_stock' || i.type === 'us_stock' || i.type === 'commodity') stockValue += (i.amount * i.currentPrice);
            });
            chartInstances.asset.data.datasets[0].data = [cryptoValue, stockValue, data.currentCash];
            chartInstances.asset.update();
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
                } else if (inv.type === 'us_stock' || inv.type === 'commodity') {
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

            const txData = {
                type: document.getElementById('t-type').value,
                amount: parseFloat(document.getElementById('t-amount').value),
                category: document.getElementById('t-category').value,
                date: document.getElementById('t-date').value
            };

            if (editingState.txId) {
                const idx = state.transactions.findIndex(t => t.id === editingState.txId);
                if (idx !== -1) state.transactions[idx] = { ...state.transactions[idx], ...txData };
                editingState.txId = null;
                const btn = document.querySelector('#transaction-form .submit-btn');
                btn.innerHTML = '加入紀錄'; btn.style.background = '';
            } else {
                txData.id = Date.now().toString();
                state.transactions.unshift(txData);
            }
            saveState(); fForm.reset(); document.getElementById('t-date').value = today;
        });
    }

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

            if (type === 'tw_stock' && /^\d{4,5}$/.test(symbol)) {
                symbol += '.TW';
            }

            let calculatedTotalCost = inputAmount * inputAvgCost;

            captureHistory();

            const invData = {
                type: type,
                symbol: symbol,
                amount: inputAmount,
                totalCost: calculatedTotalCost,
                currentPrice: inputAvgCost
            };

            if (editingState.invId) {
                const idx = state.investments.findIndex(i => i.id === editingState.invId);
                if (idx !== -1) {
                    invData.currentPrice = state.investments[idx].currentPrice;
                    state.investments[idx] = { ...state.investments[idx], ...invData };
                }
                editingState.invId = null;
                const submitBtn = document.querySelector('#invest-form .submit-btn');
                submitBtn.innerHTML = '新增至投資組合'; submitBtn.style.background = 'linear-gradient(135deg, #38bdf8, #8b5cf6)';
            } else {
                let existingIdx = state.investments.findIndex(i => i.symbol === symbol && i.type === type);
                if (existingIdx !== -1) {
                    state.investments[existingIdx].amount += invData.amount;
                    state.investments[existingIdx].totalCost += invData.totalCost;
                    state.investments[existingIdx].currentPrice = (state.investments[existingIdx].totalCost / state.investments[existingIdx].amount);
                    alert(`聰明合併：發現您已有 [ ${symbol} ]。系統已主動為您合併入現有庫存並重新計算均價！`);
                } else {
                    invData.id = Date.now().toString();
                    state.investments.push(invData);
                }
            }
            saveState(); iForm.reset(); fetchPrices();
        });
    }

    const dForm = document.getElementById('debt-form');
    if (dForm) {
        dForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!document.getElementById('d-total').value) return;
            captureHistory();
            const debtData = {
                name: document.getElementById('d-name').value,
                total: parseFloat(document.getElementById('d-total').value),
                monthly: parseFloat(document.getElementById('d-monthly').value)
            };

            if (editingState.debtId) {
                const idx = state.debts.findIndex(d => d.id === editingState.debtId);
                if (idx !== -1) state.debts[idx] = { ...state.debts[idx], ...debtData };
                editingState.debtId = null;
                const btn = document.querySelector('#debt-form .submit-btn');
                btn.innerHTML = '新增負債紀錄'; btn.style.background = 'linear-gradient(135deg, #f43f5e, #f97316)';
            } else {
                debtData.id = Date.now().toString();
                state.debts.push(debtData);
            }
            saveState(); dForm.reset();
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
                target.totalCost += cost;
                target.amount += amount;
                alert(`買進成功！已為您自動納入投資組合。`);
            } else if (action === 'sell') {
                if (amount > target.amount) {
                    return alert(`賣出無效保護：您填寫的需求賣出數量 (${amount}) 大於目前的庫存總量 (${target.amount})！`);
                }
                let avgCost = target.totalCost / target.amount;
                target.amount -= amount;
                target.totalCost -= (amount * avgCost);
                if (target.amount <= 0.00000001) {
                    target.amount = 0;
                    target.totalCost = 0;
                }
                alert(`賣出成功！`);
            }

            saveState();
            bmForm.reset();
            rmResult.innerHTML = '';
            buyModal.classList.remove('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.buy-inv-btn')) {
            const id = e.target.closest('.buy-inv-btn').getAttribute('data-id');
            const item = state.investments.find(i => i.id === id);
            if (item) {
                dcaState = { invId: id, symbol: item.symbol };
                document.getElementById('buy-modal-title').innerText = `針對 ${item.symbol} 操作 (買進/賣出)`;
                buyModal.classList.add('show');
            }
        }

        if (e.target.closest('.edit-tx-btn')) {
            const id = e.target.closest('.edit-tx-btn').getAttribute('data-id');
            const item = state.transactions.find(t => t.id === id);
            if (item) {
                document.getElementById('t-type').value = item.type;
                document.getElementById('t-amount').value = item.amount;
                document.getElementById('t-category').value = item.category;
                document.getElementById('t-date').value = item.date;
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
                editingState.invId = id;
                const btn = document.querySelector('#invest-form .submit-btn');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i> 儲存修改'; btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                document.getElementById('invest-form').scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (e.target.closest('.edit-debt-btn')) {
            const id = e.target.closest('.edit-debt-btn').getAttribute('data-id');
            const item = state.debts.find(d => d.id === id);
            if (item) {
                document.getElementById('d-name').value = item.name;
                document.getElementById('d-total').value = item.total;
                document.getElementById('d-monthly').value = item.monthly;
                editingState.debtId = id;
                const btn = document.querySelector('#debt-form .submit-btn');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i> 儲存修改'; btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                document.getElementById('debt-form').scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (e.target.closest('.del-tx-btn')) {
            const id = e.target.closest('.del-tx-btn').getAttribute('data-id');
            if (confirm('確定刪除此收支紀錄嗎？')) {
                captureHistory();
                state.transactions = state.transactions.filter(t => t.id !== id);
                saveState();
            }
        }

        if (e.target.closest('.del-inv-btn')) {
            const id = e.target.closest('.del-inv-btn').getAttribute('data-id');
            if (confirm('確定刪除此投資部位嗎？')) {
                captureHistory();
                state.investments = state.investments.filter(t => t.id !== id);
                saveState();
            }
        }

        if (e.target.closest('.del-debt-btn')) {
            const id = e.target.closest('.del-debt-btn').getAttribute('data-id');
            if (confirm('確定這筆債務已經還清並刪除嗎？')) {
                captureHistory();
                state.debts = state.debts.filter(t => t.id !== id);
                saveState();
            }
        }
    });

    const renderTransactions = () => {
        const listDiv = document.getElementById('transaction-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        if (state.transactions.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無紀錄</p>';

        state.transactions.forEach(t => {
            let isInc = t.type === 'income';
            listDiv.innerHTML += `
                <div class="tx-item">
                    <div class="tx-info">
                        <div class="tx-icon ${isInc ? 'ic-inc' : 'ic-exp'}"><i class="fa-solid ${isInc ? 'fa-arrow-trend-up' : 'fa-basket-shopping'}"></i></div>
                        <div class="tx-details"><div class="tx-cat">${t.category}</div><div class="tx-date">${t.date}</div></div>
                    </div>
                    <div class="tx-right-panel" style="display:flex; align-items:center; gap: 15px;">
                        <div class="tx-amount ${isInc ? 'positive' : 'negative'}">${isInc ? '+' : '-'} NT$ ${Number(t.amount).toLocaleString()}</div>
                        <div class="item-actions">
                            <button class="action-btn edit-tx-btn" data-id="${t.id}" title="編輯"><i class="fa-solid fa-pen" style="pointer-events: none;"></i></button>
                            <button class="action-btn del-tx-btn" data-id="${t.id}" title="刪除"><i class="fa-solid fa-trash" style="pointer-events: none;"></i></button>
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

        state.investments.forEach(i => {
            let iconClass = 'ic-stock';
            if (i.type === 'crypto') iconClass = 'ic-crypto';
            if (i.type === 'commodity') iconClass = 'ic-commodity';

            let iconCode = 'fa-chart-line';
            if (i.type === 'crypto') iconCode = 'fa-bitcoin';
            if (i.type === 'tw_stock' || i.type === 'us_stock') iconCode = 'fa-building';
            if (i.type === 'commodity') iconCode = 'fa-coins';

            let val = Number(i.amount) * Number(i.currentPrice);
            let cost = Number(i.totalCost) || val;
            let pnl = val - cost;
            let pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
            let pnlClass = pnl >= 0 ? 'price-up' : 'price-down';
            let pnlSign = pnl >= 0 ? '+' : '';

            listDiv.innerHTML += `
                <div class="asset-item">
                    <div class="tx-info">
                        <div class="asset-icon ${iconClass}"><i class="fa-brands ${iconCode}"></i></div>
                        <div class="tx-details">
                            <div class="item-name">${i.symbol}</div>
                            <div class="item-sub">數量: ${i.amount} | 總投資成本: $${Math.floor(cost).toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="tx-right-panel" style="display:flex; align-items:center; gap: 15px;">
                        <div style="text-align: right;">
                            <div class="item-value text-main">NT$ ${Math.floor(val).toLocaleString()}</div>
                            <div class="item-price-change ${pnlClass}">
                                ${pnlSign} NT$ ${Math.floor(pnl).toLocaleString()} (${pnlSign}${pnlPercent.toFixed(2)}%)
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="action-btn buy-inv-btn" data-id="${i.id}" title="定期定額 / 加碼追加部位"><i class="fa-solid fa-plus" style="pointer-events: none;"></i></button>
                            <button class="action-btn edit-inv-btn" data-id="${i.id}" title="整體手動編輯"><i class="fa-solid fa-pen" style="pointer-events: none;"></i></button>
                            <button class="action-btn del-inv-btn" data-id="${i.id}" title="清空此部位"><i class="fa-solid fa-trash" style="pointer-events: none;"></i></button>
                        </div>
                    </div>
                </div>`;
        });
    };

    const renderDebts = () => {
        const listDiv = document.getElementById('debt-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';
        if (state.debts.length === 0) return listDiv.innerHTML = '<p class="tx-date" style="text-align:center; padding-top:20px;">尚無貸款</p>';

        state.debts.forEach(d => {
            listDiv.innerHTML += `
                <div class="debt-item">
                    <div class="tx-info">
                        <div class="debt-icon ic-debt"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                        <div class="tx-details">
                            <div class="item-name">${d.name}</div>
                            <div class="item-sub">每月現金流負擔: NT$ ${d.monthly.toLocaleString()}</div>
                        </div>
                    </div>
                    <div class="tx-right-panel" style="display:flex; align-items:center; gap: 15px;">
                        <div class="item-value negative">- NT$ ${d.total.toLocaleString()}</div>
                        <div class="item-actions">
                            <button class="action-btn edit-debt-btn" data-id="${d.id}" title="編輯"><i class="fa-solid fa-pen" style="pointer-events: none;"></i></button>
                            <button class="action-btn del-debt-btn" data-id="${d.id}" title="刪除"><i class="fa-solid fa-trash" style="pointer-events: none;"></i></button>
                        </div>
                    </div>
                </div>`;
        });
    };

    Chart.defaults.color = '#94a3b8'; Chart.defaults.font.family = "'Outfit', sans-serif";
    const initCharts = () => {
        const ctxAsset = document.getElementById('assetChart');
        if (ctxAsset) {
            chartInstances.asset = new Chart(ctxAsset.getContext('2d'), {
                type: 'doughnut',
                data: { labels: ['加密貨幣', '股票', '現金存款'], datasets: [{ data: [1, 1, 1], backgroundColor: ['#a855f7', '#3b82f6', '#10b981'], borderWidth: 0, hoverOffset: 8 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } } }, cutout: '78%' }
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

    initCharts();
    updateDashboard(true);
    renderTransactions();
    renderInvestments();
    renderDebts();
    fetchPrices();
});
