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
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import CustomButton from "components/CustomButton/CustomButton";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import { apiBaseURL } from "./Dashboard.jsx";

const filter_categories = [
    "Eye Diagnosis",
    "Systemic Diagnosis",
    "Age",
    "Ethnicity",
    "Image Procedure Type",
    "Labs",
    "Medication Generic Name",
    "Medication Therapuetic Name",
    "Vision",
    "Pressure"
  ];

class FilterPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
          filter_categories: [],
          filter_subcategories: {},
          filter_subcategories_div: {},
          selected_categories: [],
          selected_values: {},
          checkbox_values: {}
        };
        this.getFilterCategories = this.getFilterCategories.bind(this);
        this.getFilterSubCategories = this.getFilterSubCategories.bind(this);
        this.createFilterSubcategoryDivs = this.createFilterSubcategoryDivs.bind(
          this
        );
        this.getSelectedFilters = this.getSelectedFilters.bind(this);
        this.categoryFilterPressed = this.categoryFilterPressed.bind(this);
        this.subcategoryFilterPressed = this.subcategoryFilterPressed.bind(this);
        this.checkBoxChanged = this.checkBoxChanged.bind(this);
        this.resetButtonPressed = this.resetButtonPressed.bind(this);
        this.submitButtonPressed = this.submitButtonPressed.bind(this);
  }

  componentDidMount() {
    let filter_categories = this.getFilterCategories();
    this.setState({
      filter_categories: filter_categories
    });
    this.getFilterSubCategories();
    setTimeout(() => {
      this.createFilterSubcategoryDivs();
    }, 1000);
    if (this.props.additionalInfo) {
      console.log("HELLO")
      var tempSelectedCategories = []
      for (var key in this.props.additionalInfo) {
        tempSelectedCategories.push(key)
      }
      this.setState({
        selected_categories: tempSelectedCategories,
        selected_values: this.props.additionalInfo
      })
    }
  }

  //resets all of the filters and subfilters selected
  resetButtonPressed() {
    this.setState({
      selected_categories: [],
      selected_values: {},
      checkbox_values: {}
    });
  }

  //submits all of the filters to the patients page
  submitButtonPressed() {
    let temp_selected_values = this.state.selected_values
    for (var key in this.state.checkbox_values) {
      temp_selected_values[key] = this.state.checkbox_values[key]
    }
    let newState = {
      "page": "PatientsPage",
      "additionalInfo": temp_selected_values
    }
    this.props.changePage(newState)
  }

    //function populates the side div of all avaliable categories according to filter_categories
  getFilterCategories() {
    var temp_filter_categories = [];
    for (var i = 0; i < filter_categories.length; i++) {
      var category_name = filter_categories[i];
      var temp_filter_category = null
      if (this.state.selected_categories.indexOf(category_name) !== -1){
        temp_filter_category = (
          <CustomButton style={styles.buttonDivPressed} title = {category_name} onClick = {e => this.categoryFilterPressed(e)} > {category_name} </CustomButton>
        );
      }
      else {
        temp_filter_category = (
          <CustomButton style={styles.buttonDiv} title = {category_name} onClick = {e => this.categoryFilterPressed(e)} > {category_name} </CustomButton>
        );
      }
      temp_filter_categories.push(temp_filter_category);
    }
    return temp_filter_categories
  }

  //function populates the subcategories of all filter categories by making the appropriate calls to the API
  getFilterSubCategories() {
    let currentComponent = this;
    const axios = require("axios");

    //get eye diagnosis subcategories from database
    var link = apiBaseURL + "/ssd_api/get_distinct?special=eye_diagnosis";
    console.log("GETTING SUBCATEGORIES")
    console.log("link",link)
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Eye Diagnosis"] = response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //get systemic diagnosis subcategories from database
    var link = apiBaseURL + "/ssd_api/get_distinct?special=systemic_diagnosis";
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Systemic Diagnosis"] =
          response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //put age subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories;
    temp_filter_subcategories["Age"] = ["less", "greater", "equal", "between"];
    currentComponent.setState({
      filter_subcategories: temp_filter_subcategories
    });

    //put ethnicity subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories;
    temp_filter_subcategories["Ethnicity"] = [
      "Hispanic or Latino",
      "Not Hispanic or Latino",
      "Declined"
    ];
    currentComponent.setState({
      filter_subcategories: temp_filter_subcategories
    });

    //get image procedure type from database
    var link = apiBaseURL + "/ssd_api/get_distinct?table_name=image_procedure&col_name=image_procedure";
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Image Procedure Type"] =
          response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //get lab values from database
    var link = apiBaseURL + "/ssd_api/get_distinct?table_name=lab_value_deid&col_name=name";
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Labs"] = response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //get medication generic name from database
    var link = apiBaseURL + "/ssd_api/get_distinct?table_name=medication_deid&col_name=generic_name";
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Medication Generic Name"] =
          response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //get medication therapuetic name from database
    var link = apiBaseURL + "/ssd_api/get_distinct?table_name=medication_deid&col_name=therapeutic_class";
    axios
      .get(link)
      .then(function(response) {
        var temp_filter_subcategories =
          currentComponent.state.filter_subcategories;
        temp_filter_subcategories["Medication Therapuetic Name"] =
          response.data.result.data;
        currentComponent.setState({
          filter_subcategories: temp_filter_subcategories
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    //put vision subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories;
    temp_filter_subcategories["Left Vision"] = [
      "less",
      "greater",
      "equal",
      "between"
    ];
    temp_filter_subcategories["Right Vision"] = [
      "less",
      "greater",
      "equal",
      "between"
    ];
    currentComponent.setState({
      filter_subcategories: temp_filter_subcategories
    });

    //put pressure subcategories
    var temp_filter_subcategories = currentComponent.state.filter_subcategories;
    temp_filter_subcategories["Left Pressure"] = [
      "less",
      "greater",
      "equal",
      "between"
    ];
    temp_filter_subcategories["Right Pressure"] = [
      "less",
      "greater",
      "equal",
      "between"
    ];
    currentComponent.setState({
      filter_subcategories: temp_filter_subcategories
    });
  }

  createFilterSubcategoryDivs() {
    var input_categories = ["Age","Left Vision","Right Vision","Left Pressure","Right Pressure"]
    let temp_filter_subcategories_div = {}
    //goes through every category (e.g Eye Diagnosis) and every subcategory (e.g retenal edema) and creates a subcategory box
    for (var key in this.state.filter_subcategories) {
      var temp_subcategories = []
      console.log(key)
      for (var index in this.state.filter_subcategories[key]) {
        var name = this.state.filter_subcategories[key][index]
        if (input_categories.indexOf(key) === -1) {
          /* var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} style={styles.main_div_button_checkbox} />
              {name}
            </div> */
          var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} />
              {name}
            </div>
        }
        else if (name !== "between") {
          var temp_element = 
            <div>
              <input type ="checkbox" title = {key + ";" + name} onChange = {e => this.subcategoryFilterPressed(e)} style={styles.main_div_button_checkbox} />
              {name}
              <input type ="text" title = {key + ";" + name} onChange = {e => this.checkBoxChanged(e)} style={styles.main_div_button_text}/>
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
      <Col lg={3} sm={4} style = {styles.mainDivCategoryStyle}>
        <div style = {styles.mainDivButtonTitle}>
          {key}
        </div>
        {temp_subcategories}
      </Col>
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
      if (name === "Vision") {
        chosen_categories.push(this.state.filter_subcategories_div["Left Vision"])
        chosen_categories.push(this.state.filter_subcategories_div["Right Vision"])
      }
      else if (name === "Pressure") {
        chosen_categories.push(this.state.filter_subcategories_div["Left Pressure"])
        chosen_categories.push(this.state.filter_subcategories_div["Right Pressure"])
      }
      else {
        chosen_categories.push(this.state.filter_subcategories_div[name])
      }
    }
    return chosen_categories
  }

  //updates state.selected_categories according to categories selected
  categoryFilterPressed(e) {
    let category = e.target.title;
    if (this.state.selected_categories.indexOf(category) === -1) {
      this.state.selected_categories.push(category);
      this.setState({
        selected_categories: this.state.selected_categories
      });
    } else {
      var new_list = this.state.selected_categories.filter(function(name) {
        return name !== category;
      });
      this.setState({
        selected_categories: new_list
      });
    }
  }

  //updates state.selected_values according to subcategories selected
  subcategoryFilterPressed(e) {
    let event = e.target.title;
    let values = event.split(";");
    let category = values[0];
    let value = values[1];
    if (!this.state.selected_values[category]) {
      this.state.selected_values[category] = [value];
      this.setState({
        selected_values: this.state.selected_values
      });
    } else if (this.state.selected_values[category].indexOf(value) === -1) {
      this.state.selected_values[category].push(value);
      this.setState({
        selected_values: this.state.selected_values
      });
    } else {
      var temp_list = this.state.selected_values[category].filter(function(
        name
      ) {
        return name !== value;
      });
      var new_list = this.state.selected_values;
      new_list[category] = temp_list;
      this.setState({
        selected_values: new_list
      });
    }
  }

  //updates checkbox_values according to checkbox changed
  checkBoxChanged(e) {
    let value = e.target.value;
    let cat_and_sub = e.target.title.split(";");
    let category = cat_and_sub[0];
    let subcategory = cat_and_sub[1];

    let temp_checkbox = this.state.checkbox_values;
    if (!temp_checkbox[category]) {
      temp_checkbox[category] = {
        [subcategory]: value
      }
    }
    else {
      temp_checkbox[category][subcategory] = value
    }

    this.setState({
      checkbox_values: temp_checkbox
    })
    
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
  render() {
        console.log("state",this.state)
        let filter_categories = this.getFilterCategories()
        var chosen_filters = this.getSelectedFilters()
        return (
        <div className="content">
            <Grid fluid>
                <Row style = {styles.titleStyle}>
                    <Col lg={12} sm={8} style = {styles.titleText}>
                        <div>
                            Please Select Your Filters to Create a Patient Cohort
                        </div>
                    </Col>
                </Row>
                <Row style = {styles.underTitleStyle}>
                      <CustomButton style = {styles.buttonUpperSubmit} onClick={() => this.submitButtonPressed()}>SUBMIT</CustomButton>
                      <CustomButton style = {styles.buttonUpperReset} onClick={() => this.resetButtonPressed()}>RESET</CustomButton>
                </Row>
                <Row>
                    <Col lg={3} sm={3} style = {styles.sideDivStyle}>
                        {filter_categories}
                    </Col>
                    <Col lg={9} sm={6} style = {styles.mainDivStyle}>
                        <Grid fluid>
                          <Row>
                            {chosen_filters}
                          </Row>
                        </Grid>
                    </Col>
                </Row>
            </Grid>
        </div>
    );
  }
}

export default FilterPage;

const styles = {
    titleStyle: {
        "height": "10vh",
        "margin-bottom": "2vh",
    },
    titleText: {
        "display": "flex",
        "align-items": "center",
        "justify-content": "center",
        "font-weight": "bold",
        "font-size": "30px",
    },
    buttonDiv: {
        "width": "100%",
        "margin": "1vh",
        "background-color": "white",
        "color": "black",
        "border": "solid 2px black",
    },
    buttonDivPressed: {
      "width": "100%",
      "margin": "1vh",
      "background-color": "#78deec",
      "color": "black",
      "border": "solid 2px black",
  },
    sideDivStyle: {
        "height": "80vh",
    },
    mainDivStyle : {
        "height": "90vh",
    },
    mainDivCategoryStyle : {
        "height": "20vh",
        "overflow": "scroll",
        "border": "solid 2px black",
        "margin": "1vh",
    },
    mainDivButtonTitle: {
      "display": "flex",
      "justify-content": "center",
      "font-weight": "bold",
      "text-decoration": "underline",
    },
    underTitleStyle: {
      "display": "flex",
      "justify-content": "flex-end",
      "align-items": "flex-end",
      "padding-right": "16%"
    },
    buttonUpperSubmit: {
      "width": "15%",
      "margin-right": "1vh",
      "color": "black",
      "border": "solid 2px black",
      "font-weight": "bold",
      "background-color": "#a3ec9a",
    },
    buttonUpperReset: {
      "width": "15%",
      "margin-right": "1vh",
      "color": "black",
      "border": "solid 2px black",
      "font-weight": "bold",
      "background-color": "#ec585a",
    }
}

