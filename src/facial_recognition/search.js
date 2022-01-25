const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');

async function search(imgDescriptor) {

    found = false;
    let correspondance_list = [];
    let id = 0;
    let i = 1;
    let referencePath;
    genre = imgDescriptor.genre;
    const personNumber = fs.readdirSync(`./public/faces/${genre}s`).length;
    // asesy ny sary anakiroa
    while (i <= 2 && found == false) {
        //tetezina ny olona tsirairay / genre
        for (let j = 1; j <= personNumber; j++) {
            //manomboka 1 ny id, id an'olona iray ihany ny anarana dossier misy azy anaty dir
            id++;
            referencePath = `./public/faces/${genre}s/${id}/${i}.json`;
            //comparena ilay imgDescriptor (ilay descriptor an'olona tadiavina)
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
            /**raha kely noho ny treshold ny resultat an'ny comparaison dia marquena true ny found satria misy tarehy izany
             * atsofoka anaty liste ana correspondance ny id an'izay inferieur an'ny treshold
             */
            if (compareResult < 0.45) {
                found = true;
                correspondance_list.push({
                    id: id
                });
                //raha infreiur an'ny 0.3 ny distance azo avy amin'ny comparaison dia hita avy hatrany ilay olona
                if (compareResult < 0.3) {
                    return {
                        id: id,
                        difference: compareResult
                    };
                }
            }
        }
        //raha iray fotsiny ny ao anaty liste ana correspondace, dia izy avy hatrany ilay tadiavina
        if (correspondance_list.length == 1) {
            return {
                id: id,
                difference: compareResult
            };
            //raha vide ny liste sady efa ireo sary faharoa no nojerena dia tsy mbola fantatra ilay olona
        } else if (correspondance_list.length == 0 && i == 2) {
            return {
                id: 0,
                difference: 1
            }
        } else if (correspondance_list.length == 0) {
            //raha vide ilay liste de mifindra ao amin'ny sary faharoa
            i = 2;
        } else {
            //rahamihoatra ny 1 ny anaty liste
            max = {
                id: null,
                difference: 0.45
            };
            //ilay liste ana sary manaraka no tohizana anaovana comparaison
            tmp = i++;
            array.forEach((el, index, correspondance_list) => {
                //chemin makany amin'ny descriptor
                referencePath = `./public/faces/${genre}s/${el.id}/${tmp}.json`;
                //comparaison
                let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
                //izay manana distance manakaiky an'ny 0 indrindra no izy
                if (compareResult < max.difference) {
                    max = {
                        id: el.id,
                        difference: compareResult
                    }
                }
            });
            return max;
        }
    }
    return 404;
}
module.exports.search = search;