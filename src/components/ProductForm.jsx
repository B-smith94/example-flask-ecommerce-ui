import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Modal, Spinner } from "react-bootstrap";
import { object, func } from 'prop-types'

// Uncontrolled Component
// Simpler, no need for state. Direct data management. Improved performance. Closer to traditional HTML
// useRef => allows for direct DOM access

const ProductForm = () => {
    const [product, setProduct] = useState({ name: '', price: '' });
    const [errors, setErrors] = useState({}) // set errors state to blank object
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams; //how to set the param to use in a functional component
    const navigate = useNavigate();
    
    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/products/${id}`)
                .then(response => {
                    setProduct(response.data);
                })
                .catch(error => setErrorMessage(error.message));
        }
    }, [id])
    
    // error handling: uncontrolled component
    const validateForm = () => {
        let errors = {};
        if (!product.name) errors.name = 'Product name is required';
        if (!product.price || product.price <= 0) errors.price = 'Price must be a positive number';
        setErrors(errors); // adds properties to errors if name or price ar empty or pice is a negative number
        return Object.keys(errors).length === 0;
    };
        // handle the form submission,
        // sending data to an API or updating state in a parent component
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) return;
        setIsSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/products/${id}`, product);   
            } else {
                await axios.post('http://127.0.0.1:5000/products', product);
            }
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShowSuccessModal(false);
        setProduct({ name: '', price: '' });
        setIsSubmitting(false);
        navigate('/products'); // Use navigate for redirection
    }

    if (isSubmitting) return <p>Submitting product data...</p>

    return (
        // use <> (React Fragment) to add a parent element so that React does not get angry
        <> 
            <Form onSubmit={handleSubmit}>
                <h3>{id ? 'Edit' : 'Add'} Product</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group controlId="productName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="productPrice">
                    <Form.Label>Price:</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.price}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Submit'}
                </Button>
            </Form>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Product has been successfully {id ? 'updated' : 'added'}!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ProductForm.propTypes = {
    selectedProduct: object,
    onProductUptdated: func
}

export default ProductForm;

/* 
    const nameRef = useRef(null); // useRef(<initial value>)
    const priceRef = useRef(null);

        // error handling: uncontrolled component
    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        if (!name) errors.name = 'Product name is required';
        if (!price || price <= 0) errors.price = 'Price must be a positive number';
        return errors; // adds properties to errors if name or price ar empty or pice is a negative number


            if (isSubmitting) return <p>Submitting product data...</p>
    if (error) return <p>Error submitting product data: {error}</p>

        return(

                <form onSubmit={handleSubmit}>
            <h3>Add/Edit Product</h3>
            <label>
                Name:
                <input type="text" />
                {/* Checks for errors in name and price, and returns new div if there is an error }
                {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </label>
            <br />
            <label>
                Price:
                <input type="number" />
                {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
)
*/