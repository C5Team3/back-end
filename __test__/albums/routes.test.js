const testServer = require('../../utils/testServer');

describe(`[${baseMock} Endpoints]`, () => {

    const route = require('../../api/components/album/routes');
    const request = testServer(route);

    describe(`Routes ${baseMock}`, () => {
        it(`[GET] should return a collection of ${baseMock}`, async () => {
            const res = await request.get(baseRoute)
                .end((err, res) => {
                    expect(res.body).toMatchObject({
                        error: expect.any(Boolean),
                        status: expect.any(Number),
                        data: expect.any(Object)
                    });
                    done();
                });
        });

        it(`[GET] Should return a collection of ${baseMock}`, function (done) {
            request.get(`${baseRoute}/${eventId}`)
                .set('x-access-token', token)
                .end((err, res) => {
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