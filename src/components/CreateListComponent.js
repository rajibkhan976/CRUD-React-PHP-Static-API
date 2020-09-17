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
			setFormFields(res.data);
		})
		.catch(error => {
			setError(error);
		});
	}, []);
	
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
				<div className="col-10 mt-5">
					<div className="form-group">
						<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div className="form-group">
						<input type="password" className="form-control" id="exampleInputPassword1" />
					</div>
					<button type="submit" className="btn btn-success float-right">Save</button>
				</div>
			</div>
		</React.Fragment>
	);
}

export default CreateListComponent;