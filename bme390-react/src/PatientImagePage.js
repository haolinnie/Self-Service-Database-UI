import React, { Component } from 'react';
import "./PatientImagePage.css";
import Table from './Table.js';
import axios from 'axios';

class PatientImagePage extends Component {
    constructor(props) {
        super(props);
        this.get_data = this.get_data.bind(this)
        this.get_filters = this.get_filters.bind(this)
        this.state = {
            PT_ID: this.props.app_state.prev_state.PT_ID,
            patient_history_data: [],
            original_filters: this.get_filters(),
            filters: this.get_filters(),
            export_dropdown: false,
        }
        this.get_data_categories = this.get_data_categories.bind(this)
        this.categories_selected = this.categories_selected.bind(this)
        this.show_hide_category_changed = this.show_hide_category_changed.bind(this)
        this.export_button_pressed = this.export_button_pressed.bind(this)
        this.export_filter_pressed = this.export_filter_pressed.bind(this)
        this.begin_export = this.begin_export.bind(this)
        this.export_category_selected = this.export_category_selected.bind(this)
        this.edit_patient_data = this.edit_patient_data.bind(this)
    }

    componentDidMount() {
        this.get_data()
    }

    export_button_pressed() {
        if (this.state.export_dropdown) {
            this.setState({export_dropdown:false})
        }
        else {
            this.setState({export_dropdown:[]})
        }
    }

    export_category_selected(category) {
        return (this.state.export_dropdown.indexOf(category) !== -1)
    }

    export_filter_pressed(category,item) {
        if (this.state[category].indexOf(item) === -1) {
            this.state[category].push(item)
            this.setState({[category]:this.state[category]})
        }
        else {
            var new_list = this.state[category].filter(function (name){
                return name !== item
            })
            this.setState({[category]:new_list})
        }
    }

    begin_export(){
        console.log(this.state.export_dropdown)
    }

    get_filters() {
        let filters = ["PT ID","Exam ID","Exam Date","Image ID","Image Procedure", "Image Laterality", "Link To Image"];
        return filters
    }

    get_data() {
        let currentState = this
        console.log(this.state)
        console.log(this.props)
        console.log(this.props.app_state.prev_state.PT_ID)
        let patient_ids = this.state.PT_ID
        let patient_ids_str = "pt_id=".concat(patient_ids)

        if (!patient_ids) {
            currentState.setState({"patient_history_data":[]})
            return
        } 

        for (var i = 1; i < patient_ids.length; i++) {
            let patient_id = patient_ids[i]
            patient_ids_str = patient_ids_str.concat("&pt_id=").concat(patient_id)
        }

        let link = "https://tigernie.com/ssd_api/patient_images?".concat(patient_ids_str)
            axios.get(link)
            .then(function (response) {
                let current_patient_data = currentState.state.patient_history_data
                current_patient_data.push(response.data)
                currentState.setState({"patient_history_data":current_patient_data}, () => {
                    currentState.edit_patient_data()
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    edit_patient_data(){
        let new_patient_history = []
        let old_patient_history = this.state.patient_history_data[0]

        console.log("editing")
        console.log(old_patient_history)
        
        for (var key in old_patient_history) {
            let first_row = {"PT ID": key, "Link To Image": "link-to-image"}
            for (var i = 0; i < old_patient_history[key].length; i++) {
                let row = JSON.parse(JSON.stringify(first_row))
                let exam = old_patient_history[key][i]
                if (exam["exam_date"]) {
                    row["Exam Date"] = exam["exam_date"].substring(0,16)
                }
                else {
                    row["Exam Date"] = "None"
                }
                if (exam["exam_id"]) {
                    row["Exam ID"] = exam["exam_id"]
                }
                else {
                    row["Exam ID"] = "None"
                }
                if (exam["images"]) {
                    for (var j = 0; j < exam["images"].length; j++) {
                        let temp_row = JSON.parse(JSON.stringify(row))
                        let image = exam["images"][j]
                        if (image["image_laterality"]){
                            temp_row["Image Laterality"] = JSON.parse(JSON.stringify(image["image_laterality"]))
                        }
                        else {
                            temp_row["Image Laterality"] = "None"
                        }
                        if (image["image_id"]) {
                            temp_row["Image ID"] = JSON.parse(JSON.stringify(image["image_id"]))
                        }
                        else {
                            temp_row["Image ID"] = "None"
                        }
                        if (image["image_procedure_id"]) {
                            temp_row["Image Procedure"] = JSON.parse(JSON.stringify(image["image_procedure_id"]))
                        }
                        else {
                            temp_row["Image Procedure"] = "None"
                        }
                        new_patient_history.push(temp_row)
                    }
                }
                else {
                    row["Image Procedure"] = "None"
                    new_patient_history.push(row)
                }
            }
        }
        this.setState({patient_history_data:new_patient_history})
    }

    get_data_categories() {
        let result = []
        for (var i in this.state.original_filters) {
            if (this.state.filters.indexOf(this.state.original_filters[i]) !== -1) {
                result.push(this.state.original_filters[i])
            }
        }
        return result
    }

    categories_selected(category) {
        return (this.state.filters.indexOf(category) !== -1)
    }

    show_hide_category_changed(item) {
        if (this.state.filters.indexOf(item) === -1) {
            this.state.filters.push(item)
            this.setState({filters:this.state.filters})
        }
        else {
            var new_list = this.state.filters.filter(function (name){
                return name !== item
            })
            this.setState({filters:new_list})
        }
    } 

    render() {
        let show_hide_filters = []
        for (var key in this.state.original_filters) {
            let category = this.state.original_filters[key]
            let show_hide_label = <div className="show_hide_category">
                <input type="checkbox" checked={this.categories_selected(category)} onChange = {() => this.show_hide_category_changed(category)} ></input>
                <label> {category} </label>
            </div>
            show_hide_filters.push(show_hide_label)
        }
        let export_dropdown = null;
        if (this.state.export_dropdown) {
            export_dropdown = <div className="export_dropdown">
                <div>
                    <input type="checkbox" checked={this.export_category_selected("by diagnosis")} onChange = {() => this.export_filter_pressed("export_dropdown","by diagnosis")}></input>
                    <label> by diagnosis </label>
                </div>
                <div>
                    <input type="checkbox" checked={this.export_category_selected("by image procedure")} onChange = {() => this.export_filter_pressed("export_dropdown","by image procedure")}></input>
                    <label> by image procedure </label>
                </div>
                <button className="export_button_concept" onClick={() => this.begin_export()}> Export Images</button>
            </div>
        }
        return (
            <div className = "whole_div">
                <div className = "title_div">
                    Individual Patient Images- ID: {this.props.app_state.prev_state.PT_ID}
                </div>
                <div className = "body_div_patient_images">
                    <div className = "show_hide_panel_images">
                        <div className = "show_hide_t_images">
                            Show/Hide
                            <div className="show_hide_c">
                                {show_hide_filters}
                            </div>
                        </div>
                    </div>
                    <div className="table_design_patient_images">
                        <Table patient_data = {this.state.patient_history_data} filters = {this.get_data_categories()} submit_function = {[["Link To Image",this.props.submit_function,"view image"]]} ></Table>
                    </div>
                </div>
                <div className = "bottom_div_images">
                    <button className = "button_concept" onClick={() => this.props.submit_function("patients",this.props.filters)}> Back To Patients Page</button>
                    <button className = "button_concept" onClick={() => this.export_button_pressed()}> Export All Images for Patient</button>
                    {export_dropdown}
                </div>
            </div>
        )
    }
}

export default PatientImagePage;