import TaskList from "../components/TodoList";

function Home({ tasks, deleteTask, editTask }) {
  return (
    <div>
      <h1>My Tasks</h1>
      <TaskList tasks={tasks} deleteTask={deleteTask} editTask={editTask} />
    </div>
  );
}

export default Home;
