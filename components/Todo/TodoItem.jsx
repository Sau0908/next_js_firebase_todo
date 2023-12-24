import React from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

const TodoItem = ({
  todo,
  handleDelete,
  handleEditTask,
  handleRemoveTask,
  editingTodo,
  setEditingTodo,
  updateTask,
  handleCompleteToggle,
}) => {
  const listItemStyle =
    "bg-white p-4 my-2 rounded-md shadow-md flex justify-between items-center hover:bg-gray-300 transition duration-300 ease-in-out";

  return (
    <li key={todo.id} className={listItemStyle}>
      <div className="flex items-center justify-between w-full ">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleCompleteToggle(todo.id)}
          className="rounded border-gray-300 focus:outline-none mr-2 focus:ring focus:border-blue-500"
        />
        <label className="flex items-center space-x-2 flex-grow">
          {editingTodo && editingTodo.id === todo.id ? (
            <div className="flex space-x-2 items-center w-full">
              <input
                type="text"
                value={editingTodo.content}
                onChange={(e) =>
                  setEditingTodo({
                    id: editingTodo.id,
                    content: e.target.value,
                  })
                }
                placeholder="Edit a task..."
                className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring focus:border-blue-500 flex-grow sm:w-64 md:w-72"
              />

              <AiOutlinePlus
                size={20}
                onClick={() => updateTask(editingTodo.id, editingTodo.content)}
                style={{ marginRight: "4px" }}
              />
            </div>
          ) : (
            <span className={todo.completed ? "line-through" : ""}>
              {todo.content}
            </span>
          )}
        </label>
        <div className="flex space-x-2">
          {!editingTodo || editingTodo.id !== todo.id ? (
            <button
              onClick={() => handleEditTask(todo.id, todo.content)}
              className="text-yellow-500 hover:text-yellow-700 focus:outline-none transform hover:scale-110 transition duration-300 ease-in-out"
            >
              <AiOutlineEdit size={20} />
            </button>
          ) : null}
          <button
            onClick={() => handleRemoveTask(todo.id)}
            className="text-red-500 hover:text-red-700 focus:outline-none transform hover:scale-110 transition duration-300 ease-in-out"
          >
            <AiOutlineDelete size={20} />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
