class DailyPlanner {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
    }

    bindEvents() {
        const form = document.getElementById('taskForm');
        form.addEventListener('submit', (e) => this.handleAddTask(e));
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!title) {
            alert('Пожалуйста, введите название задачи');
            return;
        }

        const task = {
            id: Date.now(),
            title: title,
            description: description,
            createdAt: new Date().toLocaleString('ru-RU')
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        
        // Очистка формы
        titleInput.value = '';
        descriptionInput.value = '';
        titleInput.focus();
    }

    handleDeleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        
        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Задачи отсутствуют. Добавьте первую задачу!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-card" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <button class="btn-delete" onclick="planner.handleDeleteTask(${task.id})">
                        Удалить
                    </button>
                </div>
                ${task.description ? `
                    <p class="task-description">${this.escapeHtml(task.description)}</p>
                ` : ''}
                <div class="task-meta">
                    <small>Создано: ${task.createdAt}</small>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Добавление CSS для пустого состояния
const emptyStateStyles = `
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .empty-state p {
        font-size: 1.2rem;
        margin: 0;
    }
    
    .task-meta {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        color: #888;
        font-size: 0.9rem;
    }
`;

const style = document.createElement('style');
style.textContent = emptyStateStyles;
document.head.appendChild(style);

// Инициализация приложения
const planner = new DailyPlanner();