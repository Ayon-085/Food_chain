import React, { Component } from 'react';
import axios from 'axios';
import { ThemeProvider } from 'react-bootstrap';


class Prod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getUser: [],            
            show: false
        }
    }



    componentWillMount() {
        axios.get('/products/producer').then(res => {



            this.setState({ getUser: res.data});
            

            





        }).catch(err => {
            console.log(err)
        });

    }


    render() {



        return (
            // <p>{this.state.getUser.map(el=>{
            //     <p>el.Record.name</p>
            // })}</p>
            <div>
                {this.state.getUser}
            </div>
            // <p>hey</p>
        )
    }
}


export default Prod;