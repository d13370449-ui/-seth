/* ========================================================
   毛絨絨繩先生的自我介紹 - 互動腳本 (script.js)
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lightbox 燈箱模態框邏輯
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxCaption.textContent = alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 為所有戰績、復活與好友圖片綁定燈箱
    const zoomableItems = document.querySelectorAll('[data-zoomable]');
    zoomableItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img') || item;
            const caption = item.getAttribute('data-caption') || img.alt || '';
            openLightbox(img.src, caption);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // 按 ESC 鍵關閉燈箱
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 2. 趣味互動：「讓繩先生咬一口」點擊特效
    const biteBtn = document.getElementById('bite-btn');
    const biteQuotes = [
        "嗷嗚！美味＋100！🍖",
        "嗯～好香！再借我吃一口嘛！🤤",
        "跟朋友貼貼最開心了～✨",
        "囓囓囓...今天的食材真新鮮！🐾",
        "繩先生發出了滿足的呼嚕聲！💙"
    ];
    const emojis = ['🍖', '🥩', '🩸', '🐾', '✨', '🍴', '💙', '👀'];

    if (biteBtn) {
        biteBtn.addEventListener('click', (e) => {
            const rect = biteBtn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top;

            // 產生 7 個噴發表情
            for (let i = 0; i < 7; i++) {
                const crumb = document.createElement('div');
                crumb.className = 'floating-crumb';
                crumb.textContent = emojis[Math.floor(Math.random() * emojis.length)];

                // 隨機角度與距離
                const vx = (Math.random() - 0.5) * 160;
                const vy = (Math.random() - 0.5) * 80;
                const rot = (Math.random() - 0.5) * 60;

                crumb.style.setProperty('--vx', `${vx}px`);
                crumb.style.setProperty('--vy', `${vy}px`);
                crumb.style.setProperty('--rot', `${rot}deg`);
                crumb.style.left = `${centerX}px`;
                crumb.style.top = `${centerY}px`;

                document.body.appendChild(crumb);

                // 動畫結束後移除
                setTimeout(() => {
                    crumb.remove();
                }, 1200);
            }

            // 隨機更換按鈕文字趣味回饋
            const originalText = biteBtn.innerHTML;
            const randomQuote = biteQuotes[Math.floor(Math.random() * biteQuotes.length)];
            biteBtn.innerHTML = `<span>${randomQuote}</span>`;
            biteBtn.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                biteBtn.style.transform = '';
            }, 150);

            setTimeout(() => {
                biteBtn.innerHTML = originalText;
            }, 2000);
        });
    }

    // 3. 單頁 Tab 切換管理系統 (每次只顯示一個分類區塊)
    const tabPanes = document.querySelectorAll('.tab-pane');
    const navLinks = document.querySelectorAll('.nav-link');
    const validTabs = ['profile', 'music', 'friends', 'battles', 'rebirth'];

    function switchTab(targetId, updateHistory = true, shouldScroll = true) {
        if (!validTabs.includes(targetId)) {
            targetId = 'profile';
        }

        // 切換各區塊 display / active 狀態
        tabPanes.forEach(pane => {
            if (pane.id === targetId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        // 切換頂部導覽列 active 狀態
        navLinks.forEach(link => {
            const linkTab = link.getAttribute('data-tab') || (link.getAttribute('href') || '').replace('#', '');
            if (linkTab === targetId) {
                link.classList.add('active');
                // 行動端讓選中的 tab 捲動至視野中
                link.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                link.classList.remove('active');
            }
        });

        // 更新網址 hash，支援瀏覽器上下頁操作
        if (updateHistory) {
            history.pushState(null, '', `#${targetId}`);
        }

        // 平滑滾動回到頂部
        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // 全域事件代理：點擊導覽列、分頁切換按鈕、頁內跳轉按鈕
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-tab-target], .nav-link, .nav-brand');
        if (!trigger) return;

        let targetTab = trigger.getAttribute('data-tab-target');
        if (!targetTab) {
            const href = trigger.getAttribute('href');
            if (href && href.startsWith('#')) {
                targetTab = href.substring(1);
            }
        }

        if (targetTab && validTabs.includes(targetTab)) {
            e.preventDefault();
            switchTab(targetTab, true, true);
        }
    });

    // 瀏覽器上一頁 / 下一頁 (popstate)
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        if (validTabs.includes(hash)) {
            switchTab(hash, false, true);
        } else {
            switchTab('profile', false, true);
        }
    });

    // 頁面初次載入：依據 URL Hash 決定顯示哪個分頁
    const currentHash = window.location.hash.replace('#', '');
    if (validTabs.includes(currentHash)) {
        switchTab(currentHash, false, false);
    } else {
        switchTab('profile', false, false);
    }
});
