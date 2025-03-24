import React from "react";
import { useEffect,useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [taskArray, setTaskArray]=useState([]);
	const [input, setInput]=useState("");

const getContacts=()=>{
	fetch("https://playground.4geeks.com/todo/users/Rafa")
		.then(response=>response.json())
		.then(data=>setTaskArray(data.todos))
		.catch(error=>console.error("Error when fetching your tasks"));
}
	useEffect(()=> {
		getContacts();
	},[])
	

	const handleKeyPress=(e)=>{
		if (e.key === "Enter"){
			if (input.trim() === "") {  
				console.warn("Task cannot be empty!");
				return;
			}
			const newTask=[...taskArray, {label:input,done:false}];
			setTaskArray(newTask);
			fetch("https://playground.4geeks.com/todo/todos/Rafa",{
				method:"POST",
				body:JSON.stringify({
					label: input,
					is_done: false
				  }),
				headers:{"Content-Type": "application/json"}
			})
			.then(resp=>resp.json())
			.then(data => {
            console.log(data);
            setInput("");})
			.catch(error=>console.error("Error when adding your tasks"));
			

			// setTaskArray([...taskArray, input]);
			// setInput("");
		}
	};

	const deleteTask = (id) => {
		console.log("Deleting task with ID:", id); // Debugging step
	
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
			return resp.text(); // Use .text() instead of .json() to handle empty responses
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
			onChange={(e)=>setInput(e.target.value)}
			onKeyDown={handleKeyPress}
			></input>
			<ul>
				{taskArray.length===0?(<li>No tasks have been added. Add a new task by preessing Enter</li>):(
				taskArray?.map((task,index)=>(
					<li key={index}>{task.label}
					<button onClick={()=> deleteTask(task.id)}>X</button>
					</li>
				)))}
			</ul>
		</div>
	);
};

export default Home;