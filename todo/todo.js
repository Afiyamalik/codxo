document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    const calendarContainer = document.getElementById('calendar');

    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const taskText = taskInput.value;
        const date = taskDate.value;

        if (taskText.trim() === '' || date === '') return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span class="task-text">${taskText} (Due: ${formatDate(date)})</span>
            <button class="edit-btn">Edit</button>
            <button class="remove-btn">Remove</button>
        `;
        taskList.appendChild(li);

        taskInput.value = '';
        taskDate.value = '';

        li.querySelector('.remove-btn').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newTaskText = prompt('Edit task:', taskText);
            if (newTaskText !== null) {
                li.querySelector('.task-text').textContent = `${newTaskText} (Due: ${formatDate(date)})`;
                saveTasks();
            }
        });

        li.querySelector('.task-checkbox').addEventListener('change', (e) => {
            if (e.target.checked) {
                li.remove();
                saveTasks();
            }
        });

        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            const text = li.querySelector('.task-text').textContent;
            tasks.push(text);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(taskText => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span class="task-text">${taskText}</span>
                <button class="edit-btn">Edit</button>
                <button class="remove-btn">Remove</button>
            `;
            taskList.appendChild(li);

            li.querySelector('.remove-btn').addEventListener('click', () => {
                li.remove();
                saveTasks();
            });

            li.querySelector('.edit-btn').addEventListener('click', () => {
                const newTaskText = prompt('Edit task:', taskText);
                if (newTaskText !== null) {
                    li.querySelector('.task-text').textContent = newTaskText;
                    saveTasks();
                }
            });

            li.querySelector('.task-checkbox').addEventListener('change', (e) => {
                if (e.target.checked) {
                    li.remove();
                    saveTasks();
                }
            });
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    function generateCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let calendarHtml = '<table><thead><tr>';
        for (let i = 0; i < 7; i++) {
            calendarHtml += `<th>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</th>`;
        }
        calendarHtml += '</tr></thead><tbody><tr>';

        for (let i = 0; i < new Date(year, month, 1).getDay(); i++) {
            calendarHtml += '<td></td>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarHtml += `<td>${day}</td>`;
            if ((day + new Date(year, month, 1).getDay()) % 7 === 0) {
                calendarHtml += '</tr><tr>';
            }
        }

        calendarHtml += '</tr></tbody></table>';
        calendarContainer.innerHTML = calendarHtml;
    }

    generateCalendar();
    loadTasks();
});
