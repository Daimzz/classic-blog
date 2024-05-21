import React, {useEffect, useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {createComment} from "../../redux/slices/comment";
import {fetchComments} from "../../utils";
import {fetchAuthMe} from "../../redux/slices/auth";

export const AddComment = ({setCommentsData}) => {

  const [comment, setComment] = useState('')
  const [commentAuthorAvatar, setCommentAuthorAvatar] = useState('')
  const params = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAuthMe()).then( data => setCommentAuthorAvatar(data.payload.avatarUrl))
  }, []);

  const handleSubmit = async (e) => {
    try {
      await dispatch(createComment({ postId: params.id, comment }));
      await fetchComments({ params, dispatch, setCommentsData });
      setComment("");
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={`http://localhost:3333${commentAuthorAvatar}` || ""}
        />
        <div className={styles.form}>
          <form onSubmit={(e) => e.preventDefault() }>
            <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                label="Написать комментарий"
                variant="outlined"
                maxRows={10}
                multiline
                fullWidth
            />

            <Button onClick={handleSubmit} type="submit" variant="contained">Отправить</Button>
          </form>
        </div>

      </div>
    </>
  );
};
