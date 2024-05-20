import React, {useRef, useState} from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import axios from "../../axios";


export const Registration = () => {
	const isAuth = useSelector(selectIsAuth)
	const [imageUrl, setImageUrl] = useState('');
	const inputAvatarRef = useRef(null);
	const dispatch = useDispatch()
	const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({
		defaultValues: {
			avatarUrl: imageUrl,
			fullName: '',
			email: '',
			password: ''
		},
		mode: 'onChange'
	})
	const handleAvatarFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file);
			// const {data} = await axios.post('/avatars', formData);
			const {data} = await axios.post('/upload/avatars', formData);

			setImageUrl(data.url)
		} catch (e) {
			console.warn(e)
			alert('Ошибка при загрузке аватарки!')
		}
	};
	const onClickRemoveImage = () => {
		setImageUrl('')
	};


	const onSubmit = async ({fullName, email, password}) => {
		const values = {fullName, email, password, avatarUrl: imageUrl}
		console.log(values)
		const data = await dispatch(fetchRegister(values))
		if (!data.payload) {
			alert('Не удалось зарегистрироваться')
		}
		console.log(data)
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		} else {
			alert('Не удалось зарегистрироваться')
		}
	}


	if (isAuth) {
		return <Navigate to={'/'}/>
	}
	return (
		<Paper classes={{root: styles.root}}>
			<Typography classes={{root: styles.title}} variant="h5">
				Создание аккаунта
			</Typography>

			<div className={styles.avatar}>
				<Avatar src={`http://localhost:3333${imageUrl}`} sx={{width: 100, height: 100}}/>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
					<Button onClick={() => inputAvatarRef.current.click()} variant="outlined" size="large">
						Выберите аватарку
					</Button>
					<input ref={inputAvatarRef} type="file" onChange={handleAvatarFile} hidden/>
					{imageUrl && (
						<Button variant="contained" color="error" onClick={onClickRemoveImage}>
							Х
						</Button>
					)}
				</div>

				<TextField type={'text'}
				           error={Boolean(errors.fullName?.message)}
				           helperText={errors.fullName?.message}
				           {...register('fullName', {required: 'Укажите полное имя'})} className={styles.field}
				           label="Полное имя"
				           fullWidth/>
				<TextField type={'email'}
				           error={Boolean(errors.email?.message)}
				           helperText={errors.email?.message}
				           {...register('email', {required: 'Укажите почту'})} className={styles.field} label="E-Mail"
				           fullWidth/>
				<TextField type={'password'}
				           error={Boolean(errors.password?.message)}
				           helperText={errors.password?.message}
				           {...register('password', {required: 'Укажите пароль'})} className={styles.field}
				           label="Пароль"
				           fullWidth/>
				<Button disabled={!isValid} type={'submit'} size="large" variant="contained" fullWidth>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
