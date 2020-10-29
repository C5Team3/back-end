const testServer = require('../../utils/testServer');

const baseRoute = '/api/album';
// const baseMock = 'Album';

describe(`[Album Endpoints]`, () => {

    const route = require('../../api/components/album/routes');
    const request = testServer(route);

    describe(`Routes Album`, () => {
        
        it(`[GET] should return a collection of Album`, async () => {
            request.get(baseRoute).end((req, res) => {
                expect(res.status).toBe(200); //agregué esto para checar status
                expect(res.body).toMatchObject({
                    error: expect.any(Boolean),
                    status: expect.any(Number),
                    data: expect.any(Object)
                });
            done();
            });
        });
    });
});