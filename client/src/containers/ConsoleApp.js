import { insert, inputTask } from "../actions/resources";
import ConsoleApp from "../components/ConsoleApp";
import { connect } from 'react-redux';

function mapStateToProps({ task, tasks }){
    return {
        task,
        tasks
    };
}

function mapDispatchToProps(dispatch) {
    return {
        insert(task){
            dispatch(insert(task));
        },
        inputTask(task){
            dispatch(inputTask(task))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleApp);