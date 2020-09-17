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
	
	console.log(formFields);
	
	const [formValue, setFormValue] = useState(null);
	
	const handleChange = (event) => {
		console.log(event.target.value);
	}
	
	const dynamicFormCreator = (fields) => {
		if (fields) {
			let dynamicFieldsName = [];
			let dynamicFieldsValue = [];
			let dynamicInputFields = [];
			fields.map((element, index) => {
				dynamicFieldsName = Object.keys(element);
				dynamicFieldsValue = Object.values(element);
				console.log(dynamicFieldsName);
				console.log(dynamicFieldsValue);
			});
			for (var c = 0; c < dynamicFieldsName.length; c++) {
				if (dynamicFieldsValue[c].type === "text" ||
					dynamicFieldsValue[c].type === "hidden" ||
					dynamicFieldsValue[c].type === "email" ||
					dynamicFieldsValue[c].type === "repeater"
				) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<input  
											className="form-control mb-3"
											onChange={(event) => handleChange(event)}
											type={dynamicFieldsValue[c].type}
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required} 
											/>
											</div>;
				}
				
				if (dynamicFieldsValue[c].type === "textarea" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<textarea
											className="form-control mb-3"
											onChange={(event) => handleChange(event)}
											placeholder={dynamicFieldsValue[c].title} 
											required={dynamicFieldsValue[c].required} 
											/>
											</div>;
				} 
				
				if (dynamicFieldsValue[c].type === "select" ) {
					dynamicInputFields[c] = <div className="form-group" key={c}>
											<select
											className="form-control mb-3"
											onChange={(event) => handleChange(event)}
											required={dynamicFieldsValue[c].required}
											>
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
						<button type="submit" className="btn btn-success float-right">Save</button>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
}

export default CreateListComponent;