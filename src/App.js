import { useState,useEffect } from 'react';
import './App.css';
import Tasks from './components/Tasks';

function App() {
  // Hooks
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [setting, setSetting] = useState(null)

// For csrf_token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get tasks
const fetchTasks = async () => {
  const res = await fetch('http://127.0.0.1:8000/api/task-list');
  
  const data = await res.json()

  setTasks(data);
}
// Initialize fetchTasks function
useEffect(() => fetchTasks(),[])

// Change a setting status to update title
const startSetting = (task) =>{
  setSetting(task.id);
  setTitle(task.title);
}
// Create a Task
const createTask = async() =>{
    const task = { title:title,completed:false }
    const name = 'task-create';

    await addToBackend(name,'POST',task)
}
// Fetch task by pk
const fetchTask = async(pk) => {
  const res = await fetch(`http://127.0.0.1:8000/api/task-detail/${pk}`);
  const data = await res.json()
  
  return data;
}
// Update title - It's available only if the setting exists
const updateTask = async() => {
    const name = `task-update/${setting}`
    const task = await fetchTask(setting);;
    const updTask = {...task,title:title}

    await addToBackend(name,'PUT',updTask)

    setSetting(null);
}

// Update completed
const conditionToggle = async(id) =>{
  const name = `task-update/${id}`
  const task = await fetchTask(id);;
  const updTask = {...task,completed:!task.completed}

  addToBackend(name,'PUT',updTask)
}

// Delete a Task
const deleteTask = async(id) =>{
  const name = `task-delete/${id}`;

  await addToBackend(name,'DELETE')
}

// Add to backend
const addToBackend = async(name,method,task=null) => {
  const csrftoken = getCookie('csrftoken');

  const url = `http://127.0.0.1:8000/api/${name}`

  await fetch(url,{
      method: method,
      headers:{'Content-Type':'application/json',
    'X-CSRFToken':csrftoken},
      body:JSON.stringify(task)
  })

  setTitle('');
  fetchTasks();
}
// Toggle for create or update with poor validation
const handleSubmit = (e) =>{
  e.preventDefault();

  if(!title){
    alert("Please fill the form correctly")
    return
  }
  // Check if the setting exists
  setting? updateTask() : createTask();
}

  return (
    <div className="App">
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input type="text" className="form-control"
                   value={title} onChange={(e) => setTitle(e.target.value)} 
                   id="title" placeholder="Add Task..."/>
                </div>
                <div style={{flex:1}}>
                  <input type="submit" className="btn btn-warning" id="submit"/>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {/* Tasks component containing each task component */}
            { tasks.length? <Tasks tasks={tasks} startSetting={startSetting}
             conditionToggle={conditionToggle} deleteTask={deleteTask}
             /> : <p className="task-wrapper">No tasks today!</p> }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
