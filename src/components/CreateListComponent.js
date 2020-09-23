import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const CreateListComponent = ({ toggleCreateListView }) => {
	
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
	
	const [email, setEmail] = useState(null);
	
	const [gender, setGender] = useState("");
	
	const [details, setDetails] = useState(null);
	
	const [hobby, setHobby] = useState(null);
	
	const handleChange = (event) => {
		if (event.target.name === "name") {
			setName(event.target.value);
		}
		if (event.target.name === "email") {
			setEmail(event.target.value);
		}
		if (event.target.name === "gender") {
			setGender(event.target.value);
		}
		if (event.target.name === "details") {
			setDetails(event.target.value);
		}
		if (event.target.name === "hobby") {
			setHobby(event.target.value);
		}
	}
	
	const handleSubmit = (event) => {
		event.preventDefault();
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
	
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	
	const createList = async (data) => {
		await setDisable(true);
		await setSuccessMessage(null);
		await setErrorMessage(null);
		const response = await fetch(`http://localhost:8080/api/submit_form.php`, {
			method: 'POST', 
			mode: 'cors',
			cache: 'no-cache',
			body: JSON.stringify(data) 
		})
		.then(response => response.json())
		.then((res) => {
			setSuccessMessage(res.status);
		})
		.catch((error) => {
			setErrorMessage(error);
		});
	}
	
	const [disable, setDisable] = useState(false);
	
	useEffect(() => {
		if (successMessage !== null) {
			setDisable(false);
		}
	}, [successMessage]);
	
	const dynamicFormBuilder = (fields) => {
		if (fields) {
			let dynamicFieldsName = [];
			let dynamicFieldsAttrValue = [];
			fields.map((element, index) => {
				dynamicFieldsName = Object.keys(element);
				dynamicFieldsAttrValue = Object.values(element);
			});
			return dynamicInputFieldGenerator(dynamicFieldsName, dynamicFieldsAttrValue);
		}
	}
	
	const dynamicInputFieldGenerator = (fieldName, fieldAttr) => {
		let dynamicInputFields = [];
		for (var c = 0; c < fieldName.length; c++) {
				if (fieldAttr[c].type === "text" ||
					fieldAttr[c].type === "hidden"
				) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											name="name"
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].type}
											pattern="^[A-Za-z ]+$"
											placeholder={fieldAttr[c].title} 
											required={fieldAttr[c].required} 
											/>
											</div>;
				}
				
				if (fieldAttr[c].type === "email") {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											name="email"
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].type}
											pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
											placeholder={fieldAttr[c].title} 
											required={fieldAttr[c].required}
											maxLength="200"											
											/>
											</div>;
				}
				
				if (fieldAttr[c].type === "textarea" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<textarea
											className="form-control mb-3"
											name="details"
											onChange={(event) => handleChange(event)}
											placeholder={fieldAttr[c].title} 
											required={fieldAttr[c].required} 
											/>
											</div>;
				} 
				
				if (fieldAttr[c].type === "select" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<select
											className="form-control mb-3"
											name="gender"
											onChange={(event) => handleChange(event)}
											required={fieldAttr[c].required}
											>
											<option key={c} label={"select gender"}>{gender}</option>
											{(fieldAttr[c].options) ?
												fieldAttr[c].options.map((element, index) => {
													return <option key={index} label={element.label}>{element.key}</option>
												})
												:
												null
											}
											</select>
											</div>;
				}
				
				if (fieldAttr[c].type === "repeater") {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											name="hobby"
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].type}
											placeholder={fieldAttr[c].title} 
											required={fieldAttr[c].required} 
											/>
											</div>;
				}
			}
		return dynamicInputFields;
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
					onClick={(event) => toggleCreateListView(event)}
					>
					Show list
					</button>
				</div>
			</div>
			<div className="row">
				<div className="col-8 mt-5">
					<form>
						{dynamicFormBuilder(formFields)}
						<p
						className={
							(successMessage !== null) ? 
							"text-success" 
							:
							(errorMessage !== null) ?
							"text-danger"
							:
							"no-text"
							}
						>
						{
							(successMessage !== null) ? 
							successMessage 
							:
							(errorMessage !== null) ?
							errorMessage
							:
							null
							}
						</p>
						<button 
						type="submit" 
						className="btn btn-success float-right"
						onClick={(event) => handleSubmit(event)}
						disabled={disable}
						>
						{disable ?
							<FontAwesomeIcon className="mr-2" icon={faSpinner} />
							:
							null
						}
						Save
						</button>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
}

export default CreateListComponent;