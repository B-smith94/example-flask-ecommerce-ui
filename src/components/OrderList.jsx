// Function Lifecycle Example

import { useState, useEffect } from 'react';
import { array } from 'prop-types'

const OrderList = ({ customerId, onOrderSelect }) => {
    const [orders, setOrders] = useState([]);

    // useEffect(setup<function>, [dependency])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/orders');
                setOrders(response.data) // sets products call to products state
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching products', error)
            }
        }

        if (customerId) {
            fetchOrders() 
        }
    }, [customerId]);

    return (
        <div className="order-list">
            <h3>Orders</h3>
            <ul>
                {orders.map(order => {
                    <li key={order.id} onClick={() => onOrderSelect(order.id)}>
                        Order Id: {order.id}, Date: {order.date}
                    </li>
                })}
            </ul>
        </div>
    )
}

OrderList.propTypes = {
    orders: array
}

export default OrderList;