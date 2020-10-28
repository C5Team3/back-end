const albumsMock = [
    {
        "id":"5f904d5a7c9908ab04f0e0d8",
        "title": "BASADO EN UNA HISTORIA MUY FALSA",
        "year": "2018",
        "about": "UN NUEVO ALBUM",
        "cover_img": "https://images.squarespace-cdn.com/content/v1/5ba161f245776eeed1027ece/1541812441724-3LTSVQH2EALH9JK8IXI0/ke17ZwdGBToddI8pDm48kPx25wW2-RVvoRgxIT6HShBZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpwGbtSA7WutlFA3XjmDXUDFwmxX_uEhqHOBUlPnU0mYmf1Qvd6diXKmxQIX-f1CXeo/a0337006630_5.jpg",
        "artist_Id": "5f904a77041ceda9b2a17124"
    },
    {
        "id":"5DE8nkIWwejWJuT00yeHDq",
        "title": "Big Bang",
        "year": "1994",
        "about": "UN NUEVO ALBUM",
        "cover_img": "https://i.scdn.co/image/ab67616d0000485135bf8a2179962114b8ec7585",
        "artist_Id": "5f904a77041ceda9b2a17124"
    }
]

class Albums {
    constructor(data) {
        this.data = data || false;
    }
    async getAlbums() {
        console.log('LLegó a getAlbums mock');
        return Promise.resolve(albumsMock);
    }    

    async createAlbum() {
        return Promise.resolve(albumsMock[0]);
    }
}

module.exports = {
    albumsMock,
    Albums
}