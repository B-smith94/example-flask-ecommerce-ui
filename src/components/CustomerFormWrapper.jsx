import { useParams, useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";

function CustomerFormWrapper() {
    let params = useParams() // allows to notice URL variables: navigate through props to do it in Class Components (more complicated)
    let navigate = useNavigate()

    return <CustomerForm params={params} navigate={navigate} />
} 

export default CustomerFormWrapper