import app from './app';
import environment from './utils/environment';

const PORT = environment.port();

app.listen(PORT);

console.log(`Server listening on PORT ${PORT}`);
