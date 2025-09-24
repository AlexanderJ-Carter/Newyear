// ==========================================================================
// 本地服务器功能配置 - 仅在本地环境生效
// ==========================================================================

// 检测是否在本地服务器环境
const isLocalServer = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // 必须是HTTP协议（HTTPS通常是远程部署）
    if (protocol !== 'http:') return false;

    // 本地地址
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

    // 指定的IP地址范围
    const allowedIPRanges = [
        /^192\.168\./, // 192.168.0.0/16 (标准家庭网络)
        /^10\.199\.166\./, // 10.199.166.0/24 (您指定的网段)
        /^183\.172\.39\./, // 183.172.39.0/24 (您指定的网段)
    ];

    // 检查是否匹配任何允许的IP范围
    return allowedIPRanges.some((range) => range.test(hostname));
};

// 本地服务器API配置
const LOCAL_API = {
    BASE_URL: '',
    ENDPOINTS: {
        MEMORIES: '/api/memories',
        UPLOAD: '/api/upload',
        UPDATE: '/api/memories',
        DELETE: '/api/memories',
    },
};

// 本地功能增强类
class LocalFeatures {
    constructor() {
        this.isLocal = isLocalServer();
        this.init();
    }

    async init() {
        if (this.isLocal) {
            console.log('🚀 检测到本地服务器环境，启用全功能模式！');
            this.addUploadInterface();
            this.addEditFeatures();
            this.bindLocalEvents();
        } else {
            console.log('📤 GitHub静态模式，使用预定义文件');
        }
    }

    // 添加上传界面
    addUploadInterface() {
        const uploadHTML = `
            <div class="upload-section" style="margin-bottom: 20px;">
                <div class="upload-container">
                    <div class="upload-header">
                        <h3>📤 添加新记忆</h3>
                    </div>
                    <div class="upload-form">
                        <div class="form-row">
                            <input type="text" id="uploadTitle" placeholder="记忆标题" class="form-input">
                            <textarea id="uploadDescription" placeholder="记忆描述" class="form-input"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="file-upload-area" id="fileUploadArea">
                                <div class="upload-prompt">
                                    <span class="upload-icon">📁</span>
                                    <p>拖拽文件到这里或点击选择</p>
                                    <p class="upload-hint">支持图片和视频文件</p>
                                </div>
                                <input type="file" id="fileInput" accept="image/*,video/*" style="display: none;">
                            </div>
                        </div>
                        <button id="uploadButton" class="upload-btn" disabled>
                            <span>上传记忆</span>
                        </button>
                        <button id="cleanupButton" class="cleanup-btn" style="margin-top: 10px;">
                            <span>🧹 清理无效记录</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 插入到排序部分之前
        const sortSection = document.querySelector('.sort-section');
        if (sortSection) {
            sortSection.insertAdjacentHTML('beforebegin', uploadHTML);
        }

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .upload-section {
                margin: 20px 0;
            }
            .upload-container {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                border: 1px solid rgba(212, 175, 55, 0.3);
            }
            .upload-header h3 {
                color: #d4af37;
                margin: 0 0 15px 0;
                font-size: 1.2em;
            }
            .form-row {
                margin-bottom: 15px;
            }
            .form-input {
                width: 100%;
                padding: 12px;
                border: 1px solid rgba(212, 175, 55, 0.5);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-family: inherit;
                margin-bottom: 10px;
            }
            .form-input::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
            .file-upload-area {
                border: 2px dashed rgba(212, 175, 55, 0.5);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.05);
            }
            .file-upload-area:hover {
                border-color: #d4af37;
                background: rgba(212, 175, 55, 0.1);
            }
            .file-upload-area.drag-over {
                border-color: #d4af37;
                background: rgba(212, 175, 55, 0.2);
            }
            .upload-icon {
                font-size: 2em;
                display: block;
                margin-bottom: 10px;
            }
            .upload-prompt p {
                color: white;
                margin: 5px 0;
            }
            .upload-hint {
                font-size: 0.9em;
                opacity: 0.8;
            }
            .upload-btn, .cleanup-btn {
                width: 100%;
                padding: 15px;
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .upload-btn {
                background: linear-gradient(135deg, #d4af37, #f39c12);
            }
            .cleanup-btn {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
            }
            .upload-btn:hover:not(:disabled), .cleanup-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
            }
            .cleanup-btn:hover {
                box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
            }
            .upload-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // 添加编辑功能
    addEditFeatures() {
        // 为每个记忆卡片添加编辑和删除按钮
        const style = document.createElement('style');
        style.textContent = `
            .memory-card {
                position: relative;
            }
            .memory-actions {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 5px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .memory-card:hover .memory-actions {
                opacity: 1;
            }
            .action-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            .edit-btn {
                background: rgba(52, 152, 219, 0.8);
                color: white;
            }
            .edit-btn:hover {
                background: rgba(52, 152, 219, 1);
                transform: scale(1.1);
            }
            .delete-btn {
                background: rgba(231, 76, 60, 0.8);
                color: white;
            }
            .delete-btn:hover {
                background: rgba(231, 76, 60, 1);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }

    // 绑定本地功能事件
    bindLocalEvents() {
        // 文件选择和拖拽
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('fileUploadArea');
        const uploadButton = document.getElementById('uploadButton');

        if (uploadArea) {
            // 点击上传区域
            uploadArea.addEventListener('click', () => fileInput?.click());

            // 拖拽功能
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });
        }

        // 文件选择
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
        }

        // 上传按钮
        if (uploadButton) {
            uploadButton.addEventListener('click', () => this.uploadFile());
        }

        // 清理按钮
        const cleanupButton = document.getElementById('cleanupButton');
        if (cleanupButton) {
            cleanupButton.addEventListener('click', () =>
                this.cleanupInvalidRecords()
            );
        }

        // 输入框变化监听
        const titleInput = document.getElementById('uploadTitle');
        const descInput = document.getElementById('uploadDescription');

        [titleInput, descInput, fileInput].forEach((input) => {
            if (input) {
                input.addEventListener('change', () =>
                    this.updateUploadButton()
                );
            }
        });
    }

    // 处理文件选择
    handleFileSelect(file) {
        const uploadArea = document.getElementById('fileUploadArea');
        const uploadButton = document.getElementById('uploadButton');

        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="file-selected">
                    <span class="file-icon">${
                        file.type.startsWith('video/') ? '🎬' : '📸'
                    }</span>
                    <p><strong>${file.name}</strong></p>
                    <p class="file-size">${(file.size / 1024 / 1024).toFixed(
                        2
                    )} MB</p>
                    <button type="button" onclick="this.parentElement.parentElement.click()">重新选择</button>
                </div>
            `;
        }

        this.selectedFile = file;
        this.updateUploadButton();
    }

    // 更新上传按钮状态
    updateUploadButton() {
        const uploadButton = document.getElementById('uploadButton');
        const title = document.getElementById('uploadTitle')?.value?.trim();
        const hasFile = !!this.selectedFile;

        if (uploadButton) {
            uploadButton.disabled = !hasFile || !title;
        }
    }

    // 上传文件
    async uploadFile() {
        const title = document.getElementById('uploadTitle')?.value?.trim();
        const description =
            document.getElementById('uploadDescription')?.value?.trim() || '';

        if (!this.selectedFile || !title) {
            alert('请填写标题并选择文件！');
            return;
        }

        const uploadButton = document.getElementById('uploadButton');
        if (uploadButton) {
            uploadButton.disabled = true;
            uploadButton.innerHTML = '<span>上传中...</span>';
        }

        try {
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('title', title);
            formData.append('description', description);

            const response = await fetch(LOCAL_API.ENDPOINTS.UPLOAD, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                alert('上传成功！');
                this.resetUploadForm();
                // 重新加载记忆列表
                if (window.memoryManager) {
                    window.memoryManager.loadAllMemories();
                    window.memoryManager.renderMemories();
                }
            } else {
                throw new Error(result.error || '上传失败');
            }
        } catch (error) {
            console.error('上传错误:', error);
            alert('上传失败: ' + error.message);
        } finally {
            if (uploadButton) {
                uploadButton.disabled = false;
                uploadButton.innerHTML = '<span>上传记忆</span>';
            }
        }
    }

    // 重置上传表单
    resetUploadForm() {
        const uploadTitle = document.getElementById('uploadTitle');
        const uploadDescription = document.getElementById('uploadDescription');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadTitle) uploadTitle.value = '';
        if (uploadDescription) uploadDescription.value = '';
        if (fileInput) fileInput.value = '';
        
        this.selectedFile = null;

        const uploadArea = document.getElementById('fileUploadArea');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-prompt">
                    <span class="upload-icon">📁</span>
                    <p>拖拽文件到这里或点击选择</p>
                    <p class="upload-hint">支持图片和视频文件</p>
                </div>
            `;
        }

        this.updateUploadButton();
    }

    // API调用方法
    async callAPI(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);
        return response.json();
    }

    // 加载记忆数据 (本地API版本)
    async loadMemoriesFromAPI() {
        if (!this.isLocal) return [];

        try {
            const response = await fetch(LOCAL_API.ENDPOINTS.MEMORIES);
            const memories = await response.json();
            return memories;
        } catch (error) {
            console.error('从API加载记忆失败:', error);
            return [];
        }
    }

    // 更新记忆
    async updateMemory(id, title, description) {
        if (!this.isLocal) return false;

        try {
            const response = await fetch(
                `${LOCAL_API.ENDPOINTS.UPDATE}/${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description }),
                }
            );

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('更新记忆失败:', error);
            return false;
        }
    }

    // 删除记忆
    async deleteMemory(id) {
        if (!this.isLocal) return false;

        if (!confirm('确定要删除这个记忆吗？此操作不可撤销！')) {
            return false;
        }

        try {
            const response = await fetch(
                `${LOCAL_API.ENDPOINTS.DELETE}/${id}`,
                {
                    method: 'DELETE',
                }
            );

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('删除记忆失败:', error);
            return false;
        }
    }
}

// 导出本地功能类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalFeatures, isLocalServer };
} else {
    window.LocalFeatures = LocalFeatures;
    window.isLocalServer = isLocalServer;
}
