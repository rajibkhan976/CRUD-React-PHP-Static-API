import React, { useState, useEffect } from 'react';

const EditListComponent = ({ toggleUpdateListView }) => {
	
	const [formFields, setFormFields] = useState(null);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		fetch(`http://localhost:8080/api/get_form.php?id=67`, {
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
	
	const [name, setName] = useState("");
	
	const [email, setEmail] = useState("");
	
	const [gender, setGender] = useState("");
	
	const [details, setDetails] = useState("");
	
	const [workplaceOne, setWorkplaceOne] = useState("");
	
	const [workplaceTwo, setWorkplaceTwo] = useState("");
	
	const [designationOne, setDesignationOne] = useState("");
	
	const [designationTwo, setDesignationTwo] = useState("");
	
	const handleChange = (event) => {
		if (event.target.name === "name") {
			setName(event.target.value);
		}
		if (event.target.name === "email") {
			setEmail(event.target.value);
		}
		if (event.target.name === "details") {
			setDetails(event.target.value);
		}
		if (event.target.name === "gender") {
			setGender(event.target.value);
		}
		if (event.target.name === "designationOne") {
			setDesignationOne(event.target.value);
		}
		if (event.target.name === "designationTwo") {
			setDesignationTwo(event.target.value);
		}
		if (event.target.name === "workplaceOne") {
			setWorkplaceOne(event.target.value);
		}
		if (event.target.name === "workplaceTwo") {
			setWorkplaceTwo(event.target.value);
		}
	}
	
	const handleSubmit = (event) => {
		event.preventDefault();
		let postData = {};
		if (name !== "") {
			Object.assign(postData, { "name": name });
		}
		if (email !== "") {
			Object.assign(postData, { "email": email });
		}
		if (gender !== "") {
			Object.assign(postData, { "gender": gender });
		}
		if (details !== "") {
			Object.assign(postData, { "details": details });
		}
		if (designationOne !== "" &&
			designationTwo !== "" &&
			workplaceOne !== "" &&
			workplaceTwo !== ""
		) {
			Object.assign(postData, { "work": {
				"designationOne": designationOne,
				"workplaceOne": workplaceOne,
				"designationTwo": designationTwo,
				"workplaceTwo": workplaceTwo
			}});
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
	
	const [dynamicFields, setDynamicFields] = useState(null);
	
	useEffect(() => {
		if (formFields !== null) {
			formFields.map((element) => {
				setDynamicFields(Object.values(element));
			});
		}
	}, [formFields]);
	
	useEffect(() => {
		if (dynamicFields !== null) {
			dynamicFields.forEach((element) => {
				if (element.title === "Full name") {
					setName(element.value);
				} 
				if (element.title === "Email") {
					setEmail(element.value);
				} 
				if (element.title === "Details") {
					setDetails(element.value);
				}
				if (element.title === "Gender") {
					setGender(element.value);
				}
				if (element.title === "Work") {
					element.value.forEach((repeatedElement, index) => {
						if (index === 0 && repeatedElement.designation) {
							setDesignationOne(repeatedElement.designation);
						}
						if (index === 1 && repeatedElement.designation) {
							setDesignationTwo(repeatedElement.designation);
						}
						if (index === 0 && repeatedElement.work_place) {
							setWorkplaceOne(repeatedElement.work_place);
						}
						if (index === 1 && repeatedElement.work_place) {
							setWorkplaceTwo(repeatedElement.work_place);
						}
					});
				}
			});
		}
	}, [dynamicFields]);
	
	const dynamicFormBuilder = (fields) => {
		if (fields) {
			let dynamicFieldsAttrValue = [];
			fields.map((element, index) => {
				dynamicFieldsAttrValue = Object.values(element);
			});
			return dynamicInputFieldGenerator(dynamicFieldsAttrValue);
		}
	}
	
	const dynamicInputFieldGenerator = (fieldAttr) => {
		let dynamicInputFields = [];
		for (var c = 0; c < fieldAttr.length; c++) {
				if (fieldAttr[c].type === "text" ||
					fieldAttr[c].type === "hidden"
				) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											name="name"
											value={name}
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
											value={email}
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
											value={details}
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
											value={gender}
											onChange={(event) => handleChange(event)}
											required={fieldAttr[c].required}
											>
											<option key={c} label={gender}>{gender}</option>
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
					dynamicInputFields[c] = <div key={c}>
											<div className="form-group">
											<input  
											className="form-control mb-3"
											name="designationOne"
											value={designationOne}
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].repeater_fields.designation.type}
											placeholder={fieldAttr[c].repeater_fields.designation.title}
											pattern="^[A-Za-z ]+$"
											maxLength="100"					
											required={fieldAttr[c].repeater_fields.designation.required} 
											/>
											<input  
											className="form-control mb-3"
											name="workplaceOne"
											value={workplaceOne}
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].repeater_fields.work_place.type}
											placeholder={fieldAttr[c].repeater_fields.work_place.title} 
											pattern="^[A-Za-z ]+$"
											maxLength="100"					
											required={fieldAttr[c].repeater_fields.work_place.required} 
											/>
											</div>
											<div className="form-group">
											<input  
											className="form-control mb-3"
											name="designationTwo"
											value={designationTwo}
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].repeater_fields.designation.type}
											placeholder={fieldAttr[c].repeater_fields.designation.title}
											pattern="^[A-Za-z ]+$"
											maxLength="100"					
											required={fieldAttr[c].repeater_fields.designation.required} 
											/>
											<input  
											className="form-control mb-3"
											name="workplaceTwo"
											value={workplaceTwo}
											onChange={(event) => handleChange(event)}
											type={fieldAttr[c].repeater_fields.work_place.type}
											placeholder={fieldAttr[c].repeater_fields.work_place.title} 
											pattern="^[A-Za-z ]+$"
											maxLength="100"					
											required={fieldAttr[c].repeater_fields.work_place.required} 
											/>
											</div>
										</div>;
				}
			}
		return dynamicInputFields;
	}
	
	return (
		<React.Fragment>
			<div className="row mt-4 mb-1">
				<div className="col-9">
					<h1 className="float-left">Update list</h1>
				</div>
				<div className="col-3">
					<button 
					type="button" 
					className="btn btn-info float-right mt-3 mb-3"
					onClick={(event) => toggleUpdateListView(event)}
					>
					Show list
					</button>
				</div>
			</div>
			<div className="row">
				<div className="col-8 mt-5">
					<form>
						{dynamicFormBuilder(formFields)}
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

export default EditListComponent;