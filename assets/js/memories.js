// ==========================================================================
// 春节记忆页面脚本 - 支持视频和图片分别存储
// ==========================================================================

class MemoryManager {
    constructor() {
        this.sortOrder = 'newest'; // 'newest' or 'oldest'
        this.memories = [];
        this.localFeatures = null;
        this.init();
    }

    async init() {
        // 初始化本地功能（如果可用）
        if (typeof LocalFeatures !== 'undefined') {
            this.localFeatures = new LocalFeatures();
        }

        await this.loadAllMemories();
        this.bindEvents();
        this.renderMemories();
        this.initAnimations();
    }

    // 加载所有记忆（视频和图片）
    async loadAllMemories() {
        try {
            // 检查是否在本地服务器环境
            if (this.localFeatures && this.localFeatures.isLocal) {
                console.log('🚀 使用本地服务器API加载记忆');
                this.memories = await this.localFeatures.loadMemoriesFromAPI();
                console.log(
                    '📊 从API加载了 ' + this.memories.length + ' 个记忆'
                );
                return;
            }

            console.log('📤 使用静态文件模式加载记忆');

            // 预定义的视频文件列表（存放在 assets/videos/）
            const knownVideoFiles = [
                'v-20251001-传统年味-展现中华传统春节文化精彩瞬间.mp4',
                'v-20251001-春节宣传片-展现传统节日的魅力与温暖.mp4',
                'v-20260101-春节序曲-优美的春节音乐营造浓浓年味.mp4',
            ];

            // 预定义的图片文件列表（存放在 assets/photos/）
            const knownPhotoFiles = [
                'p-20251001-测试图片-测试文字.jpg',
                // 您可以继续按照命名规则添加更多图片
                // 'p-20251225-年夜饭-精心准备的丰盛年夜饭.jpg'
            ];

            this.memories = [];

            // 加载视频文件
            for (let index = 0; index < knownVideoFiles.length; index++) {
                const filename = knownVideoFiles[index];
                const parsedInfo = this.parseFileName(filename);

                if (parsedInfo && parsedInfo.title) {
                    const memory = {
                        id: 'video_' + (index + 1),
                        type: 'video',
                        title: parsedInfo.title,
                        description: parsedInfo.description,
                        url: 'assets/videos/' + filename,
                        timestamp: parsedInfo.timestamp || Date.now(),
                        date:
                            parsedInfo.date ||
                            new Date().toISOString().split('T')[0],
                    };
                    this.memories.push(memory);
                    console.log('✅ 视频加载成功: ' + memory.title);
                }
            }

            // 加载图片文件
            console.log(
                '开始加载图片文件，共 ' + knownPhotoFiles.length + ' 个'
            );
            for (let index = 0; index < knownPhotoFiles.length; index++) {
                const filename = knownPhotoFiles[index];
                console.log('尝试解析图片文件: ' + filename);
                const parsedInfo = this.parseFileName(filename);

                if (parsedInfo && parsedInfo.title) {
                    const memory = {
                        id: 'photo_' + (index + 1),
                        type: 'photo',
                        title: parsedInfo.title,
                        description: parsedInfo.description,
                        url: 'assets/photos/' + filename,
                        timestamp: parsedInfo.timestamp || Date.now(),
                        date:
                            parsedInfo.date ||
                            new Date().toISOString().split('T')[0],
                    };
                    this.memories.push(memory);
                    console.log(
                        '✅ 图片加载成功: ' +
                            memory.title +
                            ' (URL: ' +
                            memory.url +
                            ')'
                    );
                } else {
                    console.warn('❌ 图片解析失败: ' + filename);
                }
            }

            // 从本地存储加载额外记忆
            const localMemories = this.loadLocalMemories();
            this.memories = this.memories.concat(localMemories);

            console.log('🎬 总共加载 ' + this.memories.length + ' 个记忆项');
        } catch (error) {
            console.error('加载记忆失败:', error);
        }
    }

    // 解析文件名 - 支持 v/p-YYYYMMDD-标题-描述 格式
    parseFileName(filename) {
        try {
            const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
            const parts = nameWithoutExt.split('-');

            if (parts.length < 4) {
                console.warn(
                    '文件名格式不正确: ' +
                        filename +
                        '，应为 v/p-YYYYMMDD-标题-描述 格式'
                );
                return null;
            }

            const typeCode = parts[0];
            const dateStr = parts[1];
            const title = parts[2];
            const description = parts.slice(3).join('-');

            // 验证类型代码
            if (typeCode !== 'v' && typeCode !== 'p') {
                console.warn(
                    '不支持的类型代码: ' +
                        typeCode +
                        '，请使用 v(视频) 或 p(图片)'
                );
                return null;
            }

            // 验证日期格式
            if (!/^\d{8}$/.test(dateStr)) {
                console.warn(
                    '日期格式错误: ' + dateStr + '，应为 YYYYMMDD 格式'
                );
                return null;
            }

            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            const formattedDate = year + '-' + month + '-' + day;

            const dateObj = new Date(formattedDate);
            if (isNaN(dateObj.getTime())) {
                console.warn('无效日期: ' + formattedDate);
                return null;
            }

            return {
                type: typeCode === 'v' ? 'video' : 'photo',
                date: formattedDate,
                timestamp: dateObj.getTime(),
                title: title,
                description: description,
            };
        } catch (error) {
            console.warn('解析文件名失败:', filename, error);
        }

        return null;
    }

    // 从本地存储加载记忆
    loadLocalMemories() {
        try {
            const memories = [];

            // 加载通用记忆数据
            const stored = localStorage.getItem('springFestivalMemories');
            if (stored) {
                memories.push(...JSON.parse(stored));
            }

            // 加载文本记忆数据（从首页添加的）
            const textMemories = localStorage.getItem('local-text-memories');
            if (textMemories) {
                const parsedTextMemories = JSON.parse(textMemories);
                memories.push(...parsedTextMemories);
                console.log(
                    '📝 从本地存储加载了 ' +
                        parsedTextMemories.length +
                        ' 个文字记忆'
                );
            }

            return memories;
        } catch (error) {
            console.warn('加载本地记忆失败:', error);
            return [];
        }
    }

    // 绑定事件
    bindEvents() {
        // 排序选择事件
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortOrder = e.target.value;
                this.renderMemories();
            });
        }
    }

    // 初始化动画效果
    initAnimations() {
        // 为页面元素添加渐入效果
        const elements = document.querySelectorAll(
            '.memories-header, .sort-section, .memories-showcase'
        );
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // 渲染记忆列表
    renderMemories() {
        const container = document.querySelector('.memories-grid');
        if (!container) {
            console.error('找不到记忆显示容器');
            return;
        }

        let sortedMemories = [...this.memories];

        // 按时间排序
        sortedMemories.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.date || 0);
            const dateB = new Date(b.timestamp || b.date || 0);

            if (this.sortOrder === 'newest') {
                return dateB - dateA; // 最新在前
            } else {
                return dateA - dateB; // 最早在前
            }
        });

        if (sortedMemories.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // 渲染记忆项
        container.innerHTML = sortedMemories
            .map((memory) => this.renderMemoryItem(memory))
            .join('');

        // 添加渐入动画
        this.animateMemoryItems();
    }

    // 渲染单个记忆项
    renderMemoryItem(memory) {
        const date = new Date(memory.timestamp || memory.date);
        const dateStr = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        let content = '';

        switch (memory.type) {
            case 'video':
                content = `
                    <div class="video-container">
                        <video controls>
                            <source src="${memory.url}" type="video/mp4">
                            您的浏览器不支持视频播放
                        </video>
                    </div>
                `;
                break;
            case 'photo':
                content = `
                    <div class="photo-container">
                        <img src="${memory.url}" alt="${
                    memory.title || '春节照片'
                }" loading="lazy">
                    </div>
                `;
                break;
            case 'text':
                content = `
                    <div class="text-content">
                        <p>${memory.content || ''}</p>
                    </div>
                `;
                break;
            default:
                content = `<div class="unknown-content">未知内容类型</div>`;
        }

        return `
            <div class="memory-item ${memory.type}-item ${
            memory.category || 'preset'
        }-item" data-id="${memory.id}">
                ${
                    this.localFeatures && this.localFeatures.isLocal
                        ? `
                    <div class="memory-actions">
                        <button class="action-btn edit-btn" onclick="memoryManager.editMemory('${memory.id}')" title="编辑记忆">
                            ✏️
                        </button>
                        <button class="action-btn delete-btn" onclick="memoryManager.deleteMemory('${memory.id}')" title="删除记忆">
                            🗑️
                        </button>
                    </div>
                `
                        : ''
                }
                ${
                    memory.category === 'upload'
                        ? '<div class="upload-badge">📤 用户上传</div>'
                        : ''
                }
                ${content}
                <div class="memory-info">
                    <h3 class="memory-title">${memory.title || '无标题'}</h3>
                    <p class="memory-date">${dateStr}</p>
                    ${
                        memory.description
                            ? `<p class="memory-desc">${memory.description}</p>`
                            : ''
                    }
                    ${
                        memory.category === 'upload'
                            ? '<p class="memory-source">📁 存储位置: uploads/</p>'
                            : ''
                    }
                </div>
            </div>
        `;
    }

    // 获取空状态HTML
    getEmptyStateHTML() {
        return `
            <div class="empty-memories" id="emptyState">
                <div class="empty-visual">
                    <div class="empty-icon">📸</div>
                    <div class="empty-sparkles">
                        <span>✨</span>
                        <span>✨</span>
                        <span>✨</span>
                    </div>
                </div>
                <h3 class="empty-title">还没有珍藏的记忆</h3>
                <p class="empty-desc">按照新的命名规则添加文件</p>
                <div class="empty-instruction">
                    <p><strong>📹 视频文件</strong>：存放在 <code>assets/videos/</code></p>
                    <p><strong>📷 图片文件</strong>：存放在 <code>assets/photos/</code></p>
                    <p><strong>📝 命名格式</strong>：<code>v/p-YYYYMMDD-标题-描述.扩展名</code></p>
                </div>
            </div>
        `;
    }

    // 为记忆项添加动画
    animateMemoryItems() {
        const items = document.querySelectorAll('.memory-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 清理（保留以供将来使用）
    closeModals() {
        // 预留方法
    }

    // 编辑记忆
    async editMemory(memoryId) {
        if (!this.localFeatures || !this.localFeatures.isLocal) {
            alert('编辑功能仅在本地服务器模式下可用');
            return;
        }

        const memory = this.memories.find((m) => m.id == memoryId);
        if (!memory) {
            alert('找不到该记忆');
            return;
        }

        const newTitle = prompt('编辑标题:', memory.title);
        if (newTitle === null) return; // 用户取消

        const newDescription = prompt('编辑描述:', memory.description || '');
        if (newDescription === null) return; // 用户取消

        const success = await this.localFeatures.updateMemory(
            memoryId,
            newTitle,
            newDescription
        );
        if (success) {
            alert('更新成功！');
            await this.loadAllMemories();
            this.renderMemories();
        } else {
            alert('更新失败，请重试');
        }
    }

    // 删除记忆
    async deleteMemory(memoryId) {
        if (!this.localFeatures || !this.localFeatures.isLocal) {
            alert('删除功能仅在本地服务器模式下可用');
            return;
        }

        const success = await this.localFeatures.deleteMemory(memoryId);
        if (success) {
            alert('删除成功！');
            await this.loadAllMemories();
            this.renderMemories();
        } else {
            alert('删除失败，请重试');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.memoryManager = new MemoryManager();

    // 添加页面加载完成的视觉效果
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
