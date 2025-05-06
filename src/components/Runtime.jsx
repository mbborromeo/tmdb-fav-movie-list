import { formatRuntimeHoursAndMinutes } from '../utils/formatting';

const Runtime = ({ runtime }) => {
    return (
        <div>
            <b>Runtime:</b> {runtime && formatRuntimeHoursAndMinutes(runtime)}
        </div>
    );
};

export default Runtime;
