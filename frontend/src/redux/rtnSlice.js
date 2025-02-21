import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[], // [1,2,3]
        messageNotification:[]
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type === 'like'){
                state.likeNotification.push(action.payload);
            }else if(action.payload.type === 'dislike'){
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId);
            }
        },
        addMessageNotification: (state, action) => { // ✅ New reducer for message notifications
            state.messageNotification.push(action.payload);
        },
        removeMessageNotification: (state, action) => {
            state.messageNotification = state.messageNotification.filter(n => n.userId !== action.payload);
        }

    }
});
export const {setLikeNotification, addMessageNotification, removeMessageNotification} = rtnSlice.actions;
export default rtnSlice.reducer;