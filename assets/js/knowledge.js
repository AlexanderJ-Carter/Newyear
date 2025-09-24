/**
 * 春节知识页面 - JavaScript功能
 * 包含问答功能、动画效果等
 */

class SpringFestivalKnowledge {
    constructor() {
        this.quizQuestions = [
            {
                question: '春节的传统名称是什么？',
                options: ['元旦', '农历新年', '中秋节', '端午节'],
                correct: 1,
                explanation: '春节又称农历新年，是中华民族最重要的传统节日。',
            },
            {
                question: '2026年是什么生肖年？',
                options: ['龙年', '蛇年', '马年', '羊年'],
                correct: 2,
                explanation: '2026年是农历丙午年，属马年。',
            },
            {
                question: '春节期间贴春联的寓意是什么？',
                options: ['装饰房屋', '表达祝福和愿望', '驱邪避凶', '以上都是'],
                correct: 3,
                explanation:
                    '贴春联既有装饰作用，也表达美好祝福，同时有驱邪避凶的传统寓意。',
            },
            {
                question: '饺子的形状寓意着什么？',
                options: ['月亮', '元宝', '花朵', '星星'],
                correct: 1,
                explanation: '饺子形似古代的金元宝，寓意招财进宝、财源滚滚。',
            },
            {
                question: '春节的历史大约有多少年？',
                options: ['1000多年', '2000多年', '3000多年', '4000多年'],
                correct: 3,
                explanation:
                    '春节起源于上古时期的岁首祈年祭祀，距今已有4000多年的历史。',
            },
            {
                question: '除夕夜守岁的传统习俗起源于什么？',
                options: ['防止野兽', '祭拜祖先', '驱赶年兽', '迎接新年'],
                correct: 2,
                explanation:
                    '守岁起源于古代驱赶年兽的传说，人们点灯守夜以防年兽侵扰。',
            },
            {
                question: '春节期间哪种颜色最受欢迎？',
                options: ['蓝色', '绿色', '红色', '黄色'],
                correct: 2,
                explanation:
                    '红色象征吉祥、喜庆、好运，是春节期间最受欢迎的颜色。',
            },
            {
                question: '腊月二十四是什么传统节日？',
                options: ['小年', '冬至', '腊八', '祭灶'],
                correct: 0,
                explanation: '腊月二十四是小年，也称祭灶日，要祭拜灶王爷。',
            },
            {
                question: '春节期间放鞭炮的原意是什么？',
                options: ['庆祝节日', '驱邪避凶', '制造热闹', '祭祖敬神'],
                correct: 1,
                explanation:
                    '放鞭炮最初是为了驱赶传说中的年兽和邪灵，后来演变为庆祝方式。',
            },
            {
                question: '马年生肖的性格特点通常被认为是？',
                options: ['温和内敛', '活泼开朗', '沉稳踏实', '聪明机智'],
                correct: 1,
                explanation:
                    '马年出生的人通常被认为性格活泼开朗、热情奔放、富有冒险精神。',
            },
            {
                question: "春节拜年时说'恭喜发财'的下一句通常是？",
                options: ['身体健康', '万事如意', '红包拿来', '心想事成'],
                correct: 2,
                explanation:
                    "'恭喜发财，红包拿来'是流行的拜年祝福语，寓意讨个好彩头。",
            },
            {
                question: '年糕在春节的寓意是什么？',
                options: ['团团圆圆', '年年高升', '长长久久', '甜甜蜜蜜'],
                correct: 1,
                explanation:
                    "年糕寓意'年年高升'，象征着新的一年生活和工作节节高升。",
            },
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.quizStarted = false;

        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initInteractiveElements();

        console.log('🏮 春节知识页面初始化完成！');
    }

    /**
     * 初始化滚动动画
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 观察所有知识模块
        const sections = document.querySelectorAll(
            '.knowledge-section, .interactive-section'
        );
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = `all 0.8s ease ${index * 0.1}s`;
            observer.observe(section);
        });
    }

    /**
     * 初始化交互元素
     */
    initInteractiveElements() {
        // 卡片悬停效果
        const cards = document.querySelectorAll(
            '.section-card, .custom-item, .food-item'
        );
        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                this.addCardEffect(card);
            });
        });

        // 诗词卡片点击朗读效果
        const poems = document.querySelectorAll('.poem-item');
        poems.forEach((poem) => {
            poem.addEventListener('click', () => {
                this.highlightPoem(poem);
            });
        });

        // 导航平滑滚动
        this.initSmoothScroll();
    }

    /**
     * 添加卡片效果
     */
    addCardEffect(card) {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    }

    /**
     * 高亮诗词
     */
    highlightPoem(poem) {
        // 移除其他诗词的高亮
        document.querySelectorAll('.poem-item').forEach((p) => {
            p.classList.remove('highlighted');
        });

        // 添加高亮效果
        poem.classList.add('highlighted');

        // 添加朗读效果的样式
        if (!document.querySelector('#poem-highlight-style')) {
            const style = document.createElement('style');
            style.id = 'poem-highlight-style';
            style.textContent = `
                .poem-item.highlighted {
                    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(231, 76, 60, 0.1));
                    transform: scale(1.02);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
                    border-left-color: #d4af37;
                    border-left-width: 6px;
                    transition: all 0.3s ease;
                }
                
                .poem-item.highlighted .poem-content {
                    color: #d4af37;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }

        // 3秒后移除高亮
        setTimeout(() => {
            poem.classList.remove('highlighted');
        }, 3000);
    }

    /**
     * 初始化平滑滚动
     */
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }
}

/**
 * 问答功能
 */
function startQuiz() {
    if (!window.knowledgeApp) {
        window.knowledgeApp = new SpringFestivalKnowledge();
    }

    const app = window.knowledgeApp;
    app.currentQuestion = 0;
    app.score = 0;
    app.quizStarted = true;

    showQuestion();
}

function showQuestion() {
    const app = window.knowledgeApp;
    const question = app.quizQuestions[app.currentQuestion];

    const questionElement = document.getElementById('quizQuestion');
    const optionsElement = document.getElementById('quizOptions');
    const resultElement = document.getElementById('quizResult');

    // 清除结果
    resultElement.innerHTML = '';

    // 显示问题
    questionElement.innerHTML = `
        <div class="question-header">
            <span class="question-number">第 ${app.currentQuestion + 1} 题 / ${
        app.quizQuestions.length
    }</span>
        </div>
        <p class="question-text">${question.question}</p>
    `;

    // 显示选项
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsElement.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const app = window.knowledgeApp;
    const question = app.quizQuestions[app.currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const resultElement = document.getElementById('quizResult');

    // 禁用所有选项
    options.forEach((option) => (option.disabled = true));

    // 标记正确和错误答案
    options[question.correct].classList.add('correct');
    if (selectedIndex !== question.correct) {
        options[selectedIndex].classList.add('incorrect');
    }

    // 更新分数
    if (selectedIndex === question.correct) {
        app.score++;
        resultElement.innerHTML = `
            <div class="result-correct">
                ✅ 回答正确！<br>
                <small>${question.explanation}</small>
            </div>
        `;
    } else {
        resultElement.innerHTML = `
            <div class="result-incorrect">
                ❌ 回答错误<br>
                正确答案是：${question.options[question.correct]}<br>
                <small>${question.explanation}</small>
            </div>
        `;
    }

    // 显示下一题按钮或结果
    setTimeout(() => {
        if (app.currentQuestion < app.quizQuestions.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.className = 'quiz-start-btn';
            nextButton.textContent = '下一题';
            nextButton.onclick = () => {
                app.currentQuestion++;
                showQuestion();
            };
            resultElement.appendChild(nextButton);
        } else {
            showFinalResult();
        }
    }, 2000);
}

function showFinalResult() {
    const app = window.knowledgeApp;
    const percentage = Math.round((app.score / app.quizQuestions.length) * 100);

    let message = '';
    let emoji = '';

    if (percentage >= 90) {
        message = '太棒了！您对春节文化了如指掌！';
        emoji = '🏆';
    } else if (percentage >= 70) {
        message = '很不错！您对春节有着深入的了解！';
        emoji = '🎉';
    } else if (percentage >= 50) {
        message = '还不错！继续学习春节文化知识吧！';
        emoji = '📚';
    } else {
        message = '需要多了解一些春节文化哦！';
        emoji = '💪';
    }

    document.getElementById('quizQuestion').innerHTML = `
        <div class="final-result">
            <div class="result-emoji">${emoji}</div>
            <h3>测试完成！</h3>
            <div class="score-display">
                您答对了 ${app.score} / ${app.quizQuestions.length} 题
            </div>
            <div class="score-percentage">${percentage}%</div>
            <p class="result-message">${message}</p>
        </div>
    `;

    document.getElementById('quizOptions').innerHTML = `
        <button class="quiz-start-btn" onclick="restartQuiz()">重新开始</button>
        <button class="quiz-start-btn" onclick="window.location.href='index.html'">返回首页</button>
    `;

    document.getElementById('quizResult').innerHTML = '';

    // 添加庆祝动画
    if (percentage >= 80) {
        createCelebrationEffect();
    }
}

function restartQuiz() {
    startQuiz();
}

/**
 * 创建庆祝效果
 */
function createCelebrationEffect() {
    const container = document.querySelector('.quiz-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${
                    colors[Math.floor(Math.random() * colors.length)]
                };
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                animation: confetti-fall 3s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;

            container.style.position = 'relative';
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 100);
    }

    // 添加彩纸动画
    if (!document.querySelector('#confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(400px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 添加问答结果样式
const quizStyles = `
    .question-header {
        text-align: center;
        margin-bottom: 15px;
    }
    
    .question-number {
        background: var(--primary-color);
        color: white;
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .question-text {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
    }
    
    .result-correct,
    .result-incorrect {
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        font-weight: 500;
    }
    
    .result-correct {
        background: rgba(40, 167, 69, 0.1);
        border: 2px solid #28a745;
        color: #28a745;
    }
    
    .result-incorrect {
        background: rgba(220, 53, 69, 0.1);
        border: 2px solid #dc3545;
        color: #dc3545;
    }
    
    .final-result {
        text-align: center;
        padding: 20px;
    }
    
    .result-emoji {
        font-size: 4rem;
        margin-bottom: 15px;
    }
    
    .score-display {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 15px 0;
        color: var(--text-primary);
    }
    
    .score-percentage {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 10px 0;
    }
    
    .result-message {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-top: 15px;
    }
`;

// 添加样式到页面
const styleElement = document.createElement('style');
styleElement.textContent = quizStyles;
document.head.appendChild(styleElement);

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.knowledgeApp = new SpringFestivalKnowledge();
});

// 导出供其他脚本使用
window.SpringFestivalKnowledge = SpringFestivalKnowledge;
