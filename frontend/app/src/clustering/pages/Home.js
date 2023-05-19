import React from "react";
import { Dropzone } from "../../Dropzone";
import { ClusterInfo } from "../../ClusterInfo";
import "react-widgets/styles.css";
import NumberPicker from "react-widgets/NumberPicker";
// import Select from 'react-select';
export default class Home extends React.Component{
	constructor( props ) {
		super(props);
		this.state = {
			csv: null,
			json: null,
			loading: false,
			file: null,
			uploaded: false,
			fileName: "",
			fileSize: "",
			n_clusters: 2,
		}
	}
	dropHandler = (file) => {
		const formData = new FormData();
		formData.append("File",file);
		this.setState({
			file: file,
			uploaded: true,
			fileName: file.name,
			fileSize: file.size});
	}
	set_json = () => {
		if(this.state.file !== null){
			this.set_loading(true);
			const formData = new FormData();
			formData.append("File",this.state.file);
			formData.append("n_clusters",this.state.n_clusters);
			fetch(`http://localhost:8080/clustering/exec/`,{
				method: "POST",
				body: formData,
			})
			.then((response) =>{
				return response.json();
			})
			.then( (data) => {
				this.setState({json: JSON.parse(data)});
				this.set_loading(false);
			})
		}
	}
	set_loading = ( flg ) => {
		this.setState({loading: flg});
	}
	handleClick = () => {
		this.set_json();
	}
	nClustersPicker = (disabled) => {
	//2から11
	return(
		<NumberPicker max={11} min={2} defaultValue={6} disabled={disabled} onChange={v => this.setState({n_clusters: v})}/>
		);
}
	// nClustersPicker = (disabled) => {
	// 	const options = 
	// 	return(
	// 		<select>

	// 		</select>
	// 		);
	// }
	render(){
		return (
			<div>
				<div className="home">
					<Dropzone className="dropzone" onDrop={(d) => {this.dropHandler(d);}}/>
					{this.state.uploaded?<p>{this.state.fileName} - {this.state.fileSize} bytes</p> : <p></p>}
					{this.nClustersPicker( ! this.state.uploaded )}
					<button onClick={() => {this.handleClick();}} disabled={this.state.file == null || this.state.loading}>実行</button>
					<div>
					{ this.state.loading ?
						<p>now loading...</p>
						:
						this.state.file == null ?
						<p>clustering information will be displayed here.</p>
						:
						<ClusterInfo json={this.state.json}/>
					}
					</div>
				</div>
			</div>
		);
	}
}
