import { Component } from "react";
import axios from 'axios';
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";
import { func, number } from 'prop-types'

// Controlled Components
// When React (via state) controls the value of an input for example
// Useful for state management, form validation, "source of truth" i.e. state will always be up to date with current value. UI will always be updated
// Good for small forms, inefficient for larger forms (constantly updating, uses lots of resources)

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null,
            isLoading: false,
            showSuccessModal: false // use to determine whether or not the modal shows
        };
    }

    componenetDidMount() {
        const { id } = this.props.params; //Get the route parameter
        console.log(id);
        if (id) {
            // If an ID is present, fetch customer data for editing
            this.fetchCustomerData(id);
        }
    }

    fetchCustomerData = (id) => {
        axios.get(`http://127.0.0.1:5000/customers/${id}`)
            .then(response => {
                const customerData = response.data;
                this.setState({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    selectedCustomerId: id
                });
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    };

    componenetDidUpdate(prevProps) {
        if (prevProps.customerId !== this.props.customerId) {
            this.setState({ selectedCustomerId: this.props.customerId });

            if (this.props.customerId) {
                axios.get(`http://127.0.0.1:5000/customers/${this.props.customerId}`)
                    .then(response => {
                        const customerData = response.data;
                        this.setState({
                            name: customerData.name,
                            email: customerData.email,
                            phone: customerData.phone
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching customer data:', error);
                    })
            } else {
                this.setState({
                    name: '',
                    email: '',
                    phone: ''
                });
            }
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
//error handling: controlled componenet
    validateForm = () => {
        const { name, email, phone } = this.state; // adds errors.name/email/phone as properties to errors object
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is requried';
        if (!phone) errors.phone = 'Phone is required';
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) { // checks length of errors object, if it does not equal 0, then returns error messages
            this.setState({ isLoading: true, error: null })
            console.log('Submitted customer:', this.state);
            const customerData = {
                name: this.state.name.trim(), // trims extra white space
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };
            const apiUrl = this.state.selectedCustomerId
                ? `http://127.0.0.1:5000/customers/${this.state.selectedCustomerId}`
                : 'http://127.0.0.1:5000/customers';
        
            const httpMethod = this.state.selectedCustomerId ? axios.put : axios.post;

            httpMethod(apiUrl, customerData)
                .then(() => {
                    this.setState({
                        name: '',
                        email: '',
                        phone: '',
                        errors: {},
                        selectedCustomerId: null,
                        isLoading: false,
                        showSuccessModal: true
                    });

                })
                .catch(error => {
                    this.setState({ error: error.toString(), isLoading: false });
                });
            } else {
                this.setState({ errors });
            }
        }
    // Here you can handle the form submission,
    // such as sending data to an API or updating state in a parent componenet

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: '',
            phone: '',
            errors: {},
            selectedCustomerId: null
        });
        this.props.navigate('/customers')
    }

    render() {
        const {name, email, phone, errors, error, isLoading, showSuccessModal } = this.state;
       
        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
                {error && <Alert variant="danger">Error submitting customer data: {error}</Alert>}

                <Form onSubmit={this.handleSubmit} >
                    <Form.Group controlId='formGroupName'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={name} onChange={this.handleChange} />
                        {errors.name && <div style={{color: 'red'}}>{errors.name}</div>}
                    </Form.Group>
                    <Form.Group controlId='formGroupEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" name="email" value={email} onChange={this.handleChange} />
                        {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
                    </Form.Group>
                    <Form.Group controlId='formGroupPhone'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="tel" name="phone" value={phone} onChange={this.handleChange} />
                        {errors.phone && <div style={{color: 'red'}}>{errors.phone}</div>}
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" >Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal} >
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        The customer has been successfully {this.state.selectedCustomerId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}

CustomerForm.propTypes = {
    customerId: number,
    onUpdateCustomerList: func,
}

export default CustomerForm

/*
                    
                    this.setState({ isLoading: false });

            <form onSubmit={this.handleSubmit}>
                <h3>Add/Edit Customer</h3>
                <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={this.handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>} { checks for errors.name, and displays the <div> if there is an error }
                    </label>
                    <br />
                    <label>
                        Email:
                        <input type="email" name="email" value={email} onChange={this.HandleChange} />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </label>
                    <br />
                    <label>
                        Phone:
                        <input type="tel" name="phone" value={phone} onChange={this.handleChange} />
                        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                    </label>
                    <br />
                    <button type="submit">Submit</button>
                </form>
*/