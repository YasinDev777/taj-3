const stateBar = {currentState: false}

const activeReducer = (state = stateBar, action) =>{
    switch (action.type){
        case 'active':
            return { ...state, currentState: state.currentState === false ? true : false}
        default:
            return state
    }
}

export default activeReducer