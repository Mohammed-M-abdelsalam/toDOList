function addTask(){
    const textarea = document.querySelector('textarea');
    const btn = document.querySelector('.add-btn');
    const input = document.querySelector('input');
    btn.addEventListener('click', function(e){
        e.preventDefault();
        let arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        if(input.value === '' || textarea.value === ''){
            return;
        }
        let time = new Date();
        const obj = {
            id : time.toLocaleTimeString(),
            title : input.value,
            description : textarea.value,
            done : false,
            date : time.toDateString(),
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
        const p = document.createElement('p');
        const summaryContent = document.createElement('div');
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        const time = document.createElement('time');
        p.textContent = el.title;
        const finished = document.createElement('span');
        finished.textContent = el.done ? 'done' : 'undone';
        finished.className = el.done ? 'done' : 'not-done';
        summaryContent.className = 'summary-content';
        summaryContent.append(p, finished);
        summary.appendChild(summaryContent);
        task.append(summary);
        time.textContent = el.date;
        li.textContent = el.description;
        ul.append(li);
        task.append(time);
        task.append(ul);
        const finishedBtn = document.createElement('button');
        finishedBtn.className = 'finish-btn';
        finishedBtn.textContent = el.done ? 'Make as undone' : 'Make as Done';
        finishedBtn.addEventListener('click', function(e){
            e.preventDefault(); 
            store(toggleDone(el.id));
            render(getTasks(getActiveLink().dataset.name))
        });
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.className = 'delete-btn';
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
    if(arr.length === 0){
        let notasks = document.createElement('p');
        notasks.textContent = 'No tasks';
        tasks.appendChild(notasks);
        return;
    }
    arr.forEach(el => {
        let task = createTaskStructure(el);
        fragment.append(task);
    });
    tasks.append(fragment);
}
render(getTasks('all'));

function store(arr){
    localStorage.setItem('tasks', JSON.stringify(arr));
}
function getTasks(tasks){
    let arr;
    if(tasks === 'done'){
        arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')).filter(el=>{
            if(el.done === true) return el;
        }) : [];
    }else if(tasks === 'undone'){
        arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')).filter(el=>{
            if(el.done === false) return el;
        }) : [];
    }else{
        arr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    }
    return arr;
}

function removeTask(id){
    const tasks = getTasks().filter(el => el.id !== id);
    store(tasks);
    render(tasks);
}

function toggleDone(id){
    const navLinks = document.querySelectorAll('nav ul li a');
    const activeLink = document.querySelector('.active-nav');
    let tasks;
    tasks = getTasks('all');
    tasks.forEach(el => {
        if(el.id === id) el.done = !el.done;
    });
    return tasks;
}


//nav bar
function getNavData(){
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(el => {
        el.addEventListener('click', function(e){
            const activeLink = getActiveLink();
            e.preventDefault();
            if(this !== activeLink){
                this.className = 'active-nav';
                activeLink.className = "";
                if(this === navLinks[0]){
                    render(getTasks('all'))
                }else if(this === navLinks[1]){
                    render(getTasks('done'))
                }else{
                    render(getTasks('undone'))
                }
            }
        });
    })
}
getNavData();

function getActiveLink(){
    const active = document.querySelector('.active-nav');
    return active; 
}