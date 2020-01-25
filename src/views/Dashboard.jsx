/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Importing React and Other Stuff
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Container, Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

const filter_categories = ["Eye Diagnosis","Systemic Diagnosis", "Age", "Ethnicity", "Image Procedure Type", "Labs", "Medication Generic Name", "Medication Therapuetic Name", "Vision", "Pressure"]

// Updated Dashboard class: This is the selected filters page
class Dashboard extends Component {

  constructor(props){
    super(props)
    this.state = {
      "apiBaseURL": "https://tigernie.com",
      "filter_categories": [],
      "filter_subcategories": {},
      "filter_subcategories_div": {},
      "selected_categories": [],
      "selected_values": {}
    }
    this.getFilterCategories = this.getFilterCategories.bind(this);
    this.getFilterSubCategories = this.getFilterSubCategories.bind(this);
    this.createFilterSubcategoryDivs = this.createFilterSubcategoryDivs.bind(this);
    this.getSelectedFilters = this.getSelectedFilters.bind(this)
    this.categoryFilterPressed = this.categoryFilterPressed.bind(this)
    this.subcategoryFilterPressed = this.subcategoryFilterPressed.bind(this)
  }

  componentDidMount() {
    this.getFilterCategories()
    this.getFilterSubCategories()
    setTimeout(() => {this.createFilterSubcategoryDivs()},1000)

  }
  //function populates the side div of all avaliable categories according to filter_categories
  getFilterCategories() {
    var temp_filter_categories = []
    for (var i=0; i < filter_categories.length; i++) {
      var category_name = filter_categories[i]
      var temp_filter_category = 
        <div className="card card-stats" style = {styles.button_style}>
          <label>
            <input type ="checkbox" title = {category_name} style = {styles.checkbox_style} onChange = {e => this.categoryFilterPressed(e)}>
            </input>
          </label>
          <div> {category_name} </div>
        </div>
      temp_filter_categories.push(temp_filter_category)
    }
    this.setState({
      "filter_categories": temp_filter_categories
    })
  }
  //function populates the subcategories of all filter categories by making the appropriate calls to the API
  getFilterSubCategories() {

    let currentComponent = this;
    const axios = require('axios');

    //get eye diagnosis subcategories from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?special=eye_diagnosis'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Eye Diagnosis"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      }) 

    //get systemic diagnosis subcategories from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?special=systemic_diagnosis'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Systemic Diagnosis"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      }) 

    //put age subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories
    temp_filter_subcategories["Age"] = ["less","greater","equal", "between"]
    currentComponent.setState({"filter_subcategories":temp_filter_subcategories})

    //put ethnicity subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories
    temp_filter_subcategories["Ethnicity"] = ["Hispanic or Latino","Not Hispanic or Latino","Declined"]
    currentComponent.setState({"filter_subcategories":temp_filter_subcategories})

    //get image procedure type from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?table_name=image_procedure&col_name=image_procedure'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Image Procedure Type"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      })
      
    //get lab values from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?table_name=lab_value_deid&col_name=name'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Labs"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      })

    //get medication generic name from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?table_name=medication_deid&col_name=generic_name'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Medication Generic Name"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      })

    //get medication therapuetic name from database
    var link = currentComponent.state.apiBaseURL + '/ssd_api/get_distinct?table_name=medication_deid&col_name=therapeutic_class'
    axios.get(link)
      .then(function (response) {
        var temp_filter_subcategories = currentComponent.state.filter_subcategories
        temp_filter_subcategories["Medication Therapuetic Name"] = response.data.result.data
        currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
      })
      .catch(function (error) {
        console.log(error);
      })

    //put vision subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories
    temp_filter_subcategories["Vision"] = ["less","greater","equal", "between"]
    currentComponent.setState({"filter_subcategories":temp_filter_subcategories})

    //put pressure subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories
    temp_filter_subcategories["Pressure"] = ["less","greater","equal", "between"]
    currentComponent.setState({"filter_subcategories":temp_filter_subcategories})
  }
  //function populates the filter categories with every unique value in database
  createFilterSubcategoryDivs() {
    var input_categories = ["Age","Vision","Pressure"]
    let temp_filter_subcategories_div = {}
    for (var key in this.state.filter_subcategories) {
      var temp_subcategories = []
      for (var index in this.state.filter_subcategories[key]) {
        var name = this.state.filter_subcategories[key][index]
        if (input_categories.indexOf(key) === -1) {
          var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} style={styles.main_div_button_checkbox} />
              {name}
            </div>
        }
        else if (name !== "between") {
          var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} style={styles.main_div_button_checkbox} />
              {name}
              <input type ="text" title = {key + ";" + name} style={styles.main_div_button_text}/>
            </div>
        }
        else {
          var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} style={styles.main_div_button_checkbox} />
              {name}
              <input type ="text" title = {key + ";" + name} style={styles.main_div_button_text} />
              and
              <input type ="text" title = {key + ";" + name} style={styles.main_div_button_text} />
            </div>
        }
        temp_subcategories.push(temp_element)
      }
      temp_filter_subcategories_div[key] = 
      <div className="card card-stats" style = {styles.main_div_button_style}>
        <div style = {styles.main_div_button_title}>
          {key}
        </div>
        {temp_subcategories}
      </div>
    }
    this.setState({
      "filter_subcategories_div": temp_filter_subcategories_div
    })
  }
  //returns an array of selected categories
  getSelectedFilters() {
    var chosen_categories = []
    for (var i = 0; i < this.state.selected_categories.length; i++) {
      var name = this.state.selected_categories[i]
      chosen_categories.push(this.state.filter_subcategories_div[name])
    }
    return chosen_categories
  }
  //updates state.selected_categories according to categories selected
  categoryFilterPressed(e) {
    let category = e.target.title;
    if (this.state.selected_categories.indexOf(category) === -1) {
      this.state.selected_categories.push(category)
      this.setState({
        "selected_categories": this.state.selected_categories
      })
    }
    else {
      var new_list = this.state.selected_categories.filter(function (name){
        return name !== category
      })
      this.setState({
        "selected_categories": new_list
      })
    }
  }
  //updates state.selected_values according to subcategories selected
  subcategoryFilterPressed(e) {
    let event = e.target.title;
    let values = event.split(";")
    let category = values[0]
    let value = values[1]
    if (!this.state.selected_values[category]) {
      this.state.selected_values[category] = [value]
      this.setState({
        "selected_values": this.state.selected_values
      })
    }
    else if (this.state.selected_values[category].indexOf(value) === -1) {
      this.state.selected_values[category].push(value)
      this.setState({
        "selected_values": this.state.selected_values
      })
    }
    else {
      var temp_list = this.state.selected_values[category].filter(function (name){
        return name !== value
      })
      var new_list = this.state.selected_values
      new_list[category] = temp_list
      this.setState({
        "selected_values": new_list
      })
    }

  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }

  //Render is what shows on the webpage
  render() {
    console.log("state",this.state)
    var chosen_filters = this.getSelectedFilters()
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={12} sm={5}>
              <div className="card card-stats" style = {styles.upper_div_style} >
                Please Select Your Filters to Create a Patient Cohort
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={3} sm={5}>
              <div className="card card-stats" style = {styles.side_div_style} >
                {this.state.filter_categories}
              </div>
            </Col>
            <Col lg={9} sm={5}>
              <div className="card card-stats" style = {styles.main_div_style} >
                  {chosen_filters}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;

const styles = {
  "upper_div_style": {
    "display": "flex",
    "justify-content": "center",
    "align-items": "center",
    "font-size": "25px",
    "height": "10vh",
  },
  "main_div_style": {
   "display": "grid",
   "grid-template-columns": "1fr 1fr 1fr",
   "grid-template-rows": "1fr 1fr 1fr 1fr",
   "height": "101vh",
   "padding": "20px",
   "grid-row-gap": "20px",
   "grid-column-gap": "20px",
  },
  "main_div_button_style": {
    "padding": "5px",
    "border-style": "solid",
    "border-width": "1px",
    "overflow": "scroll",
    "max-height": "25vh"
  },
  "main_div_button_title": {
    "display": "flex",
    "justify-content": "center",
    "font-weight": "bold",
    "text-decoration": "underline",
  },
  "main_div_button_checkbox": {
    "margin-right": "10px",
  },
  "main_div_button_text": {
    "margin-left": "2vh",
    "margin-right": "2vh",
    "width": "5vh"
  },
  "side_div_style": {
    "padding": "10px",
    "overflow": "scroll"
  },
  "button_style": {
    "display":"flex",
    "flex-direction":"row",
    "align-items": "center",
    "padding": "1px",
    "font-size": "15px"
  },
  "checkbox_style": {
    "margin-right": "10px",
    "zoom": "2"
  }
}

