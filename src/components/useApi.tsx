import { useFetch} from 'use-http'
import { UseFetchArgs} from "use-http/dist/cjs/types";

export default  function useApi(...args:UseFetchArgs) {
    const apiUrl = process.env.REACT_APP_API_URL;

    return useFetch(apiUrl+""+args[0],args[1])
};
