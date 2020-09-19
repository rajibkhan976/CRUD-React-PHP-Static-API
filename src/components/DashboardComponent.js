import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';
import CreateListComponent from './CreateListComponent';
import EditListComponent from './EditListComponent';

const DashboardComponent = ({}) => {
	
	const [createListView, setCreateListView] = useState(false);
	const [updateListView, setUpdateListView] = useState(false);

	const toggleCreateListView = (event) => {
		setCreateListView(!createListView);
	}
	
	const toggleUpdateListView = (event) => {
		setUpdateListView(!updateListView);
	}
	
	return (
		<div className="container">
		{createListView ?
			<CreateListComponent toggleCreateListView={toggleCreateListView} />
			:
			(updateListView) ?
			<EditListComponent toggleUpdateListView={toggleUpdateListView} />
			:
			<ListComponent 
			toggleCreateListView={toggleCreateListView} 
			toggleUpdateListView={toggleUpdateListView}
			/>
		}
		</div>
	);
}

export default DashboardComponent;