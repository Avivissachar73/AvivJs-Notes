const request = require('supertest');
const app = require('../server');


let _token;

const doLogin = async ({ username, password }) => {
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username, password });

    const res = loginRes.body.token;
    _token = res.token;
    return res;
}

const createReq = async (method = 'get', path = '/', data = null, query = {}) => {
    for (const key in query) query[key] = typeof query[key] === 'object' 
                                                    ? JSON.stringify(query[key])
                                                    : query[key];
    return request(app)
        [method](`/api/${path}`)
        // .set('authorization', _token)
        .set('Cookie', `token=${_token}`)
        .query(query)
        .send(data);
}

exports.doLogin = doLogin;
exports.createReq = createReq;



// const generateCreateReq = ({ email, password }) => {
//     return async (method = 'get', path = '/', data = null) => {
//         await doLogin({ email, password });
//         return createReq(method, path, data);
//     }
// }
// exports.generateCreateReq = generateCreateReq;
// exports.createReqWithDefaultUser = generateCreateReq({ email: 'Aviv@asd.com', password: 'asdasd' });