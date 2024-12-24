import CustomerList from './components/CustomerList';
import ProductList from './components/ProductList';
import CustomerFormWrapper from './components/CustomerFormWrapper';
import ProductForm from './components/ProductForm';
import { Route, Routes } from 'react-router-dom'; //allows usage of routes in app
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound';
import HomePage from './components/HomePage';
import './AppStyles.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className='app-container'>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/add-customer/' element={<CustomerFormWrapper />} />
        <Route path='/edit-customer/:id' element={<CustomerFormWrapper />} />
        <Route path='/customers' element={<CustomerList />} />
        <Route path='/add-product' element={<ProductForm />} />
        <Route path='/edit-product/:id' element={<ProductForm />} />
        <Route path='/products' element={<ProductList />} />
        <Route path='*' element ={<NotFound />} />
        {/* path=URL element=Componenet */}
      </Routes>
    </div>
  )
}

export default App;

/*
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCustomerId: null,
        selectedOrderId: null // => 1 or 2
    };
  }

  handleCustomerSelect = (customerId) => {
    this.setState({ selectedCustomerId: customerId });
  }

  handleOrderSelect = (orderId) => {
    this.setState({ selectedOrderId: orderId });
  };

    render() {
      const { selectedCustomerId, selectedOrderId } = this.state

        return (
          <div className="app-container">
            <h1>Our Customers</h1>
            <CustomerForm />
            <ProductForm />
            <CustomerList onCustomerSelect={this.handleCustomerSelect} />
            {selectedCustomerId && (
              <OrderList 
                  customerId={selectedCustomerId} 
                  onOrderSelect={this.handleOrderSelect}
              />
            )}
            {selectedOrderId && (
              <ProductList orderId={selectedOrderId} />
            )}
          </div>
        );
    }
}

*/