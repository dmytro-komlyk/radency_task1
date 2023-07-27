import { createTasks } from './components/tasksView';
import tasks from '../constants/data';
import TasksService from './services/tasksService';

class App {
  static state = {
    tasks: [...tasks]
  }

  static startApp() {
    const services = new TasksService(this.state.tasks);
    createTasks(services);
  }
}

export default App;