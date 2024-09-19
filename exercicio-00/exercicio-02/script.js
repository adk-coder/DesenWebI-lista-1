document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const taskFilter = document.getElementById('task-filter');
    const themeToggleBtn = document.getElementById('toggle-theme');
  
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [
      { name: 'Tarefa Exemplo 1', completed: false },
      { name: 'Tarefa Exemplo 2', completed: true },
    ];
    renderTasks(tasks);

    document.getElementById('task-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const taskName = taskInput.value.trim();
      if (taskName) {
        tasks.push({ name: taskName, completed: false });
        updateTasks();
        taskInput.value = '';
      }
    });
  
    taskFilter.addEventListener('input', function () {
      const filterText = taskFilter.value.toLowerCase();
      const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(filterText));
      renderTasks(filteredTasks);
    });
  
    themeToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');
      const newTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    });
  
    function renderTasks(tasksToRender) {
      taskList.innerHTML = '';
      tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
          <div>
            <button aria-label="Marcar como concluída" onclick="toggleComplete(${index})">✔️</button>
            <button aria-label="Remover tarefa" onclick="removeTask(${index})">❌</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }

    window.toggleComplete = function (index) {
      tasks[index].completed = !tasks[index].completed;
      updateTasks();
    };
  
    window.removeTask = function (index) {
      tasks.splice(index, 1);
      updateTasks();
    };

    function updateTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(tasks);
    }
  });
  