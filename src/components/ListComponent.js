import React, { useState, useEffect } from 'react';
import jQuery from 'jquery/dist/jquery.js';
import tableDnD from 'tablednd/dist/jquery.tablednd.js';

const ListComponent = ({ toggleCreateListView, toggleUpdateListView }) => {
	
	const [listHeader, setListHeader] = useState(null);
	const [listData, setListData] = useState(null);
	const [listRows, setListRows] = useState(null);
	const [error, setError] = useState(null);
	
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
	
	useEffect(() => {
		if (listRows !== null) {
			setListData(listRows);
		}
	}, [listRows]);
	
	jQuery(document).ready(function() {
		jQuery("#list-table").tableDnD();
	});
	
	const [searchKeyword, setSearchKeyword] = useState(null);
	
	const handleSearchChange = (event) => {
		setSearchKeyword(event.target.value);
	}
	
	const [searchResult, setSearchResult] = useState(null);
	
	useEffect(() => {
		if (searchKeyword !== null && listRows !== null) {
			let result = [];
			result = listRows.filter((element, index) => {
				if (searchKeyword.trim() == element.id ||
					searchKeyword.trim().toLowerCase() === element.name.toLowerCase() || 
					searchKeyword.trim() === element.created_at
				) {
					return element;
				}
			});
			setSearchResult(result);
		}
	}, [searchKeyword]);
	
	useEffect(() => {
		if (searchResult !== null) {
			setListData(searchResult);
		}
	}, [searchResult]);
	
	const [sortListBy, setSortListBy] = useState("");
	
	const sortList = (event) => {
		setSortListBy(event.target.value);
	}
	
	const [sortedList, setSortedList] = useState(null);
	
	useEffect(() => {
		if (sortListBy !== ""  && listData !== null && listData.length !== 0) {
			if (sortListBy.toLowerCase() === "id") {
				let sortedById = [];
				listData.sort(function (a, b) {
						return a.id - b.id;
					}).map((element) => {
						sortedById.push(element);
					});
				setSortedList(sortedById);
			} 
			if (sortListBy.toLowerCase() === "name") {
				let sortedByName = [];
				listData.sort(function (a, b) {
						var nameA = a.name.toUpperCase(); 
						var nameB = b.name.toUpperCase();
					
						  if (nameA < nameB) {
							return -1;
						  }
						  
						  if (nameA > nameB) {
							return 1;
						  }
						  
						  return 0;
					}).map((element) => {
						sortedByName.push(element);
					});
				setSortedList(sortedByName);
			} 
			if (sortListBy.toLowerCase() === "submision date") {
				let sortedByDate = [];
				listData.sort(function (a, b) {
						var createdA = a.created_at; 
						var createdB = b.created_at; 
					
						  if (createdA < createdB) {
							return -1;
						  }
						  
						  if (createdA > createdB) {
							return 1;
						  }
						  
						  return 0;
					}).map((element) => {
						sortedByDate.push(element);
					});
				setSortedList(sortedByDate);
			}
		} else {
			if (sortListBy !== ""  && listRows !== null) {
				if (sortListBy.toLowerCase() === "id") {
					let sortedById = [];
					listRows.sort(function (a, b) {
							return b.id - a.id;
						}).map((element) => {
							sortedById.push(element);
						});
					setSortedList(sortedById);
				} 
				if (sortListBy.toLowerCase() === "name") {
					let sortedByName = [];
					listRows.sort(function (a, b) {
							var nameA = a.name.toUpperCase(); 
							var nameB = b.name.toUpperCase();
						
							  if (nameA < nameB) {
								return -1;
							  }
							  
							  if (nameA > nameB) {
								return 1;
							  }
							  
							  return 0;
						}).map((element) => {
							sortedByName.push(element);
						});
					setSortedList(sortedByName);
				} 
				if (sortListBy.toLowerCase() === "submision date") {
					let sortedByDate = [];
					listRows.sort(function (a, b) {
							var createdA = a.created_at; 
							var createdB = b.created_at; 
						
							  if (createdA < createdB) {
								return -1;
							  }
							  
							  if (createdA > createdB) {
								return 1;
							  }
							  
							  return 0;
						}).map((element) => {
							sortedByDate.push(element);
						});
					setSortedList(sortedByDate);
				}
			}
		}
	}, [sortListBy]);
	
	useEffect(() => {
		if (sortedList !== null) {
			setListData(sortedList);
		}
	}, [sortedList]);
	
	const dynamicTableHeadGenerator = () => {
		let tableHeaderArr = [];
		let tableHeaderVal = [];
		let tableHeader = [];
		if (listHeader) {
			listHeader.forEach((element) => {
				tableHeaderArr = Object.keys(element);
				tableHeaderVal = Object.values(element);
			});
		}
		tableHeaderArr.forEach((element, index) => {
			tableHeader[index] = <th scope="col" key={index}>{tableHeaderVal[index].title}</th>;
		});
		return tableHeader;
	}
	
	return (
		<React.Fragment>
			<div className="row mt-4 mb-1">
				<div className="col-6">
					<h1 className="float-left">User list</h1>
				</div>
				<div className="col-3 mt-2">
					<div className="input-group">
					  <select className="custom-select" value={sortListBy} onChange={(event) => sortList(event)}>
						{listHeader ? 
						listHeader.map((element, index) => {
							return <optgroup key={index} label="sort by">
									  <option>{element.id.title}</option>
									  <option>{element.name.title}</option>
									  <option>{element.created_at.title}</option>
							</optgroup>
						})
						:
						null
						}
					  </select>
					</div>
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
					<button 
					type="button" 
					className="btn btn-info float-right mt-3 mb-3 ml-3"
					onClick={(event) => toggleUpdateListView(event)}
					>
					Update list
					</button>
					<button 
					type="button" 
					className="btn btn-info float-right mt-3 mb-3"
					onClick={(event) => toggleCreateListView(event)}
					>
					Create list
					</button>
					<table id="list-table" className="table table-bordered table-hover">
						<thead className="thead-dark">
							<tr>
							{listHeader ? dynamicTableHeadGenerator() : null}
							</tr>
						</thead>
						<tbody>
						{(listData !== null && listData.length !== 0) ?
						listData.map((element, index) => {
							return <tr key={index}>
							  <td>{element.id}</td>
							  <td>{element.name}</td>
							  <td>{element.message}</td>
							  <td>{element.created_at}</td>
							</tr>
						})
						:
						(listRows !== null && listRows.length !== 0) ?
						listRows.map((element, index) => {
							return <tr key={index}>
							  <td>{element.id}</td>
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
		</React.Fragment>
	);
}

export default ListComponent;