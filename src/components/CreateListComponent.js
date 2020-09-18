import React, { useState, useEffect } from 'react';

const CreateListComponent = ({ toggleListView }) => {
	
	const [formFields, setFormFields] = useState(null);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		fetch(`http://localhost:8080/api/get_form.php`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Accept': 'application/json'
			}
		})
		.then(response => response.json())
		.then(res => {
			setFormFields(res.data.fields);
		})
		.catch(error => {
			setError(error);
		});
	}, []);
	
	const [name, setName] = useState(null);
	
	const handleChangeName = (event) => {
		setName(event.target.value);
	}
	
	const [email, setEmail] = useState(null);
	
	const handleChangeEmail = (event) => {
		setEmail(event.target.value);
	}
	
	const [gender, setGender] = useState("");
	
	const handleChangeGender = (event) => {
		setGender(event.target.value);
	}
	
	const [details, setDetails] = useState(null);
	
	const handleChangeDetails = (event) => {
		setDetails(event.target.value);
	}
	
	const [hobby, setHobby] = useState(null);
	
	const handleChangeHobby = (event) => {
		setHobby(event.target.value);
	}
	
	const handleSubmit = (event) => {
		let postData = {};
		if (name !== null) {
			Object.assign(postData, { "name": name });
		}
		if (email !== null) {
			Object.assign(postData, { "email": email });
		}
		if (gender !== "") {
			Object.assign(postData, { "gender": gender });
		}
		if (details !== null) {
			Object.assign(postData, { "details": details });
		}
		if (hobby !== null) {
			Object.assign(postData, { "hobby": hobby });
		}
		if (formFields !== null) {
			console.log(formFields);
			formFields.map((element) => {
				if (!element.id) {
					if (Object.keys(element).length === Object.keys(postData).length) {
						createList(postData);
					}
				} else {
					if (Object.keys(element).length - 1 === Object.keys(postData).length) {
						createList(postData);
					}
				}
				
			});
		}
	}
	
	const createList = async (data) => {
		const response = await fetch(`http://localhost:8080/api/submit_form.php`, {
			method: 'POST', 
			mode: 'cors',
			cache: 'no-cache',
			body: JSON.stringify(data) 
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
	}
	
	const dynamicFormCreator = (fields) => {
		if (fields) {
			let dynamicFieldsName = [];
			let dynamicFieldsValue = [];
			let dynamicInputFields = [];
			fields.map((element, index) => {
				dynamicFieldsName = Object.keys(element);
				dynamicFieldsValue = Object.values(element);
			});
			for (var c = 0; c < dynamicFieldsName.length; c++) {
				if (dynamicFieldsValue[c].type === "text" ||
					dynamicFieldsValue[c].type === "hidden"
				) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											onChange={(event) => handleChangeName(event)}
											type={dynamicFieldsValue[c].type}
											pattern="^[A-Za-z ]+$"
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required} 
											/>
											</div>;
				}
				
				if (dynamicFieldsValue[c].type === "email") {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											onChange={(event) => handleChangeEmail(event)}
											type={dynamicFieldsValue[c].type}
											pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required}
											maxLength="200"											
											/>
											</div>;
				}
				
				if (dynamicFieldsValue[c].type === "textarea" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<textarea
											className="form-control mb-3"
											onChange={(event) => handleChangeDetails(event)}
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required} 
											/>
											</div>;
				} 
				
				if (dynamicFieldsValue[c].type === "select" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<select
											className="form-control mb-3"
											onChange={(event) => handleChangeGender(event)}
											required={dynamicFieldsValue[c].required}
											>
											<option key={c} label={"select gender"}>{gender}</option>
											{(dynamicFieldsValue[c].options) ?
												dynamicFieldsValue[c].options.map((element, index) => {
													return <option key={index} label={element.label}>{element.key}</option>
												})
												:
												null
											}
											</select>
											</div>;
				}
				
				if (dynamicFieldsValue[c].type === "repeater") {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											onChange={(event) => handleChangeHobby(event)}
											type={dynamicFieldsValue[c].type}
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required} 
											/>
											</div>;
				}
			}
			return dynamicInputFields;
		}
	}
	
	return (
		<React.Fragment>
			<div className="row mt-4 mb-1">
				<div className="col-9">
					<h1 className="float-left">Create list</h1>
				</div>
				<div className="col-3">
					<button 
					type="button" 
					className="btn btn-info float-right mt-3 mb-3"
					onClick={(event) => toggleListView(event)}
					>
					Show list
					</button>
				</div>
			</div>
			<div className="row">
				<div className="col-8 mt-5">
					<form>
						{dynamicFormCreator(formFields)}
						<button 
						type="submit" 
						className="btn btn-success float-right"
						onClick={(event) => handleSubmit(event)}
						>
						Save
						</button>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
}

export default CreateListComponent;