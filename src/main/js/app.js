'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
//const ReactKaTeX = require('react-katex')
var Latex = require('react-latex');
const when = require('when');



const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/api';
var imageServer = 'http://localhost:7000/';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {employees: [], attributes: [], pageSize: 10, curPage: 0, totalPages: 100, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onVerify = this.onVerify.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.handleToPageInput = this.handleToPageInput.bind(this);
	}
	
	getImageServer(){
		var tempPath = '/imageserver';
		return client({
			method: 'GET',
			path: tempPath,
		});
	}

	// tag::follow-2[]
	loadFromServer(pageSize, curPage) {
		follow(client, root, [
			{rel: 'employees', params: {size: pageSize, page: curPage}}]
		).then(employeeCollection => {
			console.log(employeeCollection);
			this.curPage = employeeCollection.entity.page['number'];
			this.totalPages = employeeCollection.entity.page['totalPages'];
			return client({
				method: 'GET',
				path: employeeCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = employeeCollection.entity._links;
				return employeeCollection;
			});
		}).then(employeeCollection => {
				return employeeCollection.entity._embedded.employees.map(employee =>
							client({
									method: 'GET',
									path: employee._links.self.href
							})
				);
		}).then(employeePromises => {
				return when.all(employeePromises);
		}).done(employees => {
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				curPage: this.curPage,
				totalPages: this.totalPages,
				links: this.links});
		});
	}
	// end::follow-2[]

	// tag::create[]
	onCreate(newEmployee) {
		follow(client, root, ['employees']).then(employeeCollection => {
			return client({
				method: 'POST',
				path: employeeCollection.entity._links.self.href,
				entity: newEmployee,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [
				{rel: 'employees', params: {'size': this.state.pageSize}}]);
		}).done(response => {
			if (typeof response.entity._links.last != "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}
	// end::create[]
	
	//tag::update[]
	onUpdate(employee, updatedEmployee) {
		//updatedEmployee['verified']='true';
		client({
			method: 'PUT',
			path: employee.entity._links.self.href,
			entity: updatedEmployee,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': employee.headers.Etag
			}
		}).done(response => {
			this.loadFromServer(this.state.pageSize, this.state.curPage);
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					employee.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	// end::update[]

	// tag::delete[]
	onDelete(employee) {
		client({
			method: 'DELETE', 
			path: employee.entity._links.self.href
		}).done(response => {
			this.loadFromServer(this.state.pageSize, this.state.curPage);
			//this.onNavigate('http://localhost:8080/api/employees?page=100&size=10');
		});
	}
	// end::delete[]
	
	// tag::verify click
	onVerify(employee) {
		var updatedEmployee = JSON.parse(JSON.stringify(employee.entity))
		var prevState = updatedEmployee['verified'];
		updatedEmployee['verified'] = !prevState;
		this.onUpdate(employee, updatedEmployee);
	}

	// tag::navigate[]
	onNavigate(navUri) {
		client({
				method: 'GET', 
				path: navUri
		}).then(employeeCollection => {
				this.links = employeeCollection.entity._links;
				this.curPage = employeeCollection.entity.page['number'];
				this.totalPages = employeeCollection.entity.page['totalPages'];
				return employeeCollection.entity._embedded.employees.map(employee =>
							client({
									method: 'GET',
									path: employee._links.self.href
							})
				);
		}).then(employeePromises => {
				return when.all(employeePromises);
		}).done(employees => {
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				curPage: this.curPage,
				totalPages: this.totalPages,
				links: this.links
			});
		});
	}
	// end::navigate[]

	// tag::update-page-size[]
	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize, 0);
		}
	}
	// end::update-page-size[]
	
	// tag::handle-to-page-updates[]
	handleToPageInput(e) {
		e.preventDefault();
		var toPage = ReactDOM.findDOMNode(this.refs.toPage).value;
		if (/^[0-9]+$/.test(toPage) && toPage !== this.state.curPage) {
			this.loadFromServer(this.state.pageSize, toPage -1)
		} else {
			ReactDOM.findDOMNode(this.refs.toPage).value =
				toPage.substring(0, toPage.length - 1);
		}
	}
	// end::handle-t0-page-updates[]

	// tag::follow-1[]
	componentDidMount() {
		this.getImageServer().done(response =>{
			imageServer = response.entity['imageserver'];	
			console.log(imageServer);	
			this.loadFromServer(this.state.pageSize, 0);
		});
		
	}
	// end::follow-1[]

	render() {
		return (
			
			<div>
				<div>
					Go to <input ref="toPage" defaultValue='0' onInput={this.handleToPageInput}/> page
				</div>
				<EmployeeList employees={this.state.employees}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  curPage={this.state.curPage}
							  totalPages={this.state.totalPages}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  onVerify={this.onVerify}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

// tag::create-dialog[]
class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newEmployee = {};
		this.props.attributes.forEach(attribute => {
			newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newEmployee);

		// clear out the dialog's inputs
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = '';
		});

		// Navigate away from the dialog to hide it.
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="field" />
			</p>
		);

		return (
			<div>
				
				<a href="#createEmployee">Create</a>
				<div id="createEmployee" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new employee</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};
// end::create-dialog[]

//tag::update-dialog
class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedEmployee = {};
		this.props.attributes.forEach(attribute => {
			updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onUpdate(this.props.employee, updatedEmployee);
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
				<p key={this.props.employee.entity[attribute]}>
					<input type="text" placeholder={attribute}
						   defaultValue={this.props.employee.entity[attribute]}
						   ref={attribute} className="field" />
				</p>
		);

		var dialogId = "updateEmployee-" + this.props.employee.entity._links.self.href;

		return (
			<div key={this.props.employee.entity._links.self.href}>
				<a href={"#" + dialogId}>Update</a>
				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update an Equation</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

};
//end::update-dialog



class EmployeeList extends React.Component {

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

	// tag::handle-page-size-updates[]
	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value =
				pageSize.substring(0, pageSize.length - 1);
		}
	}
	// end::handle-page-size-updates[]

	// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}
	// end::handle-nav[]

	// tag::employee-list-render[]
	render() {
		var employees = this.props.employees.map(employee =>
			<Employee key={employee.entity._links.self.href}
							 employee={employee} 
							 attributes={this.props.attributes}
							 onUpdate={this.props.onUpdate}
							 onVerify={this.props.onVerify}
							 onDelete={this.props.onDelete}/>
		);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}else{//disabled
			navLinks.push(<button key="first" disabled>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}else{
			navLinks.push(<button key="prev" disabled>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}else{
			navLinks.push(<button key="next" disabled>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}else{
			navLinks.push(<button key="last" disabled>&gt;&gt;</button>);
		}

		return (
			<div>
				<br/>
				<input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/> records per page
				<table>
					<tbody>
						<tr>
							<th>Latex</th>
							<th>latex display</th>
							<th>File Name</th>
							<th>image</th>
							<th>verified</th>
							<th></th>
							<th> delete </th>
						</tr>
						{employees}
					</tbody>
				</table>
				<div>
					{navLinks}
					current page: <input ref="curPage" value={this.props.curPage + 1} />
					total pages: <input ref="totalPages" value={this.props.totalPages} />
				</div>
			</div>
		)
	}
	// end::employee-list-render[]
}

// tag::employee[]
class Employee extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleVerify = this.handleVerify.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.employee);
	}
	
	handleVerify(){
		this.props.onVerify(this.props.employee);
	}

	render() {
		return (
			<tr>
				<td>{this.props.employee.entity.firstName}</td>
				<td><Latex>{this.props.employee.entity.firstName}</Latex></td>
				<td>{this.props.employee.entity.lastName}</td>
				<td><img src={imageServer + this.props.employee.entity.description} height="57"/></td>
				<td><input type="checkbox"  checked={this.props.employee.entity.verified}  onClick={this.handleVerify}/></td>
				<td>
					<UpdateDialog employee={this.props.employee}
								  attributes={this.props.attributes}
								  onUpdate={this.props.onUpdate}/>
				</td>
				<td>
					<button onClick={this.handleDelete}>Delete</button>
				</td>
			</tr>
		)
	}
}
// end::employee[]

ReactDOM.render(
	<App />,
	document.getElementById('react')
)
