const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');
const createDescriptorFile = require('./createDescriptorFile.js');
const perf = require("perf_hooks");

async function searchProcess(imgDescriptor) {
    found = false;
    let distanceResult;
    let correspondance_list = [];
    let id = 0;
    let i = 1;
    let referencePath;
    genre = imgDescriptor.gender;
    const personNumber = fs.readdirSync(`./static/persons/${genre}s`).length;
    // asesy ny sary anakiroa
    while (i <= 2 && found == false) {
        //tetezina ny olona tsirairay / genre
        for (let j = 1; j <= personNumber; j++) {
            //manomboka 1 ny id, id an'olona iray ihany ny anarana dossier misy azy anaty dir
            
            referencePath = `./static/persons/${genre}s/${j}/${i}.json`;
            //comparena ilay imgDescriptor (ilay descriptor an'olona tadiavina)
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
            compareResult = (await compareResult).distance;
            /**raha kely noho ny treshold ny resultat an'ny comparaison dia marquena true ny found satria misy tarehy izany
             * atsofoka anaty liste ana correspondance ny id an'izay inferieur an'ny treshold
             */
            console.log(compareResult);
            if (compareResult < 0.5) {
                found = true;
            } else {
                found = false;
            }

            if (compareResult < 0.45) {
                found = true;
                correspondance_list.push({
                    id: j,
                    difference: compareResult
                });
                console.log(`Correspondance ${genre} ${j} ${i}`);
                //raha inferieur an'ny 0.3 ny distance azo avy amin'ny comparaison dia hita avy hatrany ilay olona
                if (compareResult < 0.3) {
                    return {
                        id: j,
                        difference: compareResult
                    };
                }
            } else {
                console.log(`Not ${genre} ${j} ${i}`);
            }
        }
        console.log(correspondance_list);
        //raha iray fotsiny ny ao anaty liste ana correspondace, dia izy avy hatrany ilay tadiavina
        if (correspondance_list.length == 1) {
            console.log("un seul");
            return correspondance_list[0];
            //raha vide ny liste sady efa ireo sary faharoa no nojerena dia tsy mbola fantatra ilay olona
        } else if (correspondance_list.length == 0 && i == 2) {
            console.log("not found");
            return "not found";
        } else if (correspondance_list.length == 0) {
            //raha vide ilay liste de mifindra ao amin'ny sary faharoa
            i = 2;
            j = 1;
        } else {
            //rahamihoatra ny 1 ny anaty liste
            max = {
                id: null,
                difference: 0.45
            };
            //ilay liste ana sary manaraka no tohizana anaovana comparaison
            tmp = i++;
            correspondance_list.forEach((el, index = 0, correspondance_list) => {
                //chemin makany amin'ny descriptor
                referencePath = `./static/persons/${genre}s/${el.id}/${tmp}.json`;
                //comparaison
                compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);

                //izay manana distance manakaiky an'ny 0 indrindra no izy
                if (compareResult.distance < max.difference || max.id == null) {
                    max = {
                        id: el.id,
                        distance : compareResult.distance
                    }
                }
            });
            return max;
        }
    }
    console.log("not found");
    return "not found";
}


const search = async (fileName) => {
    
    console.log("Start descripting");
    imgDescriptor = await createDescriptorFile.description(`uploads/${fileName}`);
    
    searchResult = await searchProcess(imgDescriptor);
    console.log(searchResult);
    if (searchResult === "not found") {
        console.log("Personne inconnue");
    } else {
        console.log(`ID trouvé: ${searchResult.id}`);
    }
    return searchResult;
}
search(`unk.jpg`);
module.exports.search = search;