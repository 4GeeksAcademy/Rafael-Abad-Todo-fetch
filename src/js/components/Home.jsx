import React from "react";
import { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [taskArray, setTaskArray] = useState([]);
	const [input, setInput] = useState("");

	const createUser = () => {
		fetch("https://playground.4geeks.com/todo/users/Rafa", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Rafa", todos: [] }) 
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to create user: ${response.status}`);
			}
			return response.json();
		})
		.then(data => console.log("User created successfully:", data))
		.catch(error => console.error("Error creating user:", error));
	};


	const getContacts = () => {
		fetch("https://playground.4geeks.com/todo/users/Rafa")
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data.todos)) {
					const tasksWithId = data.todos.filter(task => task.id !== undefined);
					setTaskArray(tasksWithId);
				} else {
					console.error("Invalid data format:", data);
				}
			})
			.catch(error => console.error("Error when fetching your tasks"));
	};
	 useEffect(()=>{
	 	fetch("https://playground.4geeks.com/todo/users/Rafa")
	         .then(response => {
	             if (!response.ok) {
	                 throw new Error("User not found");
	             }
	             return response.json();
	         })
	         .then(data => setTaskArray(data.todos))
	         .catch(error => {
	             console.error(error);
	             createUser();
	         });
	 },[])

	useEffect(() => {
		getContacts();
	}, [])




	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			if (input.trim() === "") {
				console.warn("Task cannot be empty!");
				return;
			}

			fetch("https://playground.4geeks.com/todo/todos/Rafa", {
				method: "POST",
				body: JSON.stringify({
					label: input,
					is_done: false
				}),
				headers: { "Content-Type": "application/json" }
			})
				.then(resp => resp.json())
				.then(data => {
					if (data.id) {
						setTaskArray(prevTasks => [...prevTasks, data]);
					} else {
						console.error("Task added but missing ID:", data);
					}
					setInput("");
				})
				.catch(error => console.error("Error when adding your tasks", error));
		}
	};

	const deleteTask = (id) => {
		console.log("Current tasks:", taskArray);
		console.log("Deleting task with ID:", id);

		if (!id) {
			console.error("Task ID is undefined, cannot delete.");
			return;
		}

		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		})
			.then(resp => {
				if (!resp.ok) {
					throw new Error(`Failed to delete task, status: ${resp.status}`);
				}
				return resp.text();
			})
			.then(() => {
				setTaskArray(prevTasks => prevTasks.filter(task => task.id !== id));
			})
			.catch(error => console.error("Error when deleting your tasks:", error));
	};


	return (
		<div className="text-center">
			<h1>Todo List</h1>
			<input
				type="text"
				placeholder="Write your task here"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyPress}
			></input>
			<ul>
				{taskArray.length === 0 ? (<li>No tasks have been added. Add a new task by preessing Enter</li>) : (
					taskArray?.map((task, index) => (
						<li key={index}>{task.label}
							<button onClick={() => deleteTask(task.id)}>X</button>
						</li>
					)))}
			</ul>
		</div>
	);
};

export default Home;