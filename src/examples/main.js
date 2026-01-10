import FormPath from '../FormPath.js';
import {
    addTask,
    checkValidation,
    clearAllData,
    logAllData,
    removeTask,
    renderTasks,
    setFormPathInstance
} from './ui.js';

const ff = new FormPath({
    onChange: (data) => {
        const simple = document.getElementById('json-simple');
        if (simple) {
            simple.textContent = JSON.stringify(data['simple-profile'] || {}, null, 4);
        }

        const multipane = document.getElementById('json-multipane');
        if (multipane) {
            const panes = { pane_a: data['pane-a'], pane_b: data['pane-b'] };
            multipane.textContent = JSON.stringify(panes, null, 4);
        }

        const dynamic = document.getElementById('json-dynamic');
        if (dynamic) {
            dynamic.textContent = JSON.stringify(data['dynamic-tasks'] || {}, null, 4);
        }
    }
});

setFormPathInstance(ff);
window.ff = ff;
window.addTask = addTask;
window.removeTask = removeTask;
window.checkValidation = checkValidation;
window.logAllData = logAllData;
window.clearAllData = clearAllData;

window.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
