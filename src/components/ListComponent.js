import React, { useState, useEffect } from 'react';
import jQuery from 'jquery/dist/jquery.js';
import tableDnD from 'tablednd/dist/jquery.tablednd.js';

const ListComponent = ({}) => {
	
	const [listHeader, setListHeader] = useState(null);
	const [listRows, setListRows] = useState(null);
	const [error, setError] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState(null);
	const [searchResult, setSearchResult] = useState(null);
	
	useEffect(() => {
		fetch(`http://localhost:8080/api/list.php`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Accept': 'application/json'
			}
		})
		.then(response => response.json())
		.then(res => {
			setListHeader(res.data.headers);
			setListRows(res.data.rows);
		})
		.catch(error => {
			setError(error);
		});
	}, []);
	
	const handleSearchChange = (event) => {
		setSearchKeyword(event.target.value);
	}
	
	useEffect(() => {
		if (searchKeyword !== null && listRows !== null) {
			let searchResult = [];
			searchResult = listRows.filter((element, index) => {
				if (searchKeyword == element.id ||
				searchKeyword === element.name || 
				searchKeyword === element.created_at
				) {
					return element;
				}
			});
			setSearchResult(searchResult);
		}
	}, [searchKeyword]);
	
	jQuery(document).ready(function() {
		jQuery("#list-table").tableDnD();
	});
	
	return (
		<div className="container">
			<div className="row mt-4 mb-4">
				<div className="col-9">
					<h1 className="float-left">User list</h1>
				</div>
				<div className="col-3 mt-2">
					<div className="input-group">
						<input 
						onChange={(event) => handleSearchChange(event)}
						type="text" 
						placeholder="search" 
						aria-label="Search" 
						className="form-control" 
						/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<table id="list-table" className="table table-bordered table-hover">
						<thead className="thead-dark">
						{listHeader ? 
						listHeader.map((element, index) => {
							return <tr key={index}>
							  <th scope="col">{element.id.title}</th>
							  <th scope="col">{element.name.title}</th>
							  <th scope="col">{element.message.title}</th>
							  <th scope="col">{element.created_at.title}</th>
							</tr>
						})
						:
						null
						}
						</thead>
						<tbody>
						{(searchResult !== null && searchResult.length !== 0) ?
						searchResult.map((element, index) => {
							return <tr key={index}>
							  <th scope="row">{element.id}</th>
							  <td>{element.name}</td>
							  <td>{element.message}</td>
							  <td>{element.created_at}</td>
							</tr>
						})
						:
						(listRows) ?
						listRows.map((element, index) => {
							return <tr key={index}>
							  <th scope="row">{element.id}</th>
							  <td>{element.name}</td>
							  <td>{element.message}</td>
							  <td>{element.created_at}</td>
							</tr>
						})
						:
						null
						}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default ListComponent;