import React, { useState, useEffect } from 'react';
import ListComponent from './ListComponent';
import CreateListComponent from './CreateListComponent';

const DashboardComponent = ({}) => {
	
	const [listView, setListView] = useState(false);

	const toggleListView = (event) => {
		setListView(!listView);
	}
	
	return (
		<div className="container">
		{listView ?
			<CreateListComponent toggleListView={toggleListView} />
			:
			<ListComponent toggleListView={toggleListView} />
		}
		</div>
	);
}

export default DashboardComponent;