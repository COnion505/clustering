import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

export const Header = () =>{
	return(
		<div className='clustering-header'>
			<ul className='clustering-header-ul'>
				<li className='clustering-header-li'><Link to='/clustering'>clustering</Link></li>
			</ul>
		</div>
	)
}