/**
 * 新春倒计时网页 - 主要JavaScript功能
 * 包含倒计时、祝福语轮播、音乐控制、动画效果、导航栏控制等
 */

class NewYearCountdown {
    constructor() {
        // 配置
        this.config = {
            // 2026年春节时间 (农历正月初一)
            targetDate: new Date('2026-02-17T00:00:00+08:00'),
            blessingInterval: 4000, // 祝福语切换间隔（毫秒）
            animationDuration: 500, // 动画持续时间
        };

        // DOM元素
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            countdownMessage: document.getElementById('countdownMessage'),
            musicBtn: document.getElementById('musicBtn'),
            backgroundMusic: document.getElementById('backgroundMusic'),
            blessingItems: document.querySelectorAll('.blessing-item'),
            blessingDots: document.querySelectorAll('.dot'),
            navbar: document.querySelector('.main-nav'),
        };

        // 状态
        this.state = {
            countdownInterval: null,
            blessingInterval: null,
            currentBlessingIndex: 0,
            isMusicPlaying: false,
            isNewYear: false,
            lastScrollY: 0,
            navbarHeight: 0,
        };

        // 祝福语数组
        this.blessings = [
            {
                text: '马年大吉，万事如意',
                subtitle: 'Horse Year Prosperity',
            },
            {
                text: '新春快乐，阖家欢乐',
                subtitle: 'Happy Spring Festival',
            },
            {
                text: '岁岁年年，平安喜乐',
                subtitle: 'Peace and Joy Every Year',
            },
            {
                text: '马到成功，前程似锦',
                subtitle: 'Success and Bright Future',
            },
            {
                text: '财源广进，福满门庭',
                subtitle: 'Wealth and Fortune',
            },
            {
                text: '身体健康，心想事成',
                subtitle: 'Health and Wishes Come True',
            },
        ];

        // 初始化
        this.init();
    }

    /**
     * 初始化所有功能
     */
    init() {
        this.startCountdown();
        this.startBlessingRotation();
        this.initMusicControl();
        this.initInteractiveElements();
        this.initNavbarControl();
        this.createFloatingElements();
        this.initVideoElements();

        // 页面加载动画
        this.animatePageLoad();

        console.log('🎉 新春倒计时页面初始化完成！');
    }

    /**
     * 启动倒计时
     */
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.config.targetDate.getTime() - now;

            if (distance < 0) {
                this.handleNewYearArrival();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // 更新显示（添加前导零，只在数值变化时更新DOM）
            const newDays = this.padZero(days);
            const newHours = this.padZero(hours);
            const newMinutes = this.padZero(minutes);
            const newSeconds = this.padZero(seconds);

            if (
                this.elements.days &&
                this.elements.days.textContent !== newDays
            ) {
                this.elements.days.textContent = newDays;
            }
            if (
                this.elements.hours &&
                this.elements.hours.textContent !== newHours
            ) {
                this.elements.hours.textContent = newHours;
            }
            if (
                this.elements.minutes &&
                this.elements.minutes.textContent !== newMinutes
            ) {
                this.elements.minutes.textContent = newMinutes;
            }
            if (
                this.elements.seconds &&
                this.elements.seconds.textContent !== newSeconds
            ) {
                this.elements.seconds.textContent = newSeconds;
            }

            // 根据剩余天数更新背景
            this.updateBackgroundByCountdown(days);

            // 添加数字变化动画
            this.animateCountdownNumbers();
        };

        // 立即执行一次
        updateCountdown();

        // 设置定时器
        this.state.countdownInterval = setInterval(updateCountdown, 1000);
    }

    /**
     * 根据倒计时天数更新背景
     */
    updateBackgroundByCountdown(days) {
        const backgroundContainer = document.querySelector(
            '.background-container'
        );
        if (!backgroundContainer) return;

        // 移除所有倒计时背景类
        backgroundContainer.classList.remove(
            'countdown-100',
            'countdown-30',
            'countdown-10',
            'countdown-1'
        );

        if (days <= 1) {
            backgroundContainer.classList.add('countdown-1');
        } else if (days <= 10) {
            backgroundContainer.classList.add('countdown-10');
        } else if (days <= 30) {
            backgroundContainer.classList.add('countdown-30');
        } else if (days <= 100) {
            backgroundContainer.classList.add('countdown-100');
        }
    }

    /**
     * 处理新年到达
     */
    handleNewYearArrival() {
        if (this.state.isNewYear) return;

        this.state.isNewYear = true;
        clearInterval(this.state.countdownInterval);

        // 更新倒计时显示
        ['days', 'hours', 'minutes', 'seconds'].forEach((id) => {
            if (this.elements[id]) {
                this.elements[id].textContent = '00';
            }
        });

        // 更新消息
        if (this.elements.countdownMessage) {
            this.elements.countdownMessage.innerHTML = `
                <span style="color: var(--secondary-color); font-weight: bold;">🎊 新年快乐！ 🎊</span>
                <br>
                <span style="font-size: 0.9em; margin-top: 5px; display: inline-block;">马年已经到来，祝您万事如意！</span>
            `;
        }

        // 触发庆祝动画
        this.triggerCelebration();
    }

    /**
     * 触发庆祝动画
     */
    triggerCelebration() {
        document.body.classList.add('new-year-celebration');

        // 创建烟花效果
        this.createFireworks();

        // 播放庆祝音效（如果音乐已启用）
        if (this.state.isMusicPlaying) {
            this.playCelebrationSound();
        }

        // 3秒后移除庆祝类
        setTimeout(() => {
            document.body.classList.remove('new-year-celebration');
        }, 3000);
    }

    /**
     * 创建烟花效果
     */
    createFireworks() {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'fireworks';
        document.body.appendChild(fireworksContainer);

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.cssText = `
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    width: ${20 + Math.random() * 30}px;
                    height: ${20 + Math.random() * 30}px;
                    background: ${
                        colors[Math.floor(Math.random() * colors.length)]
                    };
                `;
                fireworksContainer.appendChild(firework);

                setTimeout(() => firework.remove(), 1000);
            }, i * 200);
        }

        // 5秒后移除烟花容器
        setTimeout(() => fireworksContainer.remove(), 5000);
    }

    /**
     * 启动祝福语轮播
     */
    startBlessingRotation() {
        if (this.elements.blessingItems.length === 0) return;

        const rotateBlessings = () => {
            const currentIndex = this.state.currentBlessingIndex;
            const nextIndex =
                (currentIndex + 1) % this.elements.blessingItems.length;

            // 隐藏当前祝福语
            this.elements.blessingItems[currentIndex].classList.remove(
                'active'
            );
            this.elements.blessingDots[currentIndex].classList.remove('active');

            // 显示下一个祝福语
            setTimeout(() => {
                this.elements.blessingItems[nextIndex].classList.add('active');
                this.elements.blessingDots[nextIndex].classList.add('active');
                this.state.currentBlessingIndex = nextIndex;
            }, 200);
        };

        // 设置自动轮播
        this.state.blessingInterval = setInterval(
            rotateBlessings,
            this.config.blessingInterval
        );

        // 添加点击事件
        this.elements.blessingDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index === this.state.currentBlessingIndex) return;

                clearInterval(this.state.blessingInterval);
                this.switchToBlessing(index);

                // 重新启动自动轮播
                setTimeout(() => {
                    this.state.blessingInterval = setInterval(
                        rotateBlessings,
                        this.config.blessingInterval
                    );
                }, this.config.blessingInterval);
            });
        });
    }

    /**
     * 切换到指定祝福语
     */
    switchToBlessing(index) {
        const currentIndex = this.state.currentBlessingIndex;

        this.elements.blessingItems[currentIndex].classList.remove('active');
        this.elements.blessingDots[currentIndex].classList.remove('active');

        setTimeout(() => {
            this.elements.blessingItems[index].classList.add('active');
            this.elements.blessingDots[index].classList.add('active');
            this.state.currentBlessingIndex = index;
        }, 200);
    }

    /**
     * 初始化音乐控制
     */
    initMusicControl() {
        if (!this.elements.musicBtn || !this.elements.backgroundMusic) return;

        this.elements.musicBtn.addEventListener('click', () => {
            this.toggleMusic();
        });

        // 监听音乐加载错误
        this.elements.backgroundMusic.addEventListener('error', () => {
            console.warn('背景音乐加载失败');
            this.elements.musicBtn.style.opacity = '0.5';
        });

        // 音乐加载完成后启用按钮
        this.elements.backgroundMusic.addEventListener('canplay', () => {
            this.elements.musicBtn.style.opacity = '1';
        });
    }

    /**
     * 切换音乐播放状态
     */
    toggleMusic() {
        if (!this.elements.backgroundMusic) return;

        try {
            if (this.state.isMusicPlaying) {
                this.elements.backgroundMusic.pause();
                this.elements.musicBtn.classList.remove('playing');
                this.state.isMusicPlaying = false;
            } else {
                this.elements.backgroundMusic.play();
                this.elements.musicBtn.classList.add('playing');
                this.state.isMusicPlaying = true;
            }
        } catch (error) {
            console.warn('音乐播放控制失败:', error);
        }
    }

    /**
     * 初始化交互元素
     */
    initInteractiveElements() {
        // 倒计时项悬停效果
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                this.animateElement(item, 'bounce');
            });
        });

        // 灯笼点击效果
        const lanterns = document.querySelectorAll('.lantern');
        lanterns.forEach((lantern) => {
            lantern.addEventListener('click', () => {
                this.animateElement(lantern, 'swing-strong');
            });
        });

        // 了解更多按钮
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                window.open('knowledge.html', '_blank');
            });
        }

        // 记录按钮
        const addMemoryBtns = document.querySelectorAll('.add-memory-btn');
        addMemoryBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const type = e.target.closest('.add-memory-btn').dataset.type;
                this.handleAddMemory(type);
            });
        });

        // 页面滚动效果
        this.initScrollEffects();
    }

    /**
     * 处理添加记录功能
     */
    handleAddMemory(type) {
        // 检查是否在本地服务器环境
        if (typeof isLocalServer === 'function' && isLocalServer()) {
            console.log('🚀 本地服务器模式：启用完整功能');
            this.handleLocalMemoryAdd(type);
            return;
        }

        // GitHub静态模式：显示即将上线信息
        const messages = {
            text: '📝 文字记录功能即将上线！\n您可以在这里记录春节期间的美好时光、感想和愿望。\n\n💡 提示：使用本地服务器模式可立即体验完整功能！',
            photo: '📸 图片上传功能即将上线！\n您可以在这里上传春节期间的珍贵照片和美好瞬间。\n\n💡 提示：使用本地服务器模式可立即体验完整功能！',
            video: '🎬 视频上传功能即将上线！\n您可以在这里分享春节期间的精彩视频片段。\n\n💡 提示：使用本地服务器模式可立即体验完整功能！',
        };

        alert(messages[type] || '功能即将上线！');
        console.log(`📤 GitHub静态模式：${type}功能暂不可用`);
    }

    /**
     * 本地服务器模式的记忆添加功能
     */
    handleLocalMemoryAdd(type) {
        switch (type) {
            case 'photo':
            case 'video':
                // 跳转到回忆页面进行上传
                const confirmation = confirm(
                    `🚀 检测到本地服务器模式！\n\n是否跳转到记忆页面进行${
                        type === 'photo' ? '图片' : '视频'
                    }上传？`
                );
                if (confirmation) {
                    window.location.href = 'memories.html';
                }
                break;

            case 'text':
                // 实现文本记录功能
                this.handleTextMemoryAdd();
                break;

            default:
                alert('未知的记录类型');
        }
    }

    /**
     * 处理文本记录添加
     */
    handleTextMemoryAdd() {
        const title = prompt('请输入记忆标题:');
        if (!title) return;

        const content = prompt('请输入记忆内容:');
        if (!content) return;

        // 创建文本记忆对象
        const textMemory = {
            id: Date.now() + Math.random(),
            type: 'text',
            title: title,
            content: content,
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
        };

        // 保存到本地存储
        const existingMemories = JSON.parse(
            localStorage.getItem('local-text-memories') || '[]'
        );
        existingMemories.push(textMemory);
        localStorage.setItem(
            'local-text-memories',
            JSON.stringify(existingMemories)
        );

        alert('✅ 文字记忆添加成功！\n您可以在记忆页面查看所有记录。');

        // 询问是否跳转到记忆页面
        if (confirm('是否跳转到记忆页面查看？')) {
            window.location.href = 'memories.html';
        }
    }

    /**
     * 初始化滚动效果
     */
    initScrollEffects() {
        let ticking = false;

        const updateOnScroll = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // 背景视差效果
            const backgroundElements =
                document.querySelector('.floating-elements');
            if (backgroundElements) {
                backgroundElements.style.transform = `translateY(${rate}px)`;
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }

    /**
     * 创建浮动装饰元素
     */
    createFloatingElements() {
        const container = document.querySelector('.floating-elements');
        if (!container) return;

        const elements = ['🏮', '🎋', '🌸', '✨', '🎊'];

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.textContent =
                    elements[Math.floor(Math.random() * elements.length)];
                element.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 10}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: 0.6;
                    pointer-events: none;
                    animation: floatAround ${
                        10 + Math.random() * 10
                    }s infinite linear;
                    animation-delay: ${Math.random() * 5}s;
                    z-index: -1;
                `;
                container.appendChild(element);
            }, i * 500);
        }

        // 添加浮动动画样式
        if (!document.querySelector('#float-animation-style')) {
            const style = document.createElement('style');
            style.id = 'float-animation-style';
            style.textContent = `
                @keyframes floatAround {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(50px, -30px) rotate(90deg); }
                    50% { transform: translate(-20px, -60px) rotate(180deg); }
                    75% { transform: translate(-50px, -30px) rotate(270deg); }
                    100% { transform: translate(0, 0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 页面加载动画
     */
    animatePageLoad() {
        // 为主要元素添加渐入效果
        const animateElements = document.querySelectorAll(
            '.header, .countdown-section, .blessing-section, .decoration-section, .footer'
        );

        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    /**
     * 添加数字前导零
     */
    padZero(number) {
        return number < 10 ? '0' + number : number.toString();
    }

    /**
     * 倒计时数字变化动画
     */
    animateCountdownNumbers() {
        const numbers = document.querySelectorAll('.countdown-number');
        numbers.forEach((number) => {
            number.style.transform = 'scale(1.1)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 100);
        });
    }

    /**
     * 通用元素动画
     */
    animateElement(element, animationType) {
        element.classList.add(`animate-${animationType}`);
        setTimeout(() => {
            element.classList.remove(`animate-${animationType}`);
        }, 1000);
    }

    /**
     * 播放庆祝音效
     */
    playCelebrationSound() {
        // 创建临时音效元素
        const celebrationAudio = document.createElement('audio');
        celebrationAudio.src = 'assets/audio/celebration.mp3';
        celebrationAudio.volume = 0.7;
        celebrationAudio.play().catch(() => {
            console.log('庆祝音效播放失败');
        });
    }

    /**
     * 初始化导航栏自动隐藏控制
     */
    initNavbarControl() {
        if (!this.elements.navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;

            // 如果向下滚动超过100px，隐藏导航栏
            if (scrollDelta > 0 && currentScrollY > 100) {
                this.elements.navbar.classList.add('navbar-hidden');
            }
            // 如果向上滚动，显示导航栏
            else if (scrollDelta < 0) {
                this.elements.navbar.classList.remove('navbar-hidden');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        // 添加鼠标悬停时显示导航栏
        this.elements.navbar.addEventListener('mouseenter', () => {
            this.elements.navbar.classList.remove('navbar-hidden');
        });
    }

    /**
     * 初始化视频元素，确保大小一致
     */
    initVideoElements() {
        const videos = document.querySelectorAll('.video-item video');

        videos.forEach((video) => {
            // 监听视频元数据加载完成
            video.addEventListener('loadedmetadata', () => {
                // 确保视频容器高度一致
                const wrapper = video.closest('.video-wrapper');
                if (wrapper) {
                    wrapper.style.height = '250px'; // 强制设置高度
                }
            });

            // 监听视频加载错误
            video.addEventListener('error', () => {
                console.warn('视频加载失败:', video.src);
                const wrapper = video.closest('.video-wrapper');
                if (wrapper) {
                    wrapper.style.height = '250px'; // 即使错误也保持高度
                    wrapper.style.background =
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            });
        });
    }

    /**
     * 清理定时器
     */
    destroy() {
        if (this.state.countdownInterval) {
            clearInterval(this.state.countdownInterval);
        }
        if (this.state.blessingInterval) {
            clearInterval(this.state.blessingInterval);
        }
    }
}

// 添加动画样式
const animationStyles = `
    .animate-bounce {
        animation: bounceAnimation 0.6s ease;
    }
    
    .animate-swing-strong {
        animation: swingStrongAnimation 1s ease;
    }
    
    @keyframes bounceAnimation {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0) scale(1);
        }
        40%, 43% {
            transform: translate3d(0,-15px,0) scale(1.1);
        }
        70% {
            transform: translate3d(0,-7px,0) scale(1.05);
        }
        90% {
            transform: translate3d(0,-2px,0) scale(1.02);
        }
    }
    
    @keyframes swingStrongAnimation {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
        75% { transform: rotate(-10deg); }
    }
`;

// 添加动画样式到页面
const styleElement = document.createElement('style');
styleElement.textContent = animationStyles;
document.head.appendChild(styleElement);

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化倒计时应用
    window.newYearApp = new NewYearCountdown();

    // 页面可见性变化时的处理
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停音乐
            if (window.newYearApp.state.isMusicPlaying) {
                window.newYearApp.elements.backgroundMusic.pause();
            }
        } else {
            // 页面显示时恢复音乐
            if (window.newYearApp.state.isMusicPlaying) {
                window.newYearApp.elements.backgroundMusic.play().catch(() => {
                    console.log('音乐自动播放被阻止');
                });
            }
        }
    });
});

// 页面卸载前清理
window.addEventListener('beforeunload', () => {
    if (window.newYearApp) {
        window.newYearApp.destroy();
    }
});

// 错误处理
window.addEventListener('error', (event) => {
    console.error('页面发生错误:', event.error);
});

// 导出供其他脚本使用
window.NewYearCountdown = NewYearCountdown;
