import {getToken} from "../../utils/axios";
import axios from "axios";

const POLLUTANTS_BY_STATIONS = `${process.env.REACT_APP_API_URL}/api/pollutants-by-stations`

const token = getToken();

