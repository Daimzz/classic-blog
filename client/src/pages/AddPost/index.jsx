import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
	const {id} = useParams()
	const navigate = useNavigate()
	const [imageUrl, setImageUrl] = useState('');
	const [_, setIsLoading] = useState(false);
	const isAuth = useSelector(selectIsAuth)
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const inputFileRef = useRef(null);

	const isEditing = Boolean(id);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file);
			const {data} = await axios.post('/upload', formData);
			setImageUrl(data.url)
		} catch (e) {
			console.warn(e)
			alert('Ошибка при загрузке файла!')
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('')
	};

	const onChange = useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setIsLoading(true)
			const fields = {
				title,
				imageUrl,
				text,
				tags
			}
			const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) :  await axios.post('/posts', fields)
			const _id = isEditing ? id : data._id
			navigate(`/posts/${_id}`)
		} catch (e) {
			console.warn(e)
			alert('Ошибка при создании статьи!')
		}
		setIsLoading(false)
	}

	useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({data}) => {
				setTitle(data.title)
				setText(data.text)
				setTags(data.tags.join(','))
				setImageUrl(data.imageUrl)
			}).catch(err => {
				console.warn(err)
				alert('Ошибка при получении статьи!')
			})
		}
	},[])

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			hideIcons: ['side-by-side', 'fullscreen'],
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/"/>
	}


	return (
		<Paper style={{padding: 30}}>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
					Загрузить превью
				</Button>
				<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
				{imageUrl && (
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Удалить
					</Button>
				)}
			</div>
			{imageUrl && (
				<img className={styles.image} src={`http://localhost:3333${imageUrl}`} alt="Uploaded"/>
			)}

			<br/>
			<br/>
			<TextField
				classes={{root: styles.title}}
				variant="standard"
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="Заголовок статьи..."
				fullWidth
			/>
			<TextField value={tags} onChange={e => setTags((e.target.value))} classes={{root: styles.tags}}
			           variant="standard" placeholder="Тэги" fullWidth/>
			<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
