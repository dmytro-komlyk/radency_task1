class TaskService {
    constructor(tasks) {
      this.tasks = tasks
    }

    getTasks() {
        return this.tasks;
    }

    createTask(newTask) {
        this.tasks = [...this.tasks, newTask];
    }

    updateTask(id, data) {
        const { date, ...restData } = data;
        this.tasks = this.tasks.map((task) => task.id === id ? { ...task, ...restData, dates: [date, ...task.dates]} : task);
    }

    selectTask(id) {
        return this.tasks.find((task) => task.id === id);
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    archiveTask(id) {
        this.tasks = this.tasks.map((task) => task.id === id ? { ...task, archived: true } : task);
    }
}

export default TaskService
