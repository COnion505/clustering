import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './Dropzone.css';

export const Dropzone = (props) => {
	const onDrop = useCallback((acceptedFiles) =>{
		console.log('file uploaded: ',acceptedFiles[0])
		props.onDrop(acceptedFiles[0]);
	},[]);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<div className='dropzone' {...getRootProps()}>
			<input {...getInputProps()}/>
			<p>drag and drop csv file here.</p>
		</div>
	)


}