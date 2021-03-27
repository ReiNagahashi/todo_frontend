import '../App.css';

const Task = ({task,startSetting,conditionToggle,deleteTask}) => {
     
    return ( 
        <div className="task content flex-wrapper task-wrapper">
            {/* Double click when you want to update completed condition */}
            <div onDoubleClick={() => conditionToggle(task.id)} style={{flex:7}}>
                <span>
                    {/* Title */}
                    { task.completed ? <del>{task.title}</del> : task.title }
                </span>    
            </div>
            <div style={{flex:1}}>
                {/* Edit */}
                <button className="btn btn-sm btn-outline-info" onClick={() => startSetting(task)}>Edit</button> 
            </div>
            <div style={{flex:1}}>
                {/* Delete */}
                <button onClick={() => deleteTask(task.id)} className="btn btn-outline-dark delete">-</button>
            </div>
        </div>
     );
}

export default Task;