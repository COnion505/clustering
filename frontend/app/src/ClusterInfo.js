import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { convDispName } from "./util";
import "./ClusterInfo.css"

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
  } from "recharts";

export const ClusterInfo = (states) => {
	if (states.json == null){
		return (<div></div>);
	}
	const json_data = states.json

	return (
		<div>
			<Tabs>
				<TabList>
					{
						json_data.map((c) => {
							return (<Tab>{c["cluster_no"]}</Tab>);
						})
					}
				</TabList>
				{
					json_data.map((c) => {
						return (
						<TabPanel>
							<div className="whole-info" >
								<table>
									<tbody>
										<tr>
											<th>件数</th>
											<th>{c.whole_info["count"].toLocaleString("en-US")}</th>
											<th>件数シェア</th>
											<th>{c.whole_info["count_share"]}</th>
										</tr>
										<tr>
											<th>商品1合計金額</th>
											<th>{c.whole_info["sales1_amount"].toLocaleString("en-US")}</th>
											<th>商品1シェア</th>
											<th>{c.whole_info["sales1_share"]}</th>
										</tr>
										<tr>
											<th>商品2合計金額</th>
											<th>{c.whole_info["sales2_amount"].toLocaleString("en-US")}</th>
											<th>商品2シェア</th>
											<th>{c.whole_info["sales2_share"]}</th>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="columns-info" style={{display: "flex", flexFlow: "row wrap", marginTop: "100px"}}>
								{c.columns.map((column) => {
									let height = column.categories.length > 20 ? (column.categories.length * 20) : 300;
									let data = column.categories;
									return(
									<div className="column-info" style={{border: "solid 1px"}}>
										<h5 style={{margin: "10px 0 3px 0"}}>{convDispName(column.column_name)}</h5>
										<div style={{display: "flex", flexDirection: "row wrap"}}>
											<BarChart
												width={100}
												height={height}
												layout={"vertical"}
												barSize={10}
												data={data}
												margin={{
												top: 30,
												right: 10,
												left: 0,
												bottom: 30
												}}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<YAxis dataKey="category_name" type="category" interval={0} tick={{fontSize: 8}} />
												<XAxis type="number" tick={{fontSize: 8}} />
												<Tooltip />
												<Bar dataKey="value" fill="#8884d8" />
											</BarChart>
											<BarChart
												width={100}
												height={height}
												layout={"vertical"}
												barSize={10}
												data={data}
												margin={{
												top: 30,
												right: 10,
												left: 0,
												bottom: 30
												}}
											>
												<YAxis hide={true} width={0} dataKey="category_name" type="category" interval={0} tick={{fontSize: 8}} />
												<XAxis type="number" tick={{fontSize: 8}} />
												<CartesianGrid strokeDasharray="3 3" />
												<ReferenceLine x={0} stroke="green" />
												<Tooltip />
												<Bar dataKey="difference" fill="#edde7b" />
											</BarChart>
										</div>
									</div>)
								})}
							</div>
						</TabPanel>
						);
					})
				}
			</Tabs>
		</div>
	);
}