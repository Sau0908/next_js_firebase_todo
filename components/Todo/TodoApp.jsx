import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
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
import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

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

  const addToDo = async () => {
    try {
      if (!todoInput || todoInput.trim() === "") {
        console.error("Todo input is empty");
        toast.error("Task input is empty");
        return;
      }

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
      setEditingTodo(null);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const handleCompleteToggle = (id) => {
    // Find the todo item in your state or data by its ID and toggle its completion status
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    // Update the state or data with the modified todo list
    setTodos(updatedTodos);
  };
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 relative">
      <div className="text-center text-4xl md:text-5xl">
        {`👋 Hii ${displayName}, What's on the agenda for today?`}
      </div>
      <div className="flex flex-col items-center mt-8">
        <TodoInput
          todoInput={todoInput}
          setTodoInput={setTodoInput}
          addToDo={addToDo}
        />
        <div className="mt-4 w-full md:max-w-xl">
          <ul>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                handleDelete={handleDelete}
                handleEditTask={handleEditTask}
                handleRemoveTask={handleRemoveTask}
                editingTodo={editingTodo}
                setEditingTodo={setEditingTodo}
                updateTask={updateTask}
                handleCompleteToggle={handleCompleteToggle}
              />
            ))}
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:outline-none flex items-center space-x-2 fixed bottom-4 right-4"
        >
          <AiOutlineLogout />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TodoApp;
