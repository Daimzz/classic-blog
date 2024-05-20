import {getPostComments} from "./redux/slices/comment";


export const fetchComments = async ({ params, dispatch, setCommentsData }) => {
  try {
    const response = await dispatch(getPostComments(params.id))
    setCommentsData(response.payload)
  } catch (e) {
    console.log(e);
  }
}