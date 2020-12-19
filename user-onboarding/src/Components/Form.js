import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import FormCard from './FormCard'


// Schematics for our varification 
const formSchema = yup.object().shape({

    name: yup.string().required('Name is required'),
    email: yup.string().email('Must be a valid Email').required('Email is required'),
    password: yup.string().required('Password is required'),
    terms: yup.boolean().oneOf([true], 'Must agree to terms of service')

})


const Form = (props) => {

    const [ users, setUsers ] = useState([

    ])
  
    
    const [ formState, setFormState ] = useState({
        
        name: '',
        email: '',
        password: '',
        terms: false,
        
    });
    
    const [ errorState, setErrorState ] = useState({
        
        name: '',
        email: '',
        password: '',
        terms: '',
        
    });
    
    useEffect(() => {
        formSchema.isValid(formState)
            .then(valid => {
                setButtonDisabled(!valid)
            });
    }, [formState])
    
    const validate = event => {

        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        yup
            .reach(formSchema, event.target.name)
            .validate(value)
                .then(valid => {
                    setErrorState({
                        ...errorState, [event.target.name] : ''
                    })
                })
                .catch(error => {
                    setErrorState({
                        ...errorState, [ event.target.name ] : error.errors[0]
                    })
                })
    }

    const inputChange = event => {

        console.log(formState);

        event.persist();

        validate(event);

        let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        setFormState({
            ...formState, [ event.target.name ] : value
        })
    }

    const formSubmit = async event => {

        event.preventDefault();

        axios
        .post("https://reqres.in/api/users", formState)
        .then(res => {
            setUsers([...users, res.data]);
            console.log("Complete", users)
            setFormState({
                name: "",
                email: "",
                password: "",
                terms: false
            }); 
         })
         .catch(err => console.log(err.response))
    }

    const [ buttonDisabled, setButtonDisabled ] = useState(true)

//------------------------------------------------------------------------

    return (

        <form onSubmit={formSubmit} >
            
            <label htmlFor = 'nameId'>
                    Name:
                <input
                    type = 'text'
                    name = 'name'
                    id = 'nameId'
                    value = {formState.name}
                    onChange = {inputChange}
                />

                {/* {errorState.name.length > 0 ? ( <p className='error' > {errorState.name} </p> ) : null } */}


            </label>

            <label htmlFor = 'emailId'>
                    Email:
                <input
                    type = 'text'
                    name = 'email'
                    id = 'emailId'
                    value = {formState.email}
                    onChange = {inputChange}
                />

                {errorState.email.length > 0 ? ( <p className='error' > {errorState.email} </p> ) : null }


            </label>

            <label htmlFor = 'passwordId'>
                    Password:
                <input
                    type = 'password'
                    name = 'password'
                    id = 'passwordId'
                    value = {formState.password}
                    onChange = {inputChange}
                />

                {errorState.password.length > 0 ? ( <p className='error' > {errorState.password} </p> ) : null }


            </label>

            <label htmlFor = 'termsId'>
                    Terms of Service:
                <input
                    type = 'checkbox'
                    name = 'terms'
                    id = 'termsId'
                    value = {formState.terms}
                    onChange = {inputChange}
                />

                {errorState.terms.length > 0 ? ( <p className='error' > {errorState.terms} </p> ) : null }

            </label>

            <pre>{JSON.stringify( users, null, 2 )}</pre>


            <button disabled={buttonDisabled} > Submit </button>

            <div>

                {users.map(test => (
                    <div>
                        <div>{test.name}</div>
                        <div>{test.email}</div>
                        <div>{test.password}</div> 
                    </div>
                ))}

            </div>

        </form>
        
    )

}

export default Form