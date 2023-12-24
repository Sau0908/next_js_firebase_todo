import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const TodoInput = ({ todoInput, setTodoInput, addToDo }) => {
  const handleInputChange = (e) => {
    setTodoInput(e.target.value);
  };

  const onKeyUp = (event) => {
    if (event?.key === "Enter" && todoInput?.length > 0) {
      addToDo();
    }
  };

  const todoInputStyle =
    "border border-gray-300 rounded-l-md py-3 px-4 focus:outline-none focus:ring focus:border-blue-500 w-full md:w-72";
  const addButtonStyle =
    "bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600 focus:outline-none ml-2 transition duration-300 ease-in-out";

  return (
    <div className="bg-gray-100 rounded-md p-4 shadow-md flex w-full md:w-96">
      <input
        type="text"
        placeholder="Add a task..."
        value={todoInput}
        onChange={handleInputChange}
        onKeyUp={onKeyUp}
        className={todoInputStyle}
      />
      <button onClick={addToDo} className={addButtonStyle}>
        <AiOutlinePlus size={20} />
      </button>
    </div>
  );
};

export default TodoInput;
