import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {fetchPosts} from "../../redux/slices/posts";
import styles from './TagPage.module.scss'


export const TagPage = () => {
	const {tag} = useParams();
	const [filteredPosts, setFilteredPosts] = useState([]);
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchPosts()).then((data) => {
			const postsWithTag = data.payload.filter(post => post.tags.includes(tag));
			setFilteredPosts(postsWithTag);
		})
	}, []);

	if (filteredPosts.length === 0) {
		return <h1>Нет статей по данному тегу</h1>
	}

	return (
		<>
			<h1 style={{marginBottom: 20}}>#{tag}</h1>
			<div>
				{filteredPosts?.map(post => (
					<Link key={post._id} className={styles.noLink} to={`/posts/${post._id}`}>
						<div>
							<small className={styles.author}>автор статьи: {post.user.fullName}</small>
							<img className={styles.image} src={`http://localhost:3333${post.imageUrl}`} alt=""/>
							<h3>{post.title}</h3>
							<p>{post.text}</p>
						</div>
					</Link>
				))}
			</div>
		</>

	);
};




