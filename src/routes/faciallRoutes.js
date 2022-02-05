
const search = (app) => {
    app.route('/search')
        .post('/', upload.single('image'), async (req, res) => {
            //post image à rechercher identité
            //return l'id de la personne trouvé
            var image = req.image;
            results = await search(`${fileName}`);
            console.log(results);
            res.send(apiResponse(results));
        });

    const apiResponse = (results) => {
        return JSON.stringify({
            "response": results
        });
    }
}
module.exports.routes = routes;

//<>