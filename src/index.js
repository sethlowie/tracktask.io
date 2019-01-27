import uuid from 'uuid';
import { Elm } from './Main.elm';

const node = document.getElementById('app');

const app = Elm.Main.init({
	node,
});

const ports = app.ports;

const getItem = key => () => {
	const json = localStorage.getItem(key);
	if (json) {
		try {
			const result = JSON.parse(json);
			return result;
		} catch (e) {
			return null;
		}
	}
	return null;
}

const setItem = key => json => {
	localStorage.setItem(key, JSON.stringify(json));
}

const getTasks = getItem('tasks');

const setTasks = setItem('tasks');

if (ports && ports.addTask) {
	ports.addTask.subscribe(() => {
		const taskList = getTasks() || [];

		const activeTask = uuid();

		taskList.push({ id: activeTask, title: '' });

		setTasks(taskList);

		if (ports && ports.updateTaskList) {
			ports.updateTaskList.send({
				taskList,
				activeTask,
			});
		}
	});
}

if (ports && ports.saveTaskList) {
	ports.saveTaskList.subscribe(setTasks);
}