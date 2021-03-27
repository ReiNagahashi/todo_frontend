import Task from './Task';

const Tasks = ({tasks,startSetting,conditionToggle,deleteTask}) => {
    return ( 
        <div className="tasks content">
            {
                tasks.map(task => (
                    <Task task={task} key={task.id} startSetting={startSetting} 
                    conditionToggle={conditionToggle} deleteTask={deleteTask}/>
                ))
            }
        </div>
    );
}
 
export default Tasks;