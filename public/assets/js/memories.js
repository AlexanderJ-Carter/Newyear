/**
 * 新春记忆馆 - 记忆页逻辑
 * 功能：加载JSON数据，渲染瀑布流，筛选，Lightbox
 */

class MemoriesApp {
    constructor() {
        this.dataUrl = 'data/memories.json';
        this.memories = [];
        this.gridElement = document.getElementById('memoriesGrid');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxContent = document.getElementById('lightbox-content');
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.render(this.memories);
        this.bindEvents();
    }

    async loadData() {
        try {
            const response = await fetch(this.dataUrl);
            this.memories = await response.json();
            console.log('数据加载成功:', this.memories.length);
        } catch (error) {
            console.error('数据加载失败:', error);
            this.gridElement.innerHTML = '<p style="text-align:center; width:100%;">加载记忆失败，请检查网络或数据文件。</p>';
        }
    }

    render(items) {
        if (!this.gridElement) return;
        this.gridElement.innerHTML = '';

        if (items.length === 0) {
            this.gridElement.innerHTML = '<p style="text-align:center; width:100%;">暂无相关记忆。</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.onclick = () => this.openLightbox(item);

            let mediaHtml = '';
            if (item.type === 'video') {
                // 视频缩略图或预览（这里简化为图标，实际可以用 canvas 截帧或 poster）
                mediaHtml = `
                    <div class="memory-media">
                        <video src="${item.url}" muted preload="metadata" style="object-fit:cover;"></video>
                        <div class="play-icon">▶</div>
                    </div>
                `;
            } else {
                mediaHtml = `
                    <div class="memory-media">
                        <img src="${item.url}" alt="${item.title}" loading="lazy">
                    </div>
                `;
            }

            card.innerHTML = `
                ${mediaHtml}
                <div class="memory-content">
                    <span class="memory-tag">${item.type === 'video' ? '视频' : '照片'}</span>
                    <h3 class="memory-title">${item.title}</h3>
                    <p class="memory-desc">${item.description || ''}</p>
                    <small style="color:#999; display:block; margin-top:10px;">${item.date}</small>
                </div>
            `;

            // 视频鼠标悬停预览
            if (item.type === 'video') {
                const videoEl = card.querySelector('video');
                card.addEventListener('mouseenter', () => videoEl.play());
                card.addEventListener('mouseleave', () => {
                    videoEl.pause();
                    videoEl.currentTime = 0;
                });
            }

            this.gridElement.appendChild(card);
        });
    }

    bindEvents() {
        // 筛选
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // 移除 active
                buttons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const filter = e.target.dataset.filter;
                if (filter === 'all') {
                    this.render(this.memories);
                } else {
                    const filtered = this.memories.filter(m => m.type === filter);
                    this.render(filtered);
                }
            });
        });

        // Lightbox 关闭
        document.getElementById('lightbox-close').addEventListener('click', () => {
            this.lightbox.classList.remove('active');
            this.lightboxContent.innerHTML = '';
        });

        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.lightbox.classList.remove('active');
                this.lightboxContent.innerHTML = '';
            }
        });
    }

    openLightbox(item) {
        this.lightboxContent.innerHTML = '';
        
        if (item.type === 'video') {
            this.lightboxContent.innerHTML = `
                <video src="${item.url}" controls autoplay style="max-width:100%; max-height:80vh; border-radius:8px;"></video>
                <h3 style="color:#fff; text-align:center; margin-top:10px;">${item.title}</h3>
            `;
        } else {
            this.lightboxContent.innerHTML = `
                <img src="${item.url}" alt="${item.title}" style="max-width:100%; max-height:80vh; border-radius:8px;">
                <h3 style="color:#fff; text-align:center; margin-top:10px;">${item.title}</h3>
            `;
        }

        this.lightbox.classList.add('active');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new MemoriesApp();
});