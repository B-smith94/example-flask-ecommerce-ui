// Example of Component Lifecycle in a Class Componenet
import { Component } from "react";
import axios from 'axios';
import { Link  } from "react-router-dom";
import { Button, Alert, Container, ListGroup } from "react-bootstrap";
import { func } from 'prop-types'


class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomerId: null,
            error: null
        }; //object that containst Customers property, which is an array, and selectedCustomerId set to Null by default
    }

    componentDidMount() {
        // Simulate fetching data from an API
        axios.get('http://127.0.0.1:5000/customers')
        .then(response => {
            // Assuming the resonse data is the array of customers
            this.setState({customers: response.data}) // sets state to jsonified data from flask app
            console.log(this.state.customers)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            this.setState({ error: 'Error fetching customers. Please try again later.' });
        })
    }
    
    selectCustomer = (id) => {
        this.setState({ selectedCustomerId: id });
        this.props.onCustomerSelect(id); // Set onCustomerSelect to the handleCustomerSelect function from app.jsx, then passed it as a prop
    }

    deleteCustomer = (customerId) => {
        axios.delete(`http://127.0.0.1:5000/customers/${customerId}`)
            .then(() => {
                this.fetchCustomers();
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                this.setState({ error: 'Error fetching customers. Please try again later.' });
            });
    }

    render() {
        const { customers, error } = this.state;

        return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                <h3 className="mt-3 mb-3 text-center">Customers</h3>
                <ListGroup>
                    {customers.map(customer => {
                        <ListGroup.Item key={customer.id} className='d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded'>
                            <Link to={`/edit-customer/${customer.id}`} className="text-primary">{customer.name}</Link>
                            <Button variant="danger" size="sm" onClick={() => this.deleteCustomer(customer.id)}>Delete</Button>
                        </ListGroup.Item>
                    })}
                </ListGroup>
            </Container>
        );    
    }
}

CustomerList.propTypes = {
    onCustomerSelect: func
}

export default CustomerList;

/* 
    // Runs code as soon as component is mounted, great place for API call
   
        // Only calls when data is changed or updated, not on initial render
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedCustomerId !== this.state.selectedCustomerId) {// compares previous state to current state
            console.log(`New customer selected: ID ${this.state.selectedCustomerId}`) //code that happens during update
        }
    }

    componentWillUnmount() {
        // Perform cleanup actions here, ie: event listeners, network calls, etc.
        console.log('CustomerList component is being unmounted.')
    }
*/