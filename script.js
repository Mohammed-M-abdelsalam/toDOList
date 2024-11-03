function addTask(){
    let arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const textarea = document.querySelector('textarea');
    const btn = document.querySelector('.add-btn');
    const input = document.querySelector('input');
    btn.addEventListener('click', function(e){
        e.preventDefault();
        if(!input.value || !textarea.value){
            return;
        }
        const obj = {
            id : Date.now().toString(),
            title : input.value,
            description : textarea.value,
            done : false
        }
        arr = [
            ...arr,
            obj
        ];
        input.value = '';
        textarea.value = '';
        store(arr);
        render(getTasks());
    });
}
addTask();

function createTaskStructure(el){
        const task = document.createElement('details');
        const summary = document.createElement('summary');
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        summary.textContent = el.title;
        const finished = document.createElement('span');
        finished.textContent = el.done ? 'done' : 'not done';
        finished.textContent = el.done ? finished.className = 'done' : finished.className = 'not-done';
        summary.append(finished);
        task.append(summary);
        li.textContent = el.description;
        ul.append(li);
        task.append(ul);
        const finishedBtn = document.createElement('button');
        finishedBtn.classname = 'finish-btn';
        finishedBtn.textContent = el.done ? 'Make as undone' : 'Make as Done';
        finishedBtn.addEventListener('click', function(e){
            e.preventDefault(); 
            toggleDone(el.id);
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.addEventListener('click', function(e){
            e.preventDefault();
            removeTask(el.id);
        })
        task.append(finishedBtn);
        task.append(deleteBtn);
        return task;
}
function render(arr){
    const fragment = document.createDocumentFragment();
    const tasks = document.querySelector('.tasks');
    tasks.textContent = '';
    arr.forEach(el => {
        let task = createTaskStructure(el);
        fragment.append(task);
    });
    tasks.append(fragment);
}
render(getTasks());

function store(arr){
    localStorage.setItem('tasks', JSON.stringify(arr));
}
function getTasks(){
    let arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    return arr;
}

function removeTask(id){
    const tasks = getTasks();
    tasks.forEach(el => {
        if(el.id == id) tasks.splice(tasks.indexOf(el), 1);
        let newArr = tasks;
        store(newArr);
        render(newArr);
    })
}

function toggleDone(id){
    const tasks = getTasks();
    tasks.forEach(el => {
        if(el.id == id) el.done = !el.done;
    });
    store(tasks);
    render(tasks);
}