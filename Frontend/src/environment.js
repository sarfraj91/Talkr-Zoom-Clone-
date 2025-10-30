let IS_PROD = true;
const server = IS_PROD ?
    "https://talkr-backend.onrender.com":"http://localhost:8000";

    
let local="http://localhost:8000";

export default {server,local};
