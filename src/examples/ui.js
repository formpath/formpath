let tasks = [{ title: 'Initial Research' }];
let FormPathInstance = null;

export function setFormPathInstance(instance) {
    FormPathInstance = instance;
}

export function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    container.innerHTML = '';
    tasks.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100 group';
        div.innerHTML = `
            <input type="text" name="project.milestones[${i}].title" value="${t.title}"
                   placeholder="Milestone name" class="flex-1 bg-transparent border-none text-sm p-1 focus:ring-0 font-medium">
            <button type="button" onclick="removeTask(${i})" class="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">&times;</button>
        `;
        container.appendChild(div);
    });
}

export function addTask() {
    tasks.push({ title: '' });
    renderTasks();
}

export function removeTask(i) {
    tasks.splice(i, 1);
    renderTasks();
}

export async function checkValidation() {
    if (!FormPathInstance) return;
    const schema = {
        'account.email': { required: true, email: true },
        'account.age': { required: true, min: 18 }
    };
    const res = await FormPathInstance.validate('val-form', schema);

    ['email', 'age'].forEach((field) => {
        const input = document.querySelector(`[name="account.${field}"]`);
        const err = document.getElementById(`err-${field}`);
        if (!input || !err) return;
        input.classList.remove('input-error');
        err.classList.add('hidden');
    });

    if (!res.isValid) {
        res.errors.forEach((e) => {
            const field = e.path.split('.')[1];
            const input = document.querySelector(`[name="${e.path}"]`);
            const errEl = document.getElementById(`err-${field}`);
            if (input) input.classList.add('input-error');
            if (errEl) {
                errEl.textContent = e.msg;
                errEl.classList.remove('hidden');
            }
        });
    } else {
        showToast('All fields valid!');
    }
}

export async function logAllData() {
    if (!FormPathInstance) return;
    const data = await FormPathInstance.getAllData();
    alert('Current DB State logged to console. Check browser DevTools!');
    console.log('FormPath Full Export:', data);
}

export async function clearAllData() {
    if (!FormPathInstance) return;
    await FormPathInstance.clearData();
    showToast('Database Cleared');
    location.reload();
}

export function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', '-translate-y-4');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.classList.remove('opacity-100', '-translate-y-4');
    }, 2500);
}
