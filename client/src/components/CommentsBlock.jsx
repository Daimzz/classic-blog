import React from "react";
import {AiFillDelete} from "react-icons/ai";
import {SideBlock} from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import {useDispatch} from "react-redux";
import {removeComment} from "../redux/slices/comment";

export const CommentsBlock = ({isHomePage, items, children, isLoading = true, setDeleteCommentFlag, deleteCommentFlag}) => {
	const dispatch = useDispatch()
	console.log(items)
	const deleteCommentHandler = async ({postId, commentId}) => {
		try {
			await dispatch(removeComment({ postId, commentId }));
			setDeleteCommentFlag(!deleteCommentFlag);
		} catch (error) {
			console.error("Failed to delete comment", error);
		}
	}


	return (
		<SideBlock title="Последние комментарии">
			  <List>
					{(isLoading ? [...Array(5)] : items).map((obj, index) => (

						<React.Fragment key={index}>
							<ListItem alignItems="flex-start">
								<ListItemAvatar>
									{isLoading ? (
										<Skeleton variant="circular" width={40} height={40}/>
									) : (
										<Avatar alt={obj.user.fullName} src={`http://localhost:3333${obj.user.avatarUrl}`}/>

									)}
								</ListItemAvatar>
								{isLoading ? (
									<div style={{display: "flex", flexDirection: "column"}}>
										<Skeleton variant="text" height={25} width={120}/>
										<Skeleton variant="text" height={18} width={230}/>
									</div>
								) : (
									<div style={{display: "flex", position: "relative", width: '100%'}}>

										<ListItemText
											primary={obj.user.fullName}
											secondary={obj.text}
										/>
										{!isHomePage && (
											<AiFillDelete
												onMouseOver={e => e.currentTarget.style.color = 'red'}
												onMouseOut={e => e.currentTarget.style.color = 'black'}
												onClick={() => deleteCommentHandler({postId: obj.user.postId, commentId: obj.user.commentId})} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer'}}/>
										)}
									</div>
								)}
							</ListItem>
							<Divider variant="inset" component="li"/>
						</React.Fragment>
					))}
				</List>
				{children}

			</SideBlock>
	);
};
