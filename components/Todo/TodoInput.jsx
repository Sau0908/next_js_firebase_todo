import React, { useState, useEffect } from "react";
import {
  AiOutlineDelete,
  AiOutlineLogout,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/Firebase";
import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TodoApp = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const { signOut, authUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
    }
    if (!!authUser) {
      setDisplayName(authUser.username);
      fetchTodos(authUser.uid);
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    setTodoInput(e.target.value);
  };

  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todoschema"), where("owner", "==", uid));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((todo) => {
        data.push({ ...todo.data(), id: todo.id });
      });
      setTodos(data);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const onKeyUp = (event) => {
    if (event?.key === "Enter" && todoInput?.length > 0) {
      addToDo();
    }
  };

  const addToDo = async () => {
    try {
      const docRef = await addDoc(collection(db, "todoschema"), {
        owner: authUser.uid,
        content: todoInput,
        completed: false,
      });
      fetchTodos(authUser.uid);
      setTodoInput("");
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "todoschema", docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleDelete = async (event, docId) => {
    try {
      const todoRef = doc(db, "todoschema", docId);

      await updateDoc(todoRef, {
        completed: event.target.checked,
      });

      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleRemoveTask = (id) => {
    deleteTodo(id);
  };

  const handleLogout = () => {
    try {
      signOut();
      toast.success("User Logout !");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditTask = (id, content) => {
    setEditingTodo({ id, content });
  };

  const updateTask = async (id, editedContent) => {
    try {
      const todoRef = doc(db, "todoschema", id);
      await updateDoc(todoRef, {
        content: editedContent,
      });

      fetchTodos(authUser.uid);
      setEditingTodo(null); // Reset editing state after updating task
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const todoInputStyle =
    "border border-gray-300 rounded-l-md py-3 px-4 focus:outline-none focus:ring focus:border-blue-500 w-full md:w-72";
  const addButtonStyle =
    "bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600 focus:outline-none ml-2 transition duration-300 ease-in-out";
  const listItemStyle =
    "bg-white p-4 my-2 rounded-md shadow-md flex justify-between items-center transition duration-300 ease-in-out hover:bg-gray-300";

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 relative">
      <div className="text-center text-4xl md:text-5xl">
        {`👋 Hii ${displayName}, What's on the agenda for today?`}
      </div>
      <div className="flex flex-col items-center mt-8">
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
        <div className="mt-4 w-full md:max-w-xl">
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className={listItemStyle}>
                <div className="flex items-center justify-between w-full">
                  <label className="flex items-center space-x-2 flex-grow">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => handleDelete(e, todo.id)}
                      className="rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
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
                        {/* Button replaced with React Icon */}
                        <AiOutlinePlus
                          size={20}
                          onClick={() =>
                            updateTask(editingTodo.id, editingTodo.content)
                          }
                          className="mr-2 "
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
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:outline-none flex items-center space-x-2 
          fixed bottom-4 right-4"
        >
          <AiOutlineLogout />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
